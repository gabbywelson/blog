import { list } from "@vercel/blob";
import { AdminDashboard } from "./AdminDashboard";

export const metadata = {
  title: "Admin | Gabby's Garden",
  description: "Hidden admin dashboard",
};

export default async function AdminPage() {
  let blobs: Awaited<ReturnType<typeof list>>["blobs"] = [];

  try {
    const result = await list();
    blobs = result.blobs;
  } catch (error) {
    console.error("Failed to list blobs:", error);
  }

  return <AdminDashboard initialBlobs={blobs} />;
}


