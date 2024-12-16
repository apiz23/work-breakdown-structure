"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import kwspLogo from "/public/img/kwsp-logo.png";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { validateLogin } from "./api/wbsService";

export default function Home() {
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
					} else {
						router.push("/client");
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
		<div className="min-h-screen flex">
			<div className="hidden md:flex flex-col justify-center items-center bg-neutral-950 text-white w-1/2 px-16">
				<div className="max-w-2xl text-center">
					<h1 className="text-4xl font-semibold uppercase text-center tracking-widest text-white">
						Work Breakdown Structure
					</h1>
				</div>
				<Image
					src={kwspLogo}
					alt="kwspLogo"
					height={500}
					width={500}
					className="bg-no-repeat"
				/>
			</div>

			<div className="flex md:flex-col justify-center items-center w-full md:w-1/2 bg-neutral-900 md:px-16">
				<Card className="w-full max-w-md bg-transparent border-none shadow-none">
					<Image
						src={kwspLogo}
						alt="kwspLogo"
						height={500}
						width={500}
						className="block md:hidden h-[30vh] w-fit mx-auto"
					/>
					<CardHeader>
						<CardTitle className="text-white">Login Account</CardTitle>
						<p className="text-gray-400">Enter the credentials to login</p>
					</CardHeader>
					<CardContent className="text-white">
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
							<Button type="submit" variant="outline" className="w-full text-black">
								Login
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
