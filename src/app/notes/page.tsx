import Link from "next/link";
import { getAllNotes } from "@/lib/mdx";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

export const metadata = {
  title: "Notes | Gabby's Garden",
  description: "Evergreen notes and reference material from my digital garden",
};

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          Notes
        </h1>
        <p className="text-xl text-muted-foreground">
          Evergreen notes and reference material. These are living documents
          that I update over time.
        </p>
      </header>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            No notes yet. This section is still being cultivated.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <article
              key={note.slug}
              className={cn(
                "group bg-card border border-border rounded-lg overflow-hidden",
                "transition-all duration-300",
                "hover:shadow-xl hover:shadow-primary/5",
                "hover:border-primary/30"
              )}
            >
              <Link href={`/notes/${note.slug}`} className="block p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-2 rounded-lg bg-muted",
                      "group-hover:bg-primary/10 transition-colors"
                    )}
                  >
                    <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {note.title}
                    </h2>
                    {note.excerpt && (
                      <p className="text-muted-foreground line-clamp-2">
                        {note.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
