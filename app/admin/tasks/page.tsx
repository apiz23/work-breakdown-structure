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
import { Task } from "@/lib/interface";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export default function Page() {
	const [search, setSearch] = useState<string>("");
	const [tasks, setTasks] = useState<Task[]>([]);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const response = await fetch("/api/tasks");
				const result = await response.json();

				if (!response.ok) {
					toast.error(result.error || "Failed to fetch tasks.");
					return;
				}

				setTasks(result.tasks || []);
				setFilteredTasks(result.tasks || []);
			} catch (error) {
				console.error("Error fetching tasks:", error);
				toast.error("An error occurred while fetching tasks.");
			}
		};

		fetchTasks();
	}, []);

	const handleSearch = () => {
		if (!search.trim()) {
			toast.error("Please enter a task name to search.");
			setFilteredTasks(tasks);
		} else {
			const filtered = tasks.filter((task) =>
				task.name.toLowerCase().includes(search.toLowerCase())
			);
			setFilteredTasks(filtered);
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
					placeholder="Search Task..."
					className="border-2 w-full"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Button className="font-bold py-2 px-4 rounded" onClick={handleSearch}>
					Search
				</Button>
			</div>

			<div className="mt-10">
				{filteredTasks.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{filteredTasks.map((task) => (
							<Dialog>
								<Card key={task.id}>
									<CardHeader>
										<CardTitle className="font-semibold">{task.name}</CardTitle>
										<CardDescription className="font-medium justify-end flex">
											{task.status}
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
												{ label: "Status", value: task.status },
												{ label: "Mandays", value: task.mandays },
												{ label: "Duration (Days)", value: task.duration },
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
	);
}
