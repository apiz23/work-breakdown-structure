import supabase from "@/lib/supabase";
import { toast } from "sonner";

export const fetchLog = async () => {
	try {
		let { data: wbs_logs, error } = await supabase
			.from("wbs_logs")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			toast.error(
				`Error fetching logs: ${error.message || "Unknown error occurred"}`
			);
			return [];
		}

		return wbs_logs;
	} catch (err: any) {
		toast.error("Unexpected error while fetching logs:", err);
		return [];
	}
};

export const insertLog = async (
	userId: string | null = null,
	action: string,
	itemId: string = "0",
	itemType: string | null = null,
	status: string,
	details: string | null = null
) => {
	try {
		const { error } = await supabase.from("wbs_logs").insert([
			{
				user_id: userId,
				action,
				item_id: itemId,
				item_type: itemType,
				status,
				details,
			},
		]);

		if (error) {
			throw new Error(`Failed to insert log: ${error.message}`);
		}

		console.log("Log inserted successfully.");
	} catch (error: any) {
		console.error("Log insertion error:", error.message);
		toast.error("An error occurred while logging the action.");
	}
};
