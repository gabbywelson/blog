import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
	const adminSession = request.cookies.get("admin_session")?.value;
	const adminPassword = process.env.ADMIN_PASSWORD;

	// If no password is configured, deny all access
	if (!adminPassword) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Check if the session cookie matches the admin password
	if (adminSession !== adminPassword) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: "/admin/:path*",
};
