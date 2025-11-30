"use server";

import { put, del, list } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  // Validate file type (images only)
  if (!file.type.startsWith("image/")) {
    return { error: "Only image files are allowed" };
  }

  // Validate file size (max 4.5MB for Vercel Blob free tier)
  const maxSize = 4.5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { error: "File size must be less than 4.5MB" };
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
    });

    revalidatePath("/admin");

    return { success: true, blob };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload file" };
  }
}

export async function deleteFile(url: string) {
  try {
    await del(url);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { error: "Failed to delete file" };
  }
}

export async function listFiles() {
  try {
    const { blobs } = await list();
    return { success: true, blobs };
  } catch (error) {
    console.error("List error:", error);
    return { error: "Failed to list files", blobs: [] };
  }
}
