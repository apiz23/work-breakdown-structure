"use client";

import { Button } from "@/components/ui/button";
import { Log } from "@/lib/interface";
import { fetchLog } from "@/services/log";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page() {
	const [logs, setLogs] = useState<Log[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLogs = async () => {
			try {
				const data: Log[] | null = await fetchLog();
				setLogs(data ?? []);
			} catch (error) {
				toast.error("Error fetching logs.");
				setLogs([]);
			} finally {
				setLoading(false);
			}
		};

		const hasRefreshed = sessionStorage.getItem("hasRefreshed");

		if (!hasRefreshed) {
			sessionStorage.setItem("hasRefreshed", "true");
			window.location.reload();
		}

		fetchLogs();
	}, []);

	return (
		<div className="max-w-4xl mx-auto p-4 pt-20">
			<div className="mx-auto max-w-3xl text-center">
				<h1 className="bg-gradient-to-r from-red-300 via-yellow-500 to-red-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
					Work Breakdown Structure
				</h1>
				<h2 className="bg-gradient-to-r from-red-300 via-yellow-500 to-red-600 bg-clip-text text-xl font-extrabold text-transparent sm:text-3xl">
					Admin
				</h2>

				<p className="mx-auto mt-4 max-w-xl sm:text-lg/relaxed">
					The Work Breakdown Structure (WBS) divides projects into manageable tasks
					for clarity and tracking.
				</p>

				<div className="mt-8 flex flex-wrap justify-center gap-4">
					<Link href="/admin/projects">
						<Button>Project</Button>
					</Link>
					<Link href="/admin/tasks">
						<Button>Task</Button>
					</Link>
					<Link href="/admin/users">
						<Button>Users</Button>
					</Link>
				</div>
			</div>

			<div className="my-10 py-2">
				{loading ? (
					<p>Loading logs...</p>
				) : logs.length > 0 ? (
					<ScrollArea className="w-full h-[30vh] rounded-md border">
						<Table>
							<TableCaption>A list of recent logs.</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[50px]">No</TableHead>
									<TableHead>Action</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Details</TableHead>
									<TableHead>Created At</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{logs.map((log, index) => (
									<TableRow key={log.id}>
										<TableCell className="font-medium">{index + 1}</TableCell>
										<TableCell>{log.action}</TableCell>
										<TableCell>{log.status}</TableCell>
										<TableCell>{log.details}</TableCell>
										<TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</ScrollArea>
				) : (
					<p>No logs found.</p>
				)}
			</div>
		</div>
	);
}
