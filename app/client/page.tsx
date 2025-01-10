"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

interface Project {
	id: number;
	name: string;
	created_at: string;
}

export default function Page() {
	const [search, setSearch] = useState<string>("");
	const [projects, setProjects] = useState<Project[]>([]);
	const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

	useEffect(() => {
		const fetchProjects = async () => {
			const response = await fetch("/api/project");
			const data: Project[] = await response.json();
			setProjects(data);
			setFilteredProjects(data);
		};

		fetchProjects();
	}, []);

	const handleSearch = () => {
		if (!search.trim()) {
			toast.error("Please enter a project name to search.");
			setFilteredProjects(projects);
		} else {
			toast.error("");
			const filtered = projects.filter((project) =>
				project.name.toLowerCase().includes(search.toLowerCase())
			);
			setFilteredProjects(filtered);
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-4">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-5 text-center">
				Work Breakdown Structure
			</h1>

			<div className="flex justify-between mb-4 mt-10 gap-5">
				<Input
					type="text"
					placeholder="Search Project..."
					className="border-2 w-full"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Button className="font-bold py-2 px-4 rounded" onClick={handleSearch}>
					Search
				</Button>
			</div>

			<div className="mt-10">
				{filteredProjects.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{filteredProjects.map((project) => (
							<>
								<Sheet>
									<Card key={project.id}>
										<CardHeader>
											<CardTitle className="font-semibold">{project.name}</CardTitle>
											<CardDescription className="font-medium justify-end flex">
												{new Date(project.created_at).toLocaleString()}
											</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="flex justify-end">
												<SheetTrigger>
													<Button variant="default">Open</Button>
												</SheetTrigger>
											</div>
										</CardContent>
									</Card>
									<SheetContent className="w-2/5 sm:max-w-full">
										<SheetHeader>
											<SheetTitle>Are you absolutely sure?</SheetTitle>
											<SheetDescription>
												This action cannot be undone. This will permanently delete your
												account and remove your data from our servers.
											</SheetDescription>
										</SheetHeader>
									</SheetContent>
								</Sheet>
							</>
						))}
					</div>
				) : (
					<p className="text-gray-500">No projects found.</p>
				)}
			</div>
		</div>
	);
}
