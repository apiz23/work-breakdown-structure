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
import { Input } from "@/components/ui/input";
import { Task, User } from "@/lib/interface";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function ProjectDetails({
	params,
}: {
	params: { projectID: string };
}) {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [users, setUsers] = useState<User[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [inputValue, setInputValue] = useState<number>(0);
	const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		priority: "",
	});
	const router = useRouter();

	const fetchUsers = async () => {
		try {
			const response = await fetch("/api/user");
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to fetch users.");
			}

			const filteredUsers = data.users.filter(
				(user: User) => user.role !== "admin"
			);

			return filteredUsers;
		} catch {
			return [];
		}
	};

	const fetchTasks = async () => {
		try {
			setLoading(true);

			const response = await fetch(`/api/tasks?projectID=${params.projectID}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to fetch tasks.");
			}

			setTasks(data.tasks || []);
			setError(null);
		} catch {
			setTasks([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
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

	const handleSubmit = async (e: React.FormEvent, taskId: string) => {
		e.preventDefault();
		try {
			const { data, error: fetchError } = await supabase
				.from("wbs_tasks")
				.select("duration, mandays")
				.eq("id", taskId)
				.single();

			if (fetchError) {
				throw new Error(fetchError.message);
			}

			const newDuration = (data.duration || 0) + inputValue;
			const newMandays = newDuration / 8;

			const { error } = await supabase
				.from("wbs_tasks")
				.update({ duration: newDuration, mandays: newMandays })
				.eq("id", taskId)
				.select();

			if (error) {
				throw new Error(error.message);
			}

			toast.success("Task updated successfully!");
			fetchTasks();
		} catch (error) {
			toast.error("An error occurred while updating the task.");
		}
	};

	const checkChecked = (taskId: string, user: User) => {
		return user.tasks_assign?.includes(taskId);
	};

	const assignTaskToUser = async (userId: string, projectId: string) => {
		try {
			const { data: user, error: fetchError } = await supabase
				.from("wbs_users")
				.select("tasks_assign")
				.eq("id", userId)
				.single();

			if (fetchError) {
				toast.error(`Failed to fetch user data: ${fetchError.message}`);
				return;
			}

			const updatedProjects = user.tasks_assign
				? [...user.tasks_assign, projectId].filter(
						(value, index, self) => self.indexOf(value) === index
				  )
				: [projectId];

			const { error: updateError } = await supabase
				.from("wbs_users")
				.update({ tasks_assign: updatedProjects })
				.eq("id", userId);

			if (updateError) {
				toast.error(`Failed to assign project: ${updateError.message}`);
			} else {
				setAssignedUsers((prevUsers) =>
					prevUsers.map((user) =>
						user.id === userId ? { ...user, tasks_assign: updatedProjects } : user
					)
				);
				toast.success(`Successfully assigned project`);
			}
		} catch (error) {
			toast.error("An unexpected error occurred.");
		}
	};

	const unassignTaskFromUser = async (userId: string, projectId: string) => {
		try {
			const { data: user, error: fetchError } = await supabase
				.from("wbs_users")
				.select("tasks_assign")
				.eq("id", userId)
				.single();

			if (fetchError) {
				toast.error(`Failed to fetch user data: ${fetchError.message}`);
				return;
			}

			const updatedProjects = user.tasks_assign
				? user.tasks_assign.filter((id: string) => id !== projectId)
				: [];

			const { error: updateError } = await supabase
				.from("wbs_users")
				.update({ tasks_assign: updatedProjects })
				.eq("id", userId);

			if (updateError) {
				toast.error(`Failed to unassign project: ${updateError.message}`);
			} else {
				setAssignedUsers((prevUsers) =>
					prevUsers.map((user) =>
						user.id === userId ? { ...user, tasks_assign: updatedProjects } : user
					)
				);
				toast.success(`Successfully unassigned project`);
			}
		} catch (error) {
			toast.error("An unexpected error occurred.");
		}
	};

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (value: any) => {
		setFormData((prev) => ({ ...prev, priority: value }));
	};

	const handleNewTasks = async (e: any) => {
		e.preventDefault();

		try {
			const { error } = await supabase
				.from("wbs_tasks")
				.insert([
					{
						project_id: params.projectID,
						name: formData.name,
						desc: formData.description,
						priority: formData.priority,
					},
				])
				.select();

			if (error) {
				toast.error(error.message);
			}

			toast.success("Task added successfully!");
			setFormData({ name: "", description: "", priority: "" });
		} catch (error: any) {
			toast.error(`Error: ${error.message}`);
		}
	};

	return (
		<>
			<ArrowLeft className="w-8 h-8 mb-6" onClick={() => router.back()} />
			<div className="max-w-6xl mx-auto p-4 b">
				<div className="flex justify-between">
					<h1 className="text-2xl font-bold mb-4">Project Details</h1>
					<Dialog>
						<DialogTrigger className="capitalize">
							<Button variant="default">add new task</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Are you absolutely sure?</DialogTitle>
								<DialogDescription>
									This action cannot be undone. This will permanently delete your account
									and remove your data from our servers.
								</DialogDescription>
							</DialogHeader>
							<form onSubmit={handleNewTasks}>
								<div className="flow-root text-white">
									<dl className="-my-3 divide-y divide-gray-100 text-sm">
										<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
											<dt className="font-medium">Name</dt>
											<dd className="sm:col-span-2">
												<Input
													type="text"
													placeholder="New Feature"
													name="name"
													value={formData.name}
													onChange={handleChange}
												/>
											</dd>
										</div>
										<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
											<dt className="font-medium">Description</dt>
											<dd className="sm:col-span-2">
												<Input
													type="text"
													placeholder="The feature are ..."
													name="description"
													value={formData.description}
													onChange={handleChange}
												/>
											</dd>
										</div>
										<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4 ">
											<dt className="font-medium">Priority</dt>
											<dd className="sm:col-span-2">
												<Select onValueChange={handleSelectChange}>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Priority" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="low">Low</SelectItem>
														<SelectItem value="medium">Medium</SelectItem>
														<SelectItem value="high">High</SelectItem>
													</SelectContent>
												</Select>
											</dd>
										</div>
									</dl>
									<Button type="submit" variant="default" className="w-full mt-8">
										Submit
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</div>
				{tasks.length > 0 ? (
					<>
						{tasks.map((task) => (
							<div key={task.id} className="grid md:grid-cols-2 grid-cols-1 gap-4">
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
															{ label: "Duration (Hours)", value: task.duration },
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
													<form onSubmit={(e) => handleSubmit(e, task.id)}>
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
														Here you can assign task to users
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
																						checked={checkChecked(task.id, user)}
																						onCheckedChange={async (isChecked) => {
																							if (isChecked) {
																								await assignTaskToUser(user.id, task.id);
																							} else {
																								await unassignTaskFromUser(user.id, task.id);
																							}
																						}}
																					/>
																				</div>
																			))
																	)}
																</div>
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
					</>
				) : (
					<p className="text-gray-500">No tasks available for this project.</p>
				)}
			</div>
		</>
	);
}
