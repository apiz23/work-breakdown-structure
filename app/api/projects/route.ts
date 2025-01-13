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
