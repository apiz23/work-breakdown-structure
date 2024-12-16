import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: "Work Breakdown Structure",
	description: "Work Breakdown Structure by KWSP",
	icons: {
		icon: [
			{
				url: "/public/favicon.ico",
				href: "/public/favicon.ico",
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Toaster richColors />
				{children}
			</body>
		</html>
	);
}
