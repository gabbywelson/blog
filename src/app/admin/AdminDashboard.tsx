"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone, FileRejection } from "react-dropzone";
import { toast, Toaster } from "sonner";
import { logout } from "@/app/actions/auth";
import { uploadFile, deleteFile, renameFile } from "@/app/actions/upload";
import { cn } from "@/lib/utils";
import {
  Upload,
  ImageIcon,
  Trash2,
  Copy,
  LogOut,
  Loader2,
  CheckCircle,
  Link2,
  Pencil,
  FolderOpen,
  FolderPlus,
  X,
  ChevronDown,
} from "lucide-react";
import posthog from "posthog-js";

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
  const [renamingBlob, setRenamingBlob] = useState<Blob | null>(null);
  const [newFilename, setNewFilename] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [uploadFolder, setUploadFolder] = useState<string>("");
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);

  // Extract unique folders from blob pathnames
  const folders = Array.from(
    new Set(
      blobs
        .map((blob) => {
          const parts = blob.pathname.split("/");
          return parts.length > 1 ? parts[0] : null;
        })
        .filter((f): f is string => f !== null)
    )
  ).sort();

  // Filter blobs by selected folder
  const filteredBlobs =
    selectedFolder === "all"
      ? blobs
      : selectedFolder === "root"
      ? blobs.filter((blob) => !blob.pathname.includes("/"))
      : blobs.filter((blob) => blob.pathname.startsWith(`${selectedFolder}/`));

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setIsUploading(true);

      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        if (uploadFolder) {
          formData.append("folder", uploadFolder);
        }

        try {
          const result = await uploadFile(formData);

          if (result.error) {
            // Track upload failure
            posthog.capture("image_upload_failed", {
              error: result.error,
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
            });

            toast.error("Upload failed", {
              description: result.error,
            });
          } else if (result.blob) {
            // Track successful upload
            posthog.capture("image_uploaded", {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              url: result.blob.url,
              folder: uploadFolder || "root",
            });

            setBlobs((prev) => [result.blob, ...prev]);
            toast.success(
              `Uploaded ${file.name}${
                uploadFolder ? ` to ${uploadFolder}` : ""
              }`
            );
          }
        } catch (error) {
          // Track unexpected errors
          posthog.captureException(error as Error);
          posthog.capture("image_upload_failed", {
            error: "Unexpected error",
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
          });

          toast.error("Upload failed", {
            description: "An unexpected error occurred. Please try again.",
          });
        }
      }

      setIsUploading(false);
    },
    [uploadFolder]
  );

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

  const handleCopyMarkdown = (url: string, pathname: string) => {
    const altText = pathname.replace(/\.[^/.]+$/, "").replace(/-/g, " ");
    const markdown = `![${altText}](${url})`;
    navigator.clipboard.writeText(markdown);

    // Track markdown copy event
    posthog.capture("image_markdown_copied", {
      pathname: pathname,
      url: url,
    });

    toast.success("Copied Markdown!", {
      description: markdown.substring(0, 50) + "...",
    });
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);

    // Track URL copy event
    posthog.capture("image_url_copied", {
      url: url,
    });

    toast.success("Copied URL!", {
      description: url.substring(0, 50) + "...",
    });
  };

  const handleRenameOpen = (blob: Blob) => {
    // Extract just the filename (without folder path)
    const filename = blob.pathname.split("/").pop() || blob.pathname;
    setNewFilename(filename);
    setRenamingBlob(blob);
  };

  const handleRenameClose = () => {
    setRenamingBlob(null);
    setNewFilename("");
    setIsRenaming(false);
  };

  const handleRenameSubmit = async () => {
    if (!renamingBlob || !newFilename.trim()) return;

    setIsRenaming(true);

    try {
      // Preserve the folder structure if it exists
      const currentParts = renamingBlob.pathname.split("/");
      const folderPath =
        currentParts.length > 1 ? currentParts.slice(0, -1).join("/") : "";
      const newPathname = folderPath
        ? `${folderPath}/${newFilename.trim()}`
        : newFilename.trim();

      const result = await renameFile(renamingBlob.url, newPathname);

      if (result.error) {
        posthog.capture("image_rename_failed", {
          error: result.error,
          oldPathname: renamingBlob.pathname,
          newPathname: newPathname,
        });

        toast.error("Rename failed", {
          description: result.error,
        });
      } else if (result.blob) {
        posthog.capture("image_renamed", {
          oldPathname: renamingBlob.pathname,
          newPathname: result.blob.pathname,
        });

        setBlobs((prev) =>
          prev.map((b) =>
            b.url === renamingBlob.url ? { ...b, ...result.blob } : b
          )
        );
        toast.success("Image renamed!");
        handleRenameClose();
      }
    } catch (error) {
      posthog.captureException(error as Error);
      toast.error("Rename failed", {
        description: "An unexpected error occurred. Please try again.",
      });
    }

    setIsRenaming(false);
  };

  const handleMoveToFolder = async (blob: Blob, targetFolder: string) => {
    const filename = blob.pathname.split("/").pop() || blob.pathname;
    const newPathname = targetFolder ? `${targetFolder}/${filename}` : filename;

    if (newPathname === blob.pathname) return;

    try {
      const result = await renameFile(blob.url, newPathname);

      if (result.error) {
        toast.error("Move failed", { description: result.error });
      } else if (result.blob) {
        posthog.capture("image_moved", {
          oldPathname: blob.pathname,
          newPathname: result.blob.pathname,
        });

        setBlobs((prev) =>
          prev.map((b) => (b.url === blob.url ? { ...b, ...result.blob } : b))
        );
        toast.success(`Moved to ${targetFolder || "root"}`);
      }
    } catch (error) {
      posthog.captureException(error as Error);
      toast.error("Move failed");
    }
  };

  const handleDelete = async (url: string) => {
    setDeletingUrl(url);

    try {
      const result = await deleteFile(url);

      if (result.error) {
        // Track delete failure
        posthog.capture("image_delete_failed", {
          error: result.error,
          url: url,
        });

        toast.error("Delete failed", {
          description: result.error,
        });
      } else {
        // Track successful delete
        posthog.capture("image_deleted", {
          url: url,
        });

        setBlobs((prev) => prev.filter((b) => b.url !== url));
        toast.success("Image deleted");
      }
    } catch (error) {
      // Track unexpected errors
      posthog.captureException(error as Error);

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
        {/* Folder selector for uploads */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-muted-foreground">Upload to:</span>
          <div className="relative">
            <button
              onClick={() => setShowFolderDropdown(!showFolderDropdown)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium",
                "bg-muted text-foreground border border-border",
                "hover:bg-muted/80 transition-colors"
              )}
            >
              <FolderOpen className="w-4 h-4" />
              {uploadFolder || "Root"}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showFolderDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-card border border-border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setUploadFolder("");
                    setShowFolderDropdown(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors",
                    !uploadFolder && "bg-muted/50"
                  )}
                >
                  Root
                </button>
                {folders.map((folder) => (
                  <button
                    key={folder}
                    onClick={() => {
                      setUploadFolder(folder);
                      setShowFolderDropdown(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors",
                      uploadFolder === folder && "bg-muted/50"
                    )}
                  >
                    {folder}
                  </button>
                ))}
                <div className="border-t border-border my-1" />
                <button
                  onClick={() => {
                    const newFolder = prompt("Enter new folder name:");
                    if (newFolder && newFolder.trim()) {
                      setUploadFolder(newFolder.trim());
                    }
                    setShowFolderDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2 text-primary"
                >
                  <FolderPlus className="w-4 h-4" />
                  New folder...
                </button>
              </div>
            )}
          </div>
        </div>

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
              <p className="text-muted-foreground">
                Uploading{uploadFolder ? ` to ${uploadFolder}` : ""}...
              </p>
            </>
          ) : isDragActive ? (
            <>
              <Upload className="w-12 h-12 text-primary" />
              <p className="text-foreground font-medium">
                Drop it like it&apos;s hot!
              </p>
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-semibold">
            Gallery ({filteredBlobs.length}
            {selectedFolder !== "all" ? ` of ${blobs.length}` : ""} images)
          </h2>
        </div>

        {/* Folder filters */}
        {folders.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedFolder("all")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                selectedFolder === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFolder("root")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                selectedFolder === "root"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Root
            </button>
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                  selectedFolder === folder
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                {folder}
              </button>
            ))}
          </div>
        )}

        {filteredBlobs.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-lg bg-muted/30">
            <ImageIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {blobs.length === 0
                ? "No images uploaded yet."
                : "No images in this folder."}
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              {blobs.length === 0
                ? "Upload your first image to get started."
                : "Try selecting a different folder."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBlobs.map((blob) => (
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
                    "flex flex-col items-center justify-center gap-3",
                    "opacity-0 group-hover:opacity-100 transition-opacity"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleCopyMarkdown(blob.url, blob.pathname)
                      }
                      className={cn(
                        "p-3.5 rounded-xl bg-primary text-primary-foreground h-16 w-16 flex items-center justify-center",
                        "hover:opacity-90 transition-opacity shadow-md"
                      )}
                      title="Copy Markdown"
                    >
                      <Copy className="w-10 h-10" />
                    </button>
                    <button
                      onClick={() => handleCopyUrl(blob.url)}
                      className={cn(
                        "p-3.5 rounded-xl bg-primary text-primary-foreground h-16 w-16 flex items-center justify-center",
                        "hover:opacity-90 transition-opacity shadow-md"
                      )}
                      title="Copy URL"
                    >
                      <Link2 className="w-10 h-10" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRenameOpen(blob)}
                      className={cn(
                        "p-3.5 rounded-xl bg-muted text-foreground h-16 w-16 flex items-center justify-center",
                        "hover:opacity-90 transition-opacity shadow-md"
                      )}
                      title="Rename"
                    >
                      <Pencil className="w-10 h-10" />
                    </button>
                    <button
                      onClick={() => handleDelete(blob.url)}
                      disabled={deletingUrl === blob.url}
                      className={cn(
                        "p-3.5 rounded-xl bg-accent text-accent-foreground h-16 w-16 flex items-center justify-center",
                        "hover:opacity-90 transition-opacity shadow-md",
                        "disabled:opacity-50"
                      )}
                      title="Delete"
                    >
                      {deletingUrl === blob.url ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-10 h-10" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p
                    className="text-sm font-medium truncate"
                    title={blob.pathname}
                  >
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
          Hover over any image for actions: Copy Markdown, Copy URL, Rename, or
          Delete. Use folders to organize your images!
        </p>
      </section>

      {/* Rename Modal */}
      {renamingBlob && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-serif text-lg font-semibold">Rename Image</h3>
              <button
                onClick={handleRenameClose}
                className="p-1 rounded hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Current name
                </label>
                <p className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg">
                  {renamingBlob.pathname}
                </p>
              </div>
              <div>
                <label
                  htmlFor="newFilename"
                  className="block text-sm font-medium mb-1.5"
                >
                  New name
                </label>
                <input
                  id="newFilename"
                  type="text"
                  value={newFilename}
                  onChange={(e) => setNewFilename(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isRenaming) {
                      handleRenameSubmit();
                    }
                  }}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border border-border bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    "placeholder:text-muted-foreground"
                  )}
                  placeholder="Enter new filename..."
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  The file will stay in its current folder.
                </p>
              </div>

              {/* Move to folder option */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Move to folder
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleMoveToFolder(renamingBlob, "")}
                    disabled={!renamingBlob.pathname.includes("/")}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg border border-border",
                      "hover:bg-muted transition-colors",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    Root
                  </button>
                  {folders.map((folder) => {
                    const isCurrentFolder = renamingBlob.pathname.startsWith(
                      `${folder}/`
                    );
                    return (
                      <button
                        key={folder}
                        onClick={() => handleMoveToFolder(renamingBlob, folder)}
                        disabled={isCurrentFolder}
                        className={cn(
                          "px-3 py-1.5 text-sm rounded-lg border border-border",
                          "hover:bg-muted transition-colors",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          isCurrentFolder && "bg-muted"
                        )}
                      >
                        {folder}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      const newFolder = prompt("Enter new folder name:");
                      if (newFolder && newFolder.trim()) {
                        handleMoveToFolder(renamingBlob, newFolder.trim());
                      }
                    }}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg border border-dashed border-primary",
                      "hover:bg-primary/10 transition-colors",
                      "text-primary inline-flex items-center gap-1.5"
                    )}
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    New folder...
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-border">
              <button
                onClick={handleRenameClose}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium",
                  "bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleRenameSubmit}
                disabled={isRenaming || !newFilename.trim()}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium",
                  "bg-primary text-primary-foreground hover:opacity-90 transition-opacity",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "inline-flex items-center gap-2"
                )}
              >
                {isRenaming && <Loader2 className="w-4 h-4 animate-spin" />}
                {isRenaming ? "Renaming..." : "Rename"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
