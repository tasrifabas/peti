"use client";

import { motion } from "framer-motion";
import { Download, Pencil, Trash2 } from "lucide-react";
import type { FileRow } from "@/lib/types";
import { accentForKind, fileKind, formatBytes } from "@/lib/utils";
import { FileIcon } from "@/components/FileIcon";
import ItemMenu from "@/components/ItemMenu";

export default function FileCard({
  file,
  onOpen,
  onDownload,
  onRename,
  onDelete,
}: {
  file: FileRow;
  onOpen: () => void;
  onDownload: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  const kind = fileKind(file.mime_type, file.name);
  const accent = accentForKind(kind);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onClick={onOpen}
      className="group relative flex items-center gap-3 rounded-xl2 border border-line bg-surface p-3.5 text-left shadow-soft transition-shadow hover:shadow-card"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-bg ${accent}`}
      >
        <FileIcon kind={kind} className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{file.name}</p>
        <p className="text-xs text-ink-soft">{formatBytes(file.size)}</p>
      </div>
      <div className="flex shrink-0 items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className="rounded-full p-1.5 text-ink-faint opacity-0 transition-all hover:bg-surface-bg hover:text-ink group-hover:opacity-100"
          aria-label="Unduh"
        >
          <Download className="h-4 w-4" />
        </button>
        <ItemMenu
          actions={[
            {
              label: "Unduh",
              icon: <Download className="h-3.5 w-3.5" />,
              onClick: onDownload,
            },
            {
              label: "Ganti nama",
              icon: <Pencil className="h-3.5 w-3.5" />,
              onClick: onRename,
            },
            {
              label: "Hapus",
              icon: <Trash2 className="h-3.5 w-3.5" />,
              onClick: onDelete,
              danger: true,
            },
          ]}
        />
      </div>
    </motion.button>
  );
}
