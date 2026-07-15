"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UploadCloud } from "lucide-react";

export default function DropzoneArea({
  onFiles,
  children,
}: {
  onFiles: (files: FileList) => void;
  children: React.ReactNode;
}) {
  const [dragging, setDragging] = useState(false);
  const [depth, setDepth] = useState(0);

  return (
    <div
      className="relative"
      onDragEnter={(e) => {
        e.preventDefault();
        setDepth((d) => d + 1);
        if (e.dataTransfer.types.includes("Files")) setDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        e.preventDefault();
        setDepth((d) => {
          const next = d - 1;
          if (next <= 0) setDragging(false);
          return next;
        });
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        setDepth(0);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          onFiles(e.dataTransfer.files);
        }
      }}
    >
      {children}
      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-surface-bg/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center gap-3 rounded-xl3 border-2 border-dashed border-violet bg-surface px-14 py-12 shadow-card"
            >
              <UploadCloud className="h-10 w-10 text-violet" strokeWidth={1.6} />
              <p className="font-display text-lg font-medium text-ink">
                Lepas file untuk mengunggah
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
