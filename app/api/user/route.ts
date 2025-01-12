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
