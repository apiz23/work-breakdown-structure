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
	const router = useRouter();
	const [users, setUsers] = useState<any[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<div className="min-h-screen pt-20">
			<ArrowLeft className="w-8 h-8" onClick={() => router.back()} />
			<div className="max-w-6xl mx-auto p-4 ">
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
											<DialogTrigger className="bg-neutral-700 px-2 py-1 text-sm text-white rounded-md">
												View Task
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
														<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
															<dt className="font-medium">No</dt>
															<dd className="sm:col-span-2">{task.id}</dd>
														</div>

														<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
															<dt className="font-medium">Name</dt>
															<dd className="sm:col-span-2">{task.name}</dd>
														</div>

														<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
															<dt className="font-medium">Description</dt>
															<dd className="sm:col-span-2">{task.desc}</dd>
														</div>

														<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
															<dt className="font-medium">Duration</dt>
															<dd className="sm:col-span-2">{task.duration}</dd>
														</div>

														<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
															<dt className="font-medium">Mandays</dt>
															<dd className="sm:col-span-2">{task.mandays}</dd>
														</div>

														<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
															<dt className="font-medium">Status</dt>
															<dd className="sm:col-span-2">{task.status}</dd>
														</div>

														<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
															<dt className="font-medium">Priority</dt>
															<dd className="sm:col-span-2">
																<Badge variant="default">{task.priority}</Badge>
															</dd>
														</div>
													</dl>
												</div>
											</DialogContent>
										</Dialog>

										<Dialog>
											<DialogTrigger
												className="bg-neutral-700 px-2 py-1 text-sm text-white rounded-md"
												onClick={async () => {
													const fetchedUsers = await fetchUsers();
													setUsers(fetchedUsers);
												}}
											>
												Update Task
											</DialogTrigger>
											<DialogContent className="max-w-xl min-w-sm">
												<DialogHeader>
													<DialogTitle>Update Task</DialogTitle>
													<DialogDescription>
														Here you can update the task progress or status.
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
													<form onSubmit={handleSubmit}>
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
