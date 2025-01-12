import supabase from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const projectID = searchParams.get("projectID");

	try {
		let query = supabase.from("wbs_tasks").select("*");

		if (projectID) {
			query = query.eq("project_id", projectID);
		}

		const { data, error } = await query;

		if (error) {
			throw new Error(error.message);
		}

		if (!data || data.length === 0) {
			return NextResponse.json(
				{
					error: projectID
						? "No tasks found for this project ID."
						: "No tasks found.",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({ tasks: data });
	} catch (error) {
		console.error("Error fetching data:", error);
		return NextResponse.json({ error: "Failed to fetch data." }, { status: 500 });
	}
}
