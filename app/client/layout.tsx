import "../globals.css";
import { Toaster } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/lib/authProvider";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<SidebarProvider>
					<Toaster richColors />
					<AppSidebar />
					<main>
						<SidebarTrigger className="w-10 h-10 mx-2 hover:bg-transparent" />
						<AuthProvider>
							<div className="p-6">{children}</div>
						</AuthProvider>
					</main>
				</SidebarProvider>
			</body>
		</html>
	);
}
