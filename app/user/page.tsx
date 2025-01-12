import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Page() {
	return (
		<>
			<div className="h-fit">
				<div className="max-w-4xl mx-auto p-4 pt-32">
					<div className="mx-auto max-w-3xl text-center">
						<h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
							Work Breakdown Structure
						</h1>
						<h2 className="bg-gradient-to-r from-purple-300 via-blue-500 to-green-600 bg-clip-text text-xl font-extrabold text-transparent sm:text-3xl">
							User
						</h2>

						<p className="mx-auto mt-4 max-w-xl sm:text-lg/relaxed">
							The Work Breakdown Structure (WBS) divides projects into manageable tasks
							for clarity and tracking.
						</p>

						<div className="mt-8 flex flex-wrap justify-center gap-4">
							<Link href="/user/projects">
								<Button>Project</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
