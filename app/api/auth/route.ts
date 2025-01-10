import { fetchWBSData, validateLogin } from "@/app/service/wbsService";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const data = await fetchWBSData();
		return NextResponse.json(data); // return the data as JSON response
	} catch (err) {
		console.error("Error during GET request:", err); // Log the error
		return NextResponse.json(
			{ message: "An error occurred while fetching data." },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	const { username, password } = await request.json(); // extract data from the request

	try {
		const loginResponse = await validateLogin(username, password);
		if (loginResponse.valid) {
			return NextResponse.json(loginResponse); // return login success response
		} else {
			return NextResponse.json(loginResponse, { status: 400 }); // return error response
		}
	} catch (err) {
		console.error("Error during POST request:", err); // Log the error
		return NextResponse.json(
			{ message: "An error occurred during login." },
			{ status: 500 }
		);
	}
}
