// api/wbsService.ts
import supabase from "@/lib/supabase";

export interface WBSUser {
	id: number;
	username: string;
	password: string;
	role: string;
}

/**
 * Fetches all users from the "wbs_users" table.
 */
export const fetchWBSData = async (): Promise<WBSUser[]> => {
	try {
		const { data: wbs, error } = await supabase.from("wbs_users").select("*");
		if (error) throw new Error(error.message);
		return wbs as WBSUser[];
	} catch (error) {
		console.error("Error fetching WBS data:", error);
		throw error;
	}
};

/**
 * Validates the username and password against the "wbs_users" data.
 */
export const validateLogin = async (
	username: string,
	password: string
): Promise<{
	valid: boolean;
	userName?: string;
	role?: string;
	message?: string;
}> => {
	try {
		const wbsData = await fetchWBSData();
		const validUser = wbsData.find(
			(user) => user.username === username && user.password === password
		);

		if (validUser) {
			sessionStorage.setItem("login", "authorized");
			sessionStorage.setItem("userName", validUser.username);

			return { valid: true, userName: validUser.username, role: validUser.role };
		} else {
			return { valid: false, message: "Invalid username or password." };
		}
	} catch (error: any) {
		return { valid: false, message: error.message };
	}
};
