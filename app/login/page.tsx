"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import kwspLogo from "/public/img/kwsp-logo.png";
import LoginForm from "@/components/login-form";

export default function Page() {
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
						<LoginForm />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
