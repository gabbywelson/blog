"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPostHogClient } from "@/lib/posthog-server";

export async function login(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const posthog = getPostHogClient();

  if (!adminPassword) {
    return { error: "Admin password not configured" };
  }

  if (password !== adminPassword) {
    // Track failed login attempt
    posthog.capture({
      distinctId: "admin",
      event: "admin_login_failed",
      properties: {
        error: "Invalid password",
        source: "server",
      },
    });
    await posthog.shutdown();
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

  // Identify and track successful login
  posthog.identify({
    distinctId: "admin",
    properties: {
      role: "admin",
    },
  });

  posthog.capture({
    distinctId: "admin",
    event: "admin_login_success",
    properties: {
      source: "server",
    },
  });

  await posthog.shutdown();
  redirect("/admin");
}

export async function logout() {
  const posthog = getPostHogClient();

  // Track logout event
  posthog.capture({
    distinctId: "admin",
    event: "admin_logout",
    properties: {
      source: "server",
    },
  });

  await posthog.shutdown();

  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/login");
}


