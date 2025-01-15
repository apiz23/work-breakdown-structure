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
import { ArrowLeft, Trash } from "lucide-react";
import { User } from "@/lib/interface";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { insertLog } from "@/services/log";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Page() {
	const [search, setSearch] = useState<string>("");
	const [users, setUsers] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const router = useRouter();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch("/api/user");
				if (!response.ok) {
					throw new Error("Failed to fetch users");
				}
				const { users } = await response.json();
				if (Array.isArray(users)) {
					setUsers(users);
					setFilteredUsers(users);
				} else {
					throw new Error("Unexpected data format");
				}
			} catch {
				toast.error("Error fetching users. Please try again.");
			}
		};

		fetchUsers();
	}, []);

	const handleSearch = () => {
		if (!search.trim()) {
			toast.error("Please enter a user name to search.");
			setFilteredUsers(users);
		} else {
			const filtered = users.filter(
				(user) =>
					user.name?.toLowerCase().includes(search.toLowerCase()) ||
					user.username?.toLowerCase().includes(search.toLowerCase())
			);
			setFilteredUsers(filtered);
		}
	};

	const updateUserRole = async (userId: string, newRole: string) => {
		try {
			const { error } = await supabase
				.from("wbs_users")
				.update({ role: newRole })
				.eq("id", userId)
				.select();

			if (error) {
				toast.error(`Failed to update role: ${error.message}`);
				await insertLog(
					userId,
					`Failed to update user role to ${newRole}`,
					undefined,
					"user_role",
					"failure",
					`Error: ${error.message}`
				);
				return;
			}

			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user.id === userId ? { ...user, role: newRole } : user
				)
			);
			setFilteredUsers((prevFilteredUsers) =>
				prevFilteredUsers.map((user) =>
					user.id === userId ? { ...user, role: newRole } : user
				)
			);
			toast.success("Role updated successfully!");
			await insertLog(
				userId,
				`Successfully updated user role to ${newRole}`,
				undefined,
				"user_role",
				"success",
				`User role updated to ${newRole} for User ID ${userId}`
			);
		} catch (err: any) {
			toast.error("An unexpected error occurred while updating the role.");
			await insertLog(
				userId,
				`Unexpected error while updating role to ${newRole}`,
				undefined,
				"user_role",
				"failure",
				`Error: ${err.message}`
			);
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
						<BreadcrumbPage>Users</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="max-w-4xl mx-auto p-4">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-5 text-center">
					User List
				</h1>

				<div className="flex justify-between mb-4 mt-10 gap-5">
					<Input
						type="text"
						placeholder="Search Users..."
						className="border-2 w-full"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<Button className="font-bold py-2 px-4 rounded" onClick={handleSearch}>
						Search
					</Button>
				</div>

				<div className="mt-10">
					{filteredUsers.length > 0 ? (
						<ScrollArea className="w-full h-[50vh] rounded-md p-2">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{filteredUsers.map((user) => (
									<Card key={user.id}>
										<CardHeader>
											<CardTitle className="font-semibold">
												{user.name || "No Name"}
											</CardTitle>
											<CardDescription className="flex justify-between">
												<span>Username: {user.username || "N/A"}</span>
												<span>Role: {user.role || "Staff"}</span>
											</CardDescription>
										</CardHeader>
										<Dialog>
											<CardContent>
												<DialogTrigger>
													<div className="flex justify-end mt-4">
														<Button variant="default">View</Button>
													</div>
												</DialogTrigger>
											</CardContent>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Detail: {user.name || "No Name"}</DialogTitle>
												</DialogHeader>
												<div className="text-md text-gray-400">
													<p>Id: {user.id || "No Id"}</p>
													<p>Username: {user.email || "No Username"}</p>
													<p>Email: {user.email || "No Email"}</p>
													<p>Role: {user.role || "No Role"}</p>
													<p>Created At: {new Date(user.created_at).toLocaleString()}</p>
												</div>
												<div className="mt-4">
													<Select
														value={user.role || ""}
														onValueChange={(newRole) => updateUserRole(user.id, newRole)}
													>
														<SelectTrigger className="border border-gray-300 rounded px-3 py-2">
															<SelectValue placeholder="Role" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="staff">Staff</SelectItem>
															<SelectItem value="manager">Manager</SelectItem>
															<SelectItem value="admin">Admin</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</DialogContent>
										</Dialog>
									</Card>
								))}
							</div>
						</ScrollArea>
					) : (
						<p className="text-gray-500">No users found.</p>
					)}
				</div>
			</div>
		</>
	);
}
