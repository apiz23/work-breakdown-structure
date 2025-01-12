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
import { addProject } from "@/app/api/project/route";
import { Label } from "@/components/ui/label";

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
			try {
				const response = await fetch("/api/project");
				const data = await response.json();
				setProjects(data);
				setFilteredProjects(data);
			} catch (error) {
				toast.error("Failed to fetch projects.");
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
			setProjectName("");
			setProjectDesc("");
			setStartDate("");
			setEndDate("");
		} catch {
			toast.error("Failed to add project.");
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-4">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-5 text-center">
				Work Breakdown Structure
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
									<CardTitle className="font-semibold">{project.name}</CardTitle>
									<CardDescription className="font-medium justify-end flex">
										{project.completion} {project.status}
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
	);
}
