"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Switch } from "@/components/ui/switch";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	const isDarkMode = theme === "dark";

	return (
		<div className="flex items-center gap-2">
			<Sun
				className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-yellow-500"}`}
			/>
			<Switch
				checked={isDarkMode}
				onCheckedChange={(checked: any) => setTheme(checked ? "dark" : "light")}
				aria-label="Toggle theme"
			/>
			<Moon
				className={`h-5 w-5 ${isDarkMode ? "text-blue-500" : "text-gray-400"}`}
			/>
		</div>
	);
}
