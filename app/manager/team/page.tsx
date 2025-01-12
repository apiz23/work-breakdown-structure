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
import { Project, User } from "@/lib/interface";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { fetchUsers } from "@/app/api/user/route";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Trash } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import supabase from "@/lib/supabase";
import { fetchProject } from "@/services/project";

export default function Page() {
	const [search, setSearch] = useState<string>("");
	const [users, setUsers] = useState<User[]>([]);
	const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const loaddUsers = async () => {
			setLoading(true);
			try {
				const usersData = await fetchUsers();
				if (usersData) {
					const filteredUsers = usersData.filter((user) => user.role !== "admin");
					setUsers(filteredUsers);
				}
			} catch (err: any) {
				toast.error("Error fetching data.");
			} finally {
				setLoading(false);
			}
		};
		const fetchProjects = async () => {
			try {
				const data = await fetchProject();
				if (data) {
					setProjects(data);
					setFilteredProjects(data);
				}
			} catch (err: any) {
				toast.error("Error fetching data.");
			} finally {
				setLoading(false);
			}
		};

		fetchProjects();
		loaddUsers();
	}, []);

	const handleSearch = () => {
		if (!search.trim()) {
			toast.error("Please enter a project name to search.");
			setFilteredProjects(projects);
		} else {
			toast.error("");
			const filtered = projects.filter((project) =>
				project.name?.toLowerCase().includes(search.toLowerCase())
			);
			setFilteredProjects(filtered);
		}
	};

	const checkChecked = (projectId: string, user: User) => {
		return user.project_assign?.includes(projectId);
	};

	const handleViewAccess = async (id: string) => {
		setLoading(true);
		try {
			const usersData = await fetchUsers();
			if (usersData) {
				const filteredUsers = usersData.filter((user) => user.role !== "admin");
				setAssignedUsers(filteredUsers);
			}
		} catch (err: any) {
			toast.error("Error fetching data.");
		} finally {
			setLoading(false);
		}
	};

	const assignProjectToUser = async (userId: string, projectId: string) => {
		try {
			const { data: user, error: fetchError } = await supabase
				.from("wbs_users")
				.select("project_assign")
				.eq("id", userId)
				.single();

			if (fetchError) {
				toast.error(`Failed to fetch user data: ${fetchError.message}`);
				return;
			}

			const updatedProjects = user.project_assign
				? [...user.project_assign, projectId].filter(
						(value, index, self) => self.indexOf(value) === index
				  )
				: [projectId];

			const { error: updateError } = await supabase
				.from("wbs_users")
				.update({ project_assign: updatedProjects })
				.eq("id", userId);

			if (updateError) {
				toast.error(`Failed to assign project: ${updateError.message}`);
			} else {
				setAssignedUsers((prevUsers) =>
					prevUsers.map((user) =>
						user.id === userId ? { ...user, project_assign: updatedProjects } : user
					)
				);
				toast.success(
					`Successfully assigned project ${projectId} to user ${userId}`
				);
			}
		} catch (error) {
			toast.error("An unexpected error occurred.");
		}
	};

	const unassignProjectFromUser = async (userId: string, projectId: string) => {
		try {
			const { data: user, error: fetchError } = await supabase
				.from("wbs_users")
				.select("project_assign")
				.eq("id", userId)
				.single();

			if (fetchError) {
				toast.error(`Failed to fetch user data: ${fetchError.message}`);
				return;
			}

			const updatedProjects = user.project_assign
				? user.project_assign.filter((id: string) => id !== projectId)
				: [];

			const { error: updateError } = await supabase
				.from("wbs_users")
				.update({ project_assign: updatedProjects })
				.eq("id", userId);

			if (updateError) {
				toast.error(`Failed to unassign project: ${updateError.message}`);
			} else {
				setAssignedUsers((prevUsers) =>
					prevUsers.map((user) =>
						user.id === userId ? { ...user, project_assign: updatedProjects } : user
					)
				);
				toast.success(
					`Successfully unassigned project ${projectId} from user ${userId}`
				);
			}
		} catch (error) {
			toast.error("An unexpected error occurred.");
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-4">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-5 text-center">
				Work Breakdown Structure - Projects and Users
			</h1>

			<div className="flex justify-between mb-4 mt-10 gap-5">
				<Input
					type="text"
					placeholder="Search Projects..."
					className="border-2 w-full"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Button className="font-bold py-2 px-4 rounded" onClick={handleSearch}>
					Search
				</Button>
			</div>

			<div className="mt-10">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{filteredProjects.map((project) => (
						<Card key={project.id}>
							<CardHeader>
								<CardTitle className="font-semibold">{project.name}</CardTitle>
								<CardDescription>{project.desc}</CardDescription>
							</CardHeader>
							<CardContent>
								<Dialog>
									<DialogTrigger>
										<Button
											variant="default"
											className="mt-4"
											onClick={() => {
												handleViewAccess(project.id);
											}}
										>
											View Access
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Users Assigned to {project.name}</DialogTitle>
										</DialogHeader>
										<Table>
											<TableCaption>Assigned Users</TableCaption>
											<TableHeader>
												<TableRow>
													<TableHead>User Name</TableHead>
													<TableHead className="text-center">Action</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{assignedUsers.length > 0 ? (
													assignedUsers.map((user) => (
														<TableRow key={user.id}>
															<TableCell>{user.name}</TableCell>
															<TableCell className="text-center">
																<Switch
																	checked={checkChecked(project.id, user)}
																	onCheckedChange={async (isChecked) => {
																		if (isChecked) {
																			await assignProjectToUser(user.id, project.id);
																		} else {
																			await unassignProjectFromUser(user.id, project.id);
																		}
																	}}
																/>
															</TableCell>
														</TableRow>
													))
												) : (
													<TableRow>
														<TableCell>No users assigned</TableCell>
													</TableRow>
												)}
											</TableBody>
										</Table>
									</DialogContent>
								</Dialog>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
