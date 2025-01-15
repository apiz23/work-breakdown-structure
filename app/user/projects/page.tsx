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
import { ArrowLeft } from "lucide-react";
import { fetchUserById } from "@/services/user";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Project } from "@/lib/interface";

export default function Page() {
	const [search, setSearch] = useState<string>("");
	const [projects, setProjects] = useState<Project[]>([]);
	const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
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
			toast.error("");
			const filtered = projects.filter((project) =>
				project.name.toLowerCase().includes(search.toLowerCase())
			);
			setFilteredProjects(filtered);
		}
	};

	const handleViewProject = (projectId: string) => {
		router.push(`/user/projects/${projectId}`);
	};

	return (
		<>
			<ArrowLeft className="w-8 h-8" onClick={() => router.back()} />
			<Breadcrumb className="mx-auto w-fit mb-4">
				<BreadcrumbList className="text-center">
					<BreadcrumbItem>
						<BreadcrumbLink href="/user">Home</BreadcrumbLink>
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
					{filteredProjects.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{filteredProjects.map((project) => (
								<>
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
								</>
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
