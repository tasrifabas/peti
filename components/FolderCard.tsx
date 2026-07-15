"use client";

import { motion } from "framer-motion";
import { Folder, Pencil, Trash2 } from "lucide-react";
import type { FolderRow } from "@/lib/types";
import { gradientForName } from "@/lib/utils";
import ItemMenu from "@/components/ItemMenu";

export default function FolderCard({
  folder,
  onOpen,
  onRename,
  onDelete,
}: {
  folder: FolderRow;
  onOpen: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  const gradient = gradientForName(folder.name);

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
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white`}
      >
        <Folder className="h-5 w-5" fill="currentColor" strokeWidth={0} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{folder.name}</p>
        <p className="text-xs text-ink-soft">Folder</p>
      </div>
      <ItemMenu
        actions={[
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
    </motion.button>
  );
}
