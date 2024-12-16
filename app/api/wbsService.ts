import supabase from "@/lib/supabase";

export interface WBSUser {
	id: number;
	username: string;
	password: string;
	role: string;
}

export const fetchWBSData = async (): Promise<WBSUser[]> => {
	try {
		const { data: wbs, error } = await supabase.from("wbs_users").select("*");
		if (error) throw new Error(error.message);
		return wbs as WBSUser[];
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error fetching WBS data:", error.message);
			throw error;
		}
		console.error("Unexpected error fetching WBS data:", error);
		throw new Error("Unexpected error occurred.");
	}
};

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
	} catch (error) {
		if (error instanceof Error) {
			return { valid: false, message: error.message };
		}
		console.error("Unexpected error during login validation:", error);
		return { valid: false, message: "An unexpected error occurred." };
	}
};
