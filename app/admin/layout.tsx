import "../globals.css";
import { Toaster } from "sonner";
import React from "react";
import AuthProvider from "@/components/session-provider";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
	title: "Admin - Work Breakdown Structure",
	description: "Work Breakdown Structure by KWSP",
};

export default function UserLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<div className="w-full z-50 fixed bottom-10 left-1/2 transform -translate-x-1/2">
					<Navbar role="admin" />
				</div>
				<Toaster richColors />
				<AuthProvider>
					<div className="min-h-screen">
						<div className="px-4 py-10">{children}</div>
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
