"use client";

import { ChevronRight, Box } from "lucide-react";
import type { FolderRow } from "@/lib/types";

export default function Breadcrumb({
  path,
  onNavigate,
}: {
  path: FolderRow[];
  onNavigate: (folderId: string | null) => void;
}) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-medium text-ink-soft transition-colors hover:bg-surface hover:text-ink active:bg-surface"
      >
        <Box className="h-3.5 w-3.5" />
        Semua arsip
      </button>
      {path.map((folder) => (
        <span key={folder.id} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 text-ink-faint" />
          <button
            onClick={() => onNavigate(folder.id)}
            className="max-w-[9rem] truncate rounded-lg px-2 py-1.5 font-medium text-ink-soft transition-colors hover:bg-surface hover:text-ink active:bg-surface sm:max-w-none"
          >
            {folder.name}
          </button>
        </span>
      ))}
    </nav>
  );
}
