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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchUserById, fetchUsers } from "@/services/user";
import { insertLog } from "@/services/log";

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
		fetchTasks();
	}, [params.projectID]);

	const fetchTasks = async () => {
		try {
			setLoading(true);

			const userId = sessionStorage.getItem("userId");

			if (!userId) {
				throw new Error("User ID not found in sessionStorage.");
			}

			const userData = await fetchUserById(userId);

			if (!userData) {
				throw new Error("Failed to fetch user details.");
			}

			const response = await fetch(`/api/tasks?projectID=${params.projectID}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to fetch tasks.");
			}

			const userTasks = data.tasks.filter((task: any) =>
				userData.tasks_assign?.includes(task.id)
			);

			console.log("User Tasks:", userTasks);

			setTasks(userTasks);
			setError(null);
		} catch (error: any) {
			console.error("Error:", error.message);
			setError("An error occurred while fetching tasks.");
			toast.error(error.message || "An error occurred.");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent, taskId: string) => {
		e.preventDefault();
		try {
			const { data, error: fetchError } = await supabase
				.from("wbs_tasks")
				.select("duration, mandays, workers")
				.eq("id", taskId)
				.single();

			if (fetchError) {
				throw new Error(fetchError.message);
			}

			const newDuration = (data.duration || 0) + inputValue;
			const newMandays = newDuration / 8;

			const { error: updateTaskError } = await supabase
				.from("wbs_tasks")
				.update({ duration: newDuration, mandays: newMandays })
				.eq("id", taskId);

			if (updateTaskError) {
				throw new Error(updateTaskError.message);
			}

			const { error: updateProjectError } = await supabase
				.from("wbs_projects")
				.update({ total_mandays: newMandays })
				.eq("id", params.projectID);

			if (updateProjectError) {
				throw new Error(updateProjectError.message);
			}

			const userId = sessionStorage.getItem("userId");
			toast.success("Task updated successfully!");

			await insertLog(
				userId,
				`Updated task with ID: ${taskId}`,
				taskId,
				"task",
				"success",
				`Duration updated to ${newDuration}, Mandays updated to ${newMandays}`
			);
			fetchTasks();
		} catch (error: any) {
			toast.error("An error occurred while updating the task.");
			const userId = sessionStorage.getItem("userId");

			await insertLog(
				userId,
				`Failed to update task with ID: ${taskId}`,
				taskId,
				"task",
				"failure",
				`Failed with message: ${error.message}`
			);
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
		<>
			<ArrowLeft className="w-8 h-8" onClick={() => router.back()} />
			<div className="max-w-6xl mx-auto p-4 ">
				<h1 className="text-4xl font-bold mb-4">Project Details - Tasks</h1>

				{tasks.length > 0 ? (
					<>
						<div className="grid md:grid-cols-2 grid-cols-1 gap-4">
							{tasks.map((task) => (
								<Dialog key={task.id}>
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
													{ label: "Duration (Hours)", value: task.duration },
													{ label: "Mandays", value: task.mandays },
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
												<dl className="-my-3 divide-y divide-gray-100 text-sm">
													<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
														<dt className="font-medium capitalize">
															<Label className="font-medium">Enter the day:</Label>
														</dt>
														<dd className="sm:col-span-2">
															<Input
																type="number"
																min="1"
																className="sm:col-span-2 border rounded p-2 bg-neutral-700"
																placeholder="Enter days"
																value={inputValue}
																onChange={(e) => setInputValue(Number(e.target.value))}
															/>
														</dd>
													</div>
												</dl>
												<div className="flex justify-center">
													<Button
														type="submit"
														variant="outline"
														className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
													>
														Submit Update
													</Button>
												</div>
											</form>
										</div>
									</DialogContent>
								</Dialog>
							))}
						</div>
					</>
				) : (
					<p className="text-gray-500">No tasks available for this project.</p>
				)}
			</div>
		</>
	);
}
