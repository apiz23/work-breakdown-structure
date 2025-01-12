import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";
import { toast } from "sonner";

export async function GET() {
	try {
		const { data: wbs_project, error } = await supabase
			.from("wbs_projects")
			.select("*");

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(wbs_project, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}

export const fetchProject = async () => {
	try {
		const { data, error } = await supabase.from("wbs_projects").select("*");

		if (error) {
			throw new Error(error.message);
		}

		return data;
	} catch {
		toast.error(`Error fetching users: Please try again.`);
		return null;
	}
};

export const fetchProjectById = async (id: string) => {
	try {
		const { data, error } = await supabase
			.from("wbs_projects")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return data;
	} catch {
		toast.error(`Error fetching user: Please try again.`);
		return null;
	}
};

export const addProject = async (projectData: {
	name: string;
	desc?: string;
	start_date?: string;
	end_date?: string;
	status?: string;
	total_mandays?: number;
	completion?: number;
	created_by?: string;
}) => {
	try {
		const { data, error } = await supabase
			.from("wbs_projects")
			.insert([projectData])
			.select();

		if (error) {
			throw new Error(error.message);
		}

		toast.success("Project added successfully!");
		return data;
	} catch {
		toast.error(`Error adding project: Please try again later.`);
		return null;
	}
};
