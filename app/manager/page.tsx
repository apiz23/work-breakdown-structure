"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Page() {
	useEffect(() => {
		const hasRefreshed = sessionStorage.getItem("hasRefreshed");

		if (!hasRefreshed) {
			sessionStorage.setItem("hasRefreshed", "true");
			window.location.reload();
		}
	}, []);
	return (
		<>
			<div className="max-w-4xl mx-auto p-4 pt-20">
				<div className="mx-auto max-w-3xl text-center">
					<h1 className="bg-gradient-to-r from-red-300 via-yellow-500 to-red-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
						Work Breakdown Structure
					</h1>
					<h2 className="bg-gradient-to-r from-red-300 via-yellow-500 to-red-600 bg-clip-text text-xl font-extrabold text-transparent sm:text-3xl">
						Manager
					</h2>

					<p className="mx-auto mt-4 max-w-xl sm:text-lg/relaxed">
						The Work Breakdown Structure (WBS) divides projects into manageable tasks
						for clarity and tracking.
					</p>

					<div className="mt-8 flex flex-wrap justify-center gap-4">
						<Link href="/manager/projects">
							<Button>Project</Button>
						</Link>
						<Link href="/manager/team">
							<Button>Manage Team </Button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
