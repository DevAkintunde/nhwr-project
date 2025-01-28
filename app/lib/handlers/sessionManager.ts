"use server";
import { cookies } from "next/headers";

/* User the handler to manager everything related to session of App */
export async function saveToken(token: string) {
	cookies().set("sessionAuth", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 7, // One week
		path: "/",
	});
	// Redirect or handle the response after setting the cookie
}
