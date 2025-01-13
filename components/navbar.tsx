"use client";

import React, { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { Dock, DockIcon } from "./ui/dock";
import { Home, LogOut, User } from "lucide-react";
import Link from "next/link";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import supabase from "@/lib/supabase";

export default function Navbarf({ role }: { role: string }) {
	const [userDetails, setUserDetails] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchUserDetails = async () => {
			const userId = sessionStorage.getItem("userId");

			if (userId) {
				try {
					const { data, error } = await supabase
						.from("wbs_users")
						.select("*")
						.eq("id", userId)
						.single();

					if (error) {
						throw error;
					}

					setUserDetails(data);
				} catch (error) {
					console.error("Error fetching user details:", error);
				} finally {
					setLoading(false);
				}
			} else {
				console.warn("No userId found in sessionStorage.");
				setLoading(false);
			}
		};

		fetchUserDetails();
	}, []);

	if (role === "staff") {
		return (
			<div className="relative">
				<Dock direction="middle">
					<DockIcon>
						<ModeToggle />
					</DockIcon>
					<Link href="/user">
						<DockIcon>
							<Home />
						</DockIcon>
					</Link>
					<Sheet>
						<SheetTrigger asChild>
							<DockIcon>
								<User />
							</DockIcon>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<Avatar className="w-32 h-32 mx-auto">
									<AvatarImage src="https://github.com/shadcn.png" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<SheetTitle>
									{loading ? "Loading..." : userDetails?.name || "Guest"}
								</SheetTitle>
								{!loading && userDetails && (
									<>
										<SheetDescription>Email: {userDetails.email}</SheetDescription>
										<SheetDescription>Role: {userDetails.role}</SheetDescription>
									</>
								)}
							</SheetHeader>
						</SheetContent>
					</Sheet>
					<Link href="/login">
						<DockIcon>
							<LogOut />
						</DockIcon>
					</Link>
				</Dock>
			</div>
		);
	} else if (role === "manager") {
		return (
			<div className="relative">
				<Dock direction="middle">
					<DockIcon>
						<ModeToggle />
					</DockIcon>
					<Link href="/manager">
						<DockIcon>
							<Home />
						</DockIcon>
					</Link>

					<Sheet>
						<SheetTrigger asChild>
							<DockIcon>
								<User />
							</DockIcon>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<Avatar className="w-32 h-32 mx-auto">
									<AvatarImage src="https://github.com/shadcn.png" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<SheetTitle>
									{loading ? "Loading..." : userDetails?.name || "Guest"}
								</SheetTitle>
								{!loading && userDetails && (
									<>
										<SheetDescription>Email: {userDetails.email}</SheetDescription>
										<SheetDescription>Role: {userDetails.role}</SheetDescription>
									</>
								)}
							</SheetHeader>
						</SheetContent>
					</Sheet>
					<Link href="/login">
						<DockIcon>
							<LogOut />
						</DockIcon>
					</Link>
				</Dock>
			</div>
		);
	} else if (role === "admin") {
		return (
			<div className="relative">
				<Dock direction="middle">
					<DockIcon>
						<ModeToggle />
					</DockIcon>
					<Link href="/admin">
						<DockIcon>
							<Home />
						</DockIcon>
					</Link>

					<Sheet>
						<SheetTrigger asChild>
							<DockIcon>
								<User />
							</DockIcon>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<Avatar className="w-32 h-32 mx-auto">
									<AvatarImage src="https://github.com/shadcn.png" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<SheetTitle>
									{loading ? "Loading..." : userDetails?.name || "Guest"}
								</SheetTitle>
								{!loading && userDetails && (
									<>
										<SheetDescription>Email: {userDetails.email}</SheetDescription>
										<SheetDescription>Role: {userDetails.role}</SheetDescription>
									</>
								)}
							</SheetHeader>
						</SheetContent>
					</Sheet>
					<Link href="/login">
						<DockIcon>
							<LogOut />
						</DockIcon>
					</Link>
				</Dock>
			</div>
		);
	}
}
