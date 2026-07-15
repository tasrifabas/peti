"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UploadButton({
  onFiles,
  className,
}: {
  onFiles: (files: FileList) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) onFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex items-center gap-2 rounded-xl2 bg-gradient-to-r from-coral via-violet to-blue px-4 py-2.5",
          "text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
      >
        <Upload className="h-4 w-4" />
        Unggah file
      </button>
    </>
  );
}
