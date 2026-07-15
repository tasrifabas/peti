"use client";

import { FolderPlus, Search, X } from "lucide-react";
import type { FolderRow } from "@/lib/types";
import Breadcrumb from "@/components/Breadcrumb";
import UploadButton from "@/components/UploadButton";

export default function TopBar({
  path,
  onNavigate,
  search,
  onSearchChange,
  onCreateFolder,
  onFiles,
}: {
  path: FolderRow[];
  onNavigate: (folderId: string | null) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onCreateFolder: () => void;
  onFiles: (files: FileList) => void;
}) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb path={path} onNavigate={onNavigate} />
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateFolder}
            className="flex items-center gap-2 rounded-xl2 border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-bg"
          >
            <FolderPlus className="h-4 w-4" />
            Folder baru
          </button>
          <UploadButton onFiles={onFiles} />
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari file atau folder di seluruh arsip..."
          className="w-full rounded-xl2 border border-line bg-surface py-2.5 pl-10 pr-10 text-sm text-ink outline-none transition-colors focus:border-violet"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
            aria-label="Bersihkan pencarian"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
