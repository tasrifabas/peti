"use client";

import { AnimatePresence } from "framer-motion";
import type { FileRow, FolderRow } from "@/lib/types";
import FolderCard from "@/components/FolderCard";
import FileCard from "@/components/FileCard";
import EmptyState from "@/components/EmptyState";

export default function FileGrid({
  folders,
  files,
  onOpenFolder,
  onOpenFile,
  onDownloadFile,
  onRenameFolder,
  onRenameFile,
  onDeleteFolder,
  onDeleteFile,
  emptyLabel,
}: {
  folders: FolderRow[];
  files: FileRow[];
  onOpenFolder: (f: FolderRow) => void;
  onOpenFile: (f: FileRow) => void;
  onDownloadFile: (f: FileRow) => void;
  onRenameFolder: (f: FolderRow) => void;
  onRenameFile: (f: FileRow) => void;
  onDeleteFolder: (f: FolderRow) => void;
  onDeleteFile: (f: FileRow) => void;
  emptyLabel?: string;
}) {
  if (folders.length === 0 && files.length === 0) {
    return <EmptyState label={emptyLabel} />;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            onOpen={() => onOpenFolder(folder)}
            onRename={() => onRenameFolder(folder)}
            onDelete={() => onDeleteFolder(folder)}
          />
        ))}
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onOpen={() => onOpenFile(file)}
            onDownload={() => onDownloadFile(file)}
            onRename={() => onRenameFile(file)}
            onDelete={() => onDeleteFile(file)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
