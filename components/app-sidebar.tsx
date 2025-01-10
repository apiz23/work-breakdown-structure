import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import logo from "@/public/img/kwsp-logo.png";
import { User2, ChevronUp } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader className="p-4">
				<Image
					src={logo}
					width={500}
					height={500}
					alt="logo"
					className="h-20 w-20 mx-auto"
				/>
				<h2 className="text-xl text-center">Work Breakdown Structure</h2>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup />
				<SidebarGroup />
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<User2 /> Username
									<ChevronUp className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="top"
								className="w-[--radix-popper-anchor-width] p-2 border space-y-1 bg-neutral-200 rounded-lg"
							>
								<DropdownMenuItem className="p-2">
									<span>Account</span>
								</DropdownMenuItem>
								<DropdownMenuItem className="p-2">
									<span>Billing</span>
								</DropdownMenuItem>
								<DropdownMenuItem className="p-2">
									<span>Sign out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>{" "}
		</Sidebar>
	);
}
