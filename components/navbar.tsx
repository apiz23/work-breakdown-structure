"use client";

import React, { useEffect, useState } from "react";
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
import { fetchUserById } from "@/services/user";

export default function Navbar({ role }: { role: string }) {
	const [userDetails, setUserDetails] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [userImageUrl, setUserImageUrl] = useState<string>("");

	useEffect(() => {
		const fetchUserDetails = async () => {
			const userId = sessionStorage.getItem("userId");

			if (userId) {
				try {
					const user = await fetchUserById(userId);
					if (user) {
						setUserDetails(user);

						const email = user.email || "";
						const noMatrix = email.split("@")[0].toUpperCase();
						console.log(noMatrix);

						const imageUrl = `https://community.uthm.edu.my/images/students/20232024/${noMatrix}.jpg`;

						setUserImageUrl(imageUrl);
					}
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

	const handleLogout = () => {
		sessionStorage.clear();
	};

	if (role === "staff") {
		return (
			<div className="relative">
				<Dock direction="middle">
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
									<AvatarImage src={userImageUrl || "https://via.placeholder.com/150"} />
									<AvatarFallback>X</AvatarFallback>
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
					<Link href="/login" onClick={handleLogout}>
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
									<AvatarImage src={userImageUrl || "https://via.placeholder.com/150"} />
									<AvatarFallback>X</AvatarFallback>
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
					<Link href="/login" onClick={handleLogout}>
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
									<AvatarImage src={userImageUrl || "https://via.placeholder.com/150"} />
									<AvatarFallback>X</AvatarFallback>
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
					<Link href="/login" onClick={handleLogout}>
						<DockIcon>
							<LogOut />
						</DockIcon>
					</Link>
				</Dock>
			</div>
		);
	}
}
