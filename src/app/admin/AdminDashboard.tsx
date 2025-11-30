"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone, FileRejection } from "react-dropzone";
import { toast, Toaster } from "sonner";
import { logout } from "@/app/actions/auth";
import { uploadFile, deleteFile } from "@/app/actions/upload";
import { cn } from "@/lib/utils";
import {
  Upload,
  ImageIcon,
  Trash2,
  Copy,
  LogOut,
  Loader2,
  CheckCircle,
} from "lucide-react";

interface Blob {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
}

interface AdminDashboardProps {
  initialBlobs: Blob[];
}

export function AdminDashboard({ initialBlobs }: AdminDashboardProps) {
  const [blobs, setBlobs] = useState<Blob[]>(initialBlobs);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const result = await uploadFile(formData);

        if (result.error) {
          toast.error("Upload failed", {
            description: result.error,
          });
        } else if (result.blob) {
          setBlobs((prev) => [result.blob as Blob, ...prev]);
          toast.success(`Uploaded ${file.name}`);
        }
      } catch (error) {
        toast.error("Upload failed", {
          description: "An unexpected error occurred. Please try again.",
        });
      }
    }

    setIsUploading(false);
  }, []);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    fileRejections.forEach((rejection) => {
      const errors = rejection.errors.map((e) => {
        if (e.code === "file-too-large") {
          return "File is too large (max 4.5MB)";
        }
        if (e.code === "file-invalid-type") {
          return "Invalid file type (images only)";
        }
        return e.message;
      });

      toast.error(`Rejected: ${rejection.file.name}`, {
        description: errors.join(", "),
      });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
    },
    maxSize: 4.5 * 1024 * 1024, // 4.5MB
  });

  const handleCopy = (url: string, pathname: string) => {
    const altText = pathname.replace(/\.[^/.]+$/, "").replace(/-/g, " ");
    const markdown = `![${altText}](${url})`;
    navigator.clipboard.writeText(markdown);
    toast.success("Copied to clipboard!", {
      description: markdown.substring(0, 50) + "...",
    });
  };

  const handleDelete = async (url: string) => {
    setDeletingUrl(url);

    try {
      const result = await deleteFile(url);

      if (result.error) {
        toast.error("Delete failed", {
          description: result.error,
        });
      } else {
        setBlobs((prev) => prev.filter((b) => b.url !== url));
        toast.success("Image deleted");
      }
    } catch (error) {
      toast.error("Delete failed", {
        description: "An unexpected error occurred. Please try again.",
      });
    }

    setDeletingUrl(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "bg-card border border-border text-foreground",
        }}
      />

      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold">Hidden Garden</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage your blog images
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-muted text-muted-foreground font-medium",
              "hover:bg-muted/80 transition-colors"
            )}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </form>
      </header>

      {/* Upload Zone */}
      <section className="mb-12">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-12",
            "flex flex-col items-center justify-center gap-4",
            "cursor-pointer transition-all duration-200",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <input {...getInputProps()} />

          {isUploading ? (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-muted-foreground">Uploading...</p>
            </>
          ) : isDragActive ? (
            <>
              <Upload className="w-12 h-12 text-primary" />
              <p className="text-foreground font-medium">Drop it like it's hot!</p>
            </>
          ) : (
            <>
              <div className="p-4 rounded-full bg-primary/10">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-foreground font-medium">
                  Drag & drop images here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse • PNG, JPG, GIF, WebP, SVG • Max 4.5MB
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section>
        <h2 className="font-serif text-xl font-semibold mb-6">
          Gallery ({blobs.length} images)
        </h2>

        {blobs.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-lg bg-muted/30">
            <ImageIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No images uploaded yet.</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Upload your first image to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {blobs.map((blob) => (
              <div
                key={blob.url}
                className={cn(
                  "group relative bg-card border border-border rounded-lg overflow-hidden",
                  "transition-all duration-200 hover:shadow-lg hover:border-primary/30"
                )}
              >
                {/* Image */}
                <div className="aspect-square relative bg-muted">
                  <Image
                    src={blob.url}
                    alt={blob.pathname}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>

                {/* Overlay on hover */}
                <div
                  className={cn(
                    "absolute inset-0 bg-background/80 backdrop-blur-sm",
                    "flex items-center justify-center gap-2",
                    "opacity-0 group-hover:opacity-100 transition-opacity"
                  )}
                >
                  <button
                    onClick={() => handleCopy(blob.url, blob.pathname)}
                    className={cn(
                      "p-3 rounded-lg bg-primary text-primary-foreground",
                      "hover:opacity-90 transition-opacity"
                    )}
                    title="Copy Markdown"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(blob.url)}
                    disabled={deletingUrl === blob.url}
                    className={cn(
                      "p-3 rounded-lg bg-accent text-accent-foreground",
                      "hover:opacity-90 transition-opacity",
                      "disabled:opacity-50"
                    )}
                    title="Delete"
                  >
                    {deletingUrl === blob.url ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-medium truncate" title={blob.pathname}>
                    {blob.pathname}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(blob.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick tip */}
      <section className="mt-12 p-6 rounded-lg bg-muted/50 border border-border">
        <h3 className="font-medium flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-secondary" />
          Quick Tip
        </h3>
        <p className="text-sm text-muted-foreground">
          Click any image to copy its Markdown snippet:{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted text-accent">
            ![alt](url)
          </code>
          . Paste it directly into your MDX files!
        </p>
      </section>
    </div>
  );
}
