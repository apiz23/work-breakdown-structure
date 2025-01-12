import "../globals.css";
import { Toaster } from "sonner";
import React from "react";

export default function ManagerLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Toaster richColors />
				<div className="px-4 py-10">{children}</div>
			</body>
		</html>
	);
}
