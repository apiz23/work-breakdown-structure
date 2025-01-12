import React from "react";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Menu } from "lucide-react";
import logo from "@/public/img/kwsp-logo.png";
import Image from "next/image";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
	return (
		<div className="fixed top-0 left-0 z-50">
			<Sheet>
				<SheetTrigger className="p-4">
					<Menu />
				</SheetTrigger>
				<SheetContent side="left">
					<SheetHeader>
						<Image
							src={logo}
							width={500}
							height={500}
							alt="logo"
							className="h-20 w-20 mx-auto"
						/>
						<SheetTitle className="text-xl text-center">
							Work Breakdown Structure
						</SheetTitle>
					</SheetHeader>
					<SheetFooter>
						<DropdownMenu>
							<DropdownMenuTrigger className="w-full">Open</DropdownMenuTrigger>
							<DropdownMenuContent className="w-full">
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Profile</DropdownMenuItem>
								<DropdownMenuItem>
									<ModeToggle />
								</DropdownMenuItem>
								<DropdownMenuItem>Billing</DropdownMenuItem>
								<DropdownMenuItem>Team</DropdownMenuItem>
								<DropdownMenuItem>Subscription</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}
