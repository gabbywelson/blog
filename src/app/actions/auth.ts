"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: "Admin password not configured" };
  }

  if (password !== adminPassword) {
    return { error: "Invalid password" };
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_session", password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Session cookie - expires when browser closes
    // Or set maxAge for persistent login: maxAge: 60 * 60 * 24 * 7 (7 days)
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/login");
}
