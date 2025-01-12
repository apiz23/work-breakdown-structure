import supabase from "@/lib/supabase";
import { toast } from "sonner";

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
