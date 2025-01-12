"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { validateLogin } from "@/service/wbsService";

export default function LoginForm() {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const router = useRouter();

	const handleSignIn = async (e: FormEvent): Promise<void> => {
		e.preventDefault();

		toast.promise(
			(async () => {
				const result = await validateLogin(username, password);
				if (result.valid) {
					if (result.role === "admin") {
						router.push("/admin");
					} else if (result.role === "manager") {
						router.push("/manager");
					} else {
						router.push("/user");
					}
					return { status: "success", userName: result.userName };
				} else {
					throw new Error(result.message);
				}
			})(),
			{
				loading: "Logging in...",
				success: (response: { userName?: string }) =>
					`Welcome, ${response.userName || "User"}!`,
				error: (error: Error) => error.message || "An error occurred during login.",
			}
		);
	};

	return (
		<form onSubmit={handleSignIn} className="flex flex-col">
			<Input
				type="text"
				placeholder="Username"
				className="mb-4 focus:border-white border-neutral-700"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				required
			/>
			<Input
				type="password"
				placeholder="Password"
				className="mb-4 focus:border-white border-neutral-700"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<Button type="submit" variant="outline" className="w-full">
				Login
			</Button>
		</form>
	);
}
