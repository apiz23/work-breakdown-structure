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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Project } from "@/lib/interface";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function Page() {
	const [search, setSearch] = useState<string>("");
	const [projects, setProjects] = useState<Project[]>([]);
	const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
	const router = useRouter();

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await fetch("/api/projects");
				const projectsResult = await response.json();
				setProjects(projectsResult || []);
				setFilteredProjects(projectsResult || []);
				console.log(projectsResult);
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("An error occurred while fetching data.");
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

	return (
		<>
			<ArrowLeft className="w-8 h-8" onClick={() => router.back()} />
			<Breadcrumb className="mx-auto w-fit mb-4">
				<BreadcrumbList className="text-center">
					<BreadcrumbItem>
						<BreadcrumbLink href="/admin">Home</BreadcrumbLink>
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
									<Dialog>
										<Card key={project.id}>
											<CardHeader>
												<CardTitle className="font-semibold capitalize">
													{project.name}
												</CardTitle>
												<CardDescription className="font-medium">
													<Badge variant="outline">{project.status}</Badge>
												</CardDescription>
											</CardHeader>
											<CardContent>
												<div className="flex justify-end">
													<DialogTrigger>
														<Button variant="default">View</Button>
													</DialogTrigger>
												</div>
											</CardContent>
										</Card>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Project Details: {project.name}</DialogTitle>
												<DialogDescription>{project.desc}</DialogDescription>
											</DialogHeader>
											<div className="flow-root text-white">
												<dl className="-my-3 divide-y divide-gray-100 text-sm">
													{[
														{ label: "Id", value: project.id },
														{ label: "Status", value: project.status },
														{ label: "Mandays", value: project.total_mandays },
														{ label: "Duration (Days)", value: project.completion },
													].map((item, index) => (
														<div
															key={index}
															className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4"
														>
															<dt className="font-medium capitalize">{item.label}</dt>
															<dd className="sm:col-span-2">{item.value}</dd>
														</div>
													))}
												</dl>
											</div>
										</DialogContent>
									</Dialog>
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
