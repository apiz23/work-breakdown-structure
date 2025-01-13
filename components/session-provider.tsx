"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

const roles = {
	USER: "user",
	MANAGER: "manager",
	ADMIN: "admin",
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const router = useRouter();

	useEffect(() => {
		const isAuthenticated = sessionStorage.getItem("logged-in") === "true";
		const userRole = sessionStorage.getItem("role");

		if (!isAuthenticated) {
			router.push("/"); 
			return;
		}

		const currentPath = window.location.pathname;

		if (
			userRole === roles.USER &&
			(currentPath.includes("/manager") || currentPath.includes("/admin"))
		) {
			router.push("/"); 
		} else if (
			userRole === roles.MANAGER &&
			(currentPath.includes("/user") || currentPath.includes("/admin"))
		) {
			router.push("/");
		} else if (
			userRole === roles.ADMIN &&
			(currentPath.includes("/user") || currentPath.includes("/manager"))
		) {
			router.push("/"); 
		}
	}, [router]);

	return <>{children}</>;
};

export default AuthProvider;
