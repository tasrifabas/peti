"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import type { FileRow } from "@/lib/types";
import { fileKind, formatBytes, formatDateTime } from "@/lib/utils";
import { FileIcon } from "@/components/FileIcon";
import { Download, Loader2 } from "lucide-react";

export default function PreviewModal({
  open,
  onClose,
  file,
  getBlobUrl,
  onDownload,
}: {
  open: boolean;
  onClose: () => void;
  file: FileRow | null;
  getBlobUrl: (file: FileRow) => Promise<string>;
  onDownload: (file: FileRow) => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !file) {
      setUrl(null);
      return;
    }
    const kind = fileKind(file.mime_type, file.name);
    if (kind !== "image" && kind !== "pdf") return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    getBlobUrl(file)
      .then((blobUrl) => {
        if (!cancelled) setUrl(blobUrl);
      })
      .catch(() => {
        if (!cancelled) setError("Pratinjau gagal dimuat.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, file, getBlobUrl]);

  if (!file) return null;
  const kind = fileKind(file.mime_type, file.name);

  return (
    <Modal open={open} onClose={onClose} title={file.name} wide>
      <div className="mb-4 flex min-h-[16rem] items-center justify-center overflow-hidden rounded-xl2 bg-surface-bg">
        {loading && <Loader2 className="h-6 w-6 animate-spin text-ink-faint" />}
        {!loading && error && <p className="text-sm text-ink-soft">{error}</p>}
        {!loading && !error && kind === "image" && url && (
          <img src={url} alt={file.name} className="max-h-[28rem] w-full object-contain" />
        )}
        {!loading && !error && kind === "pdf" && url && (
          <iframe src={url} title={file.name} className="h-[28rem] w-full rounded-xl2" />
        )}
        {!loading && kind !== "image" && kind !== "pdf" && (
          <div className="flex flex-col items-center gap-3 py-10 text-ink-soft">
            <FileIcon kind={kind} className="h-12 w-12" />
            <p className="text-sm">Pratinjau tidak tersedia untuk tipe file ini.</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-soft">
          {formatBytes(file.size)} · Diunggah {formatDateTime(file.created_at)}
        </p>
        <button
          onClick={() => onDownload(file)}
          className="flex items-center gap-2 rounded-xl2 bg-gradient-to-r from-coral via-violet to-blue px-4 py-2 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
        >
          <Download className="h-3.5 w-3.5" />
          Unduh
        </button>
      </div>
    </Modal>
  );
}
