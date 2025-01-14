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
import { Task, Project } from "@/lib/interface";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function Page() {
	const [search, setSearch] = useState<string>("");
	const [tasks, setTasks] = useState<Task[]>([]);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProject, setSelectedProject] = useState<string>("");
	const router = useRouter();

	useEffect(() => {
		const fetchProjectsAndTasks = async () => {
			try {
				const projectsResponse = await fetch("/api/projects");
				const projectsResult = await projectsResponse.json();

				if (!projectsResponse.ok) {
					toast.error(projectsResult.error || "Failed to fetch projects.");
					return;
				}

				setProjects(projectsResult || []);

				const tasksResponse = await fetch("/api/tasks");
				const tasksResult = await tasksResponse.json();

				if (!tasksResponse.ok) {
					toast.error(tasksResult.error || "Failed to fetch tasks.");
					return;
				}

				setTasks(tasksResult.tasks || []);
				setFilteredTasks(tasksResult.tasks || []);
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("An error occurred while fetching data.");
			}
		};

		fetchProjectsAndTasks();
	}, []);

	const handleProjectChange = (projectId: string) => {
		setSelectedProject(projectId);
		if (projectId === "") {
			setFilteredTasks(tasks);
		} else {
			const filtered = tasks.filter((task) => task.project_id === projectId);
			setFilteredTasks(filtered);
		}
	};

	const handleSearch = () => {
		if (!search.trim()) {
			toast.error("Please enter a task name to search.");
			setFilteredTasks(
				selectedProject
					? tasks.filter((task) => task.project_id === selectedProject)
					: tasks
			);
		} else {
			const filtered = tasks.filter((task) =>
				task.name.toLowerCase().includes(search.toLowerCase())
			);
			setFilteredTasks(
				selectedProject
					? filtered.filter((task) => task.project_id === selectedProject)
					: filtered
			);
		}
	};

	return (
		<>
			<ArrowLeft className="w-8 h-8" onClick={() => router.back()} />
			<div className="max-w-4xl mx-auto p-4">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-5 text-center">
					Tasks List
				</h1>

				<div className="flex justify-between mb-4 mt-10 gap-5">
					<div className="flex gap-2 w-full">
						<Input
							type="text"
							placeholder="Search Task..."
							className="border-2 w-full"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Button className="font-bold py-2 px-4 rounded" onClick={handleSearch}>
							Search
						</Button>
					</div>
				</div>

				<div className="mt-10">
					<div className="flex justify-end mb-5">
						<Select value={selectedProject} onValueChange={handleProjectChange}>
							<SelectTrigger className="border-2 rounded-md p-2 w-[180px]">
								<SelectValue placeholder="Select a Project" />
							</SelectTrigger>
							<SelectContent>
								{projects.map((project) => (
									<SelectItem key={project.id} value={project.id}>
										{project.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					{filteredTasks.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{filteredTasks.map((task) => (
								<Dialog key={task.id}>
									<Card>
										<CardHeader>
											<CardTitle className="font-semibold capitalize">
												{task.name}
											</CardTitle>
											<CardDescription className="font-medium">
												<Badge variant="outline">{task.priority}</Badge>
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
											<DialogTitle>Task Details: {task.name}</DialogTitle>
											<DialogDescription>{task.desc}</DialogDescription>
										</DialogHeader>
										<div className="flow-root text-white">
											<dl className="-my-3 divide-y divide-gray-100 text-sm">
												{[
													{ label: "Id", value: task.id },
													{ label: "Project Id", value: task.project_id },
													{ label: "Duration (Days)", value: task.duration },
													{ label: "Mandays", value: task.mandays },
													{ label: "Priority (Days)", value: task.priority },
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
							))}
						</div>
					) : (
						<p className="text-gray-500">No tasks found.</p>
					)}
				</div>
			</div>
		</>
	);
}
