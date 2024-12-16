import React from "react";
import { Dock, DockIcon } from "./ui/dock";
import { Home, Info, LogOut } from "lucide-react";
import Link from "next/link";

export type IconProps = React.HTMLAttributes<SVGElement>;

export function Navbar() {
	const navItems = [
		{ href: "/client", icon: Home, label: "Home" },
		{ href: "/info", icon: Info, label: "Info" },
		{ href: "/", icon: LogOut, label: "Logout" },
	];

	return (
		<div className="fixed bottom-10 left-0 w-full">
			<Dock direction="middle" className="bg-black text-white">
				{navItems.map((item, index) => (
					<DockIcon>
						<Link key={index} href={item.href} aria-label={item.label}>
							<item.icon className="size-6" />
						</Link>
					</DockIcon>
				))}
			</Dock>
		</div>
	);
}
