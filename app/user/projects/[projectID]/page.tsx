"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/interface";

export default function ProjectDetails({
	params,
}: {
	params: { projectID: string };
}) {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [inputValue, setInputValue] = useState<number>(0);
	const router = useRouter();

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				setLoading(true);

				const response = await fetch(`/api/tasks?projectID=${params.projectID}`);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Failed to fetch tasks.");
				}

				setTasks(data.tasks);
				setError(null);
			} catch (err: any) {
				setError(err.message || "An error occurred while fetching tasks.");
				toast.error(err.message || "An error occurred.");
			} finally {
				setLoading(false);
			}
		};

		fetchTasks();
	}, [params.projectID]);

	const handleSubmit = async (e: React.FormEvent, taskId: number) => {
		e.preventDefault();

		try {
			const { data, error } = await supabase
				.from("wbs_tasks")
				.update({ estimatedCompletion: inputValue })
				.eq("taskId", taskId)
				.select();

			if (error) {
				throw new Error(error.message);
			}

			toast.success("Task updated successfully!");
		} catch (err: any) {
			toast.error(err.message || "An error occurred while updating the task.");
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-40">
				<LoaderIcon className="animate-spin w-8 h-8 text-gray-500" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-red-500 text-center">
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen pt-20">
			<ArrowLeft className="w-8 h-8" onClick={() => router.back()} />
			<div className="max-w-6xl mx-auto p-4 ">
				<h1 className="text-2xl font-bold mb-4">Project Details</h1>

				{tasks.length > 0 ? (
					<div>
						{tasks.map((task, index) => (
							<>
								<Dialog>
									<div className="grid md:grid-cols-3 grid-cols-1 gap-4">
										<Card>
											<CardHeader>
												<CardTitle>{task.name}</CardTitle>
												<CardDescription>{task.desc}</CardDescription>
											</CardHeader>
											<CardContent>
												<div className="flex justify-between">
													<Badge variant="default">{task.priority}</Badge>
													<DialogTrigger className="bg-neutral-700 px-2 py-1 text-sm text-white rounded-md">
														Open
													</DialogTrigger>
												</div>
											</CardContent>
										</Card>
									</div>
									<DialogContent className="max-w-xl min-w-sm">
										<DialogHeader>
											<DialogTitle>Task Details</DialogTitle>
											<DialogDescription>
												Here are the details for the selected task.
											</DialogDescription>
										</DialogHeader>
										<div className="flow-root text-white">
											<dl className="-my-3 divide-y divide-gray-100 text-sm">
												{[
													{ label: "Id", value: task.id },
													{ label: "Name", value: task.name },
													{ label: "Description", value: task.desc },
													{ label: "Duration (Days)", value: task.duration },
													{ label: "Mandays", value: task.mandays },
													{ label: "Status", value: task.status },
													{
														label: "Priority",
														value: <Badge variant="default">{task.priority}</Badge>,
													},
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
										<div className="text-white">
											<h2 className="text-lg font-bold">Update Task</h2>
											<form onSubmit={(e) => handleSubmit(e, task.id)}>
												<div className="flex space-x-4">
													<label className="font-medium">Enter the hours:</label>
													<input
														type="number"
														min="1"
														className="sm:col-span-2 border rounded p-2"
														placeholder="Enter days"
														value={inputValue}
														onChange={(e) => setInputValue(Number(e.target.value))}
													/>
												</div>
												<Button
													type="submit"
													className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
												>
													Submit Update
												</Button>
											</form>
										</div>
									</DialogContent>
								</Dialog>
							</>
						))}
					</div>
				) : (
					<p className="text-gray-500">No tasks available for this project.</p>
				)}
			</div>
		</div>
	);
}
