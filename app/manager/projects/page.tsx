"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Project } from "@/lib/interface";
import { Label } from "@/components/ui/label";
import { addProject } from "@/services/project";
import { ArrowLeft } from "lucide-react";
import { fetchUserById } from "@/services/user";
import { insertLog } from "@/services/log";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Page() {
	const [search, setSearch] = useState<string>("");
	const [projects, setProjects] = useState<Project[]>([]);
	const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

	const [projectName, setProjectName] = useState("");
	const [projectDesc, setProjectDesc] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const router = useRouter();

	useEffect(() => {
		const fetchProjects = async () => {
			const userId = sessionStorage.getItem("userId");
			if (!userId) {
				console.error("User ID not found in sessionStorage.");
				return;
			}

			try {
				const projectsResponse = await fetch("/api/projects");
				const projectsData: Project[] = await projectsResponse.json();

				const userData = await fetchUserById(userId);

				if (userData && userData.project_assign) {
					const filtered = projectsData.filter((project) =>
						userData.project_assign.includes(project.id)
					);

					setProjects(filtered);
					setFilteredProjects(filtered);
				} else {
					console.error("User data or project assignments are missing.");
					toast.error("No projects assigned to the user.");
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Failed to fetch projects. Please try again.");
			}
		};

		fetchProjects();
	}, []);

	const handleSearch = () => {
		if (!search.trim()) {
			toast.error("Please enter a project name to search.");
			setFilteredProjects(projects);
		} else {
			const filtered = projects.filter((project) =>
				project.name.toLowerCase().includes(search.toLowerCase())
			);
			setFilteredProjects(filtered);
		}
	};

	const handleViewProject = (projectId: string) => {
		router.push(`/manager/projects/${projectId}`);
	};

	const handleAddProject = async () => {
		if (!projectName || !projectDesc || !startDate || !endDate) {
			toast.error("Please fill in all fields.");
			return;
		}

		try {
			const newProject = {
				name: projectName,
				desc: projectDesc,
				start_date: startDate,
				end_date: endDate,
			};

			await addProject(newProject);

			toast.success("Project added successfully.");

			await insertLog(
				null,
				`Added project: ${projectName}`,
				undefined,
				"project",
				"success",
				`Project details: Name: ${projectName}, Desc: ${projectDesc}, Start Date: ${startDate}, End Date: ${endDate}`
			);

			setProjectName("");
			setProjectDesc("");
			setStartDate("");
			setEndDate("");
		} catch (error: any) {
			toast.error("Failed to add project.");
			await insertLog(
				null,
				`Failed to add project: ${projectName}`,
				undefined,
				"project",
				"failure",
				`Error: ${error.message}`
			);
		}
	};

	return (
		<>
			<ArrowLeft className="w-8 h-8" onClick={() => router.back()} />
			<Breadcrumb className="mx-auto w-fit mb-4">
				<BreadcrumbList className="text-center">
					<BreadcrumbItem>
						<BreadcrumbLink href="/manager">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Projects</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="max-w-4xl mx-auto p-4">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-5 text-center">
					Project List
				</h1>

				<div className="flex justify-between mb-4 mt-10 gap-5">
					<Input
						type="text"
						placeholder="Search Project..."
						className="border-2 w-full"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<Button className="font-bold py-2 px-4 rounded" onClick={handleSearch}>
						Search
					</Button>
				</div>

				<div className="mt-10">
					<Dialog>
						<div className="flex justify-end mb-5">
							<DialogTrigger>
								<Button variant="default" className="capitalize">
									Add New Project
								</Button>
							</DialogTrigger>
						</div>
						<DialogContent>
							<DialogHeader>
								<DialogTitle className="capitalize">Add New Project</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<div className="grid gap-4">
									<Input
										type="text"
										placeholder="Project Name"
										value={projectName}
										onChange={(e) => setProjectName(e.target.value)}
									/>
									<Input
										type="text"
										placeholder="Description"
										value={projectDesc}
										onChange={(e) => setProjectDesc(e.target.value)}
									/>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="col-span-1">
											<Label className="ps-1">Start Date</Label>
											<Input
												type="date"
												placeholder="Start Date"
												value={startDate}
												onChange={(e) => setStartDate(e.target.value)}
												className="w-full"
											/>
										</div>
										<div className="col-span-1">
											<Label className="ps-1">End Date</Label>
											<Input
												type="date"
												placeholder="End Date"
												value={endDate}
												onChange={(e) => setEndDate(e.target.value)}
												className="w-full"
											/>
										</div>
									</div>
									<Button onClick={handleAddProject}>Add Project</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
					{filteredProjects.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{filteredProjects.map((project) => (
								<Card key={project.id}>
									<CardHeader>
										<CardTitle className="font-semibold capitalize">
											{project.name}
										</CardTitle>
										<CardDescription className="font-medium">
											Total Mandays: {project.total_mandays}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex justify-end">
											<Button
												variant="default"
												onClick={() => handleViewProject(project.id.toString())}
											>
												View
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<p className="text-gray-500">No projects found.</p>
					)}
				</div>
			</div>
		</>
	);
}
