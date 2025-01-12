import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";
import { toast } from "sonner";

export async function GET() {
	try {
		const { data, error } = await supabase.from("wbs_users").select("*");

		if (error) {
			throw error;
		}

		return NextResponse.json({ users: data }, { status: 200 });
	} catch {
		return NextResponse.json({ error: "No users found" }, { status: 404 });
	}
}

export const fetchUsers = async () => {
	try {
		const { data, error } = await supabase.from("wbs_users").select("*");

		if (error) {
			throw new Error(error.message);
		}
		return data;
	} catch {
		toast.error(`Error fetching users: Please try again.`);
		return null;
	}
};

export const fetchUserById = async (id: string) => {
	try {
		const { data, error } = await supabase
			.from("wbs_users")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return data;
	} catch  {
		toast.error(`Error fetching user: Please try again.`);
		return null;
	}
};

export const fetchTasksForUser = async (userId: string) => {
	try {
		const { data: taskAssignments, error: fetchError } = await supabase
			.from("wbs_users")
			.select("tasks_assign")
			.eq("id", userId)
			.single();

		if (fetchError) {
			throw new Error(fetchError.message);
		}

		const taskIds = taskAssignments?.tasks_assign || [];

		if (taskIds.length === 0) {
			return [];
		}

		const { data: tasksData, error: tasksError } = await supabase
			.from("wbs_tasks")
			.select("id, name, project_id, status, duration, mandays, priority, desc")
			.in("id", taskIds);

		if (tasksError) {
			throw new Error(tasksError.message);
		}

		return (
			tasksData?.map(
				(task: {
					id: string;
					name: string;
					project_id: string;
					status: string;
					duration: number;
					mandays: number;
					priority: string;
					desc: string;
				}) => ({
					id: task.id,
					name: task.name,
					project_id: task.project_id,
					status: task.status,
					duration: task.duration,
					mandays: task.mandays,
					priority: task.priority,
					desc: task.desc,
				})
			) || []
		);
	} catch {
		toast.error("Error fetching tasks.");
		return [];
	}
};
