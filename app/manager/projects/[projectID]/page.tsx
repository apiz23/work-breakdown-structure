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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Task } from "@/lib/interface";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const fetchUsers = async () => {
	try {
		const response = await fetch("/api/user");
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || "Failed to fetch users.");
		}

		const filteredUsers = data.users.filter(
			(user: any) => user.role !== "admin" && user.role !== "manager"
		);

		return filteredUsers;
	} catch (error) {
		return [];
	}
};

export default function ProjectDetails({
	params,
}: {
	params: { projectID: string };
}) {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [users, setUsers] = useState<any[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
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

	const filteredUsers = users.filter((user) =>
		user.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleUserSelection = (userId: number, checked: boolean) => {
		setSelectedUsers((prevSelectedUsers) =>
			checked
				? [...prevSelectedUsers, userId]
				: prevSelectedUsers.filter((id) => id !== userId)
		);
	};

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

	return (
		<div className="min-h-screen pt-20">
			<div className="max-w-6xl mx-auto p-4 b">
				<ArrowLeft className="w-8 h-8 mb-6" onClick={() => router.back()} />

				<h1 className="text-2xl font-bold mb-4">Project Details</h1>
				{tasks.length > 0 ? (
					<div>
						{tasks.map((task) => (
							<div key={task.id} className="grid md:grid-cols-3 grid-cols-1 gap-4">
								<Card>
									<CardHeader>
										<CardTitle>{task.name}</CardTitle>
										<CardDescription>{task.desc}</CardDescription>
										<Badge variant="default" className="w-fit">
											{task.priority}
										</Badge>
									</CardHeader>
									<CardContent className="flex w-full justify-between">
										<Dialog>
											<DialogTrigger>
												<Button>View Task</Button>
											</DialogTrigger>
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
												<dl className="-my-3 divide-y divide-gray-100 text-sm">
													<form onSubmit={(e) => handleSubmit(e, Number(task.id))}>
														<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
															<dt className="font-medium capitalize">
																<h2 className="text-lg font-bold">Update Task</h2>
																<Label className="font-medium">Enter the hours:</Label>
															</dt>
															<dd className="sm:col-span-2">
																<Input
																	type="number"
																	min="1"
																	className="sm:col-span-2 border rounded p-2"
																	placeholder="Enter days"
																	value={inputValue}
																	onChange={(e) => setInputValue(Number(e.target.value))}
																/>
															</dd>
														</div>
														<Button
															variant="outline"
															type="submit"
															className="mt-4 w-full text-white px-4 py-2 rounded"
														>
															Submit Update
														</Button>
													</form>
												</dl>
											</DialogContent>
										</Dialog>

										<Dialog>
											<DialogTrigger
												onClick={async () => {
													const fetchedUsers = await fetchUsers();
													setUsers(fetchedUsers);
												}}
											>
												<Button>Assign Users</Button>
											</DialogTrigger>
											<DialogContent className="max-w-xl min-w-sm">
												<DialogHeader>
													<DialogTitle>Assign Task</DialogTitle>
													<DialogDescription>
														Here you can assign task to associate
													</DialogDescription>
												</DialogHeader>
												<div className="text-white">
													<div className="mb-6">
														<Input
															type="text"
															placeholder="Search users..."
															className="border rounded w-full"
															value={searchQuery}
															onChange={(e) => setSearchQuery(e.target.value)}
														/>
													</div>
													<form>
														<div className="grid grid-cols-1 gap-4">
															<div>
																<label className="block font-medium">Assign to Users</label>

																<div className="grid grid-cols-1 gap-2 mt-2">
																	{loading ? (
																		<div className="text-center text-white">Loading users...</div>
																	) : (
																		users
																			.filter((user) =>
																				user.name.toLowerCase().includes(searchQuery.toLowerCase())
																			)
																			.map((user) => (
																				<div key={user.id} className="flex justify-between">
																					<label htmlFor={`user-${user.id}`} className="text-white">
																						{user.name}
																					</label>
																					<Switch
																						id={`user-${user.id}`}
																						className="mr-2"
																						checked={selectedUsers.includes(user.id)}
																						onCheckedChange={(checked) =>
																							handleUserSelection(user.id, !!checked)
																						}
																					/>
																				</div>
																			))
																	)}
																</div>
															</div>

															<div className="mt-4">
																<button
																	type="submit"
																	className="w-full bg-blue-600 text-white py-2 rounded-md"
																>
																	Update Task
																</button>
															</div>
														</div>
													</form>
												</div>
											</DialogContent>
										</Dialog>
									</CardContent>
								</Card>
							</div>
						))}
					</div>
				) : (
					<p className="text-gray-500">No tasks available for this project.</p>
				)}
			</div>
		</div>
	);
}
