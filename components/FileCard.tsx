"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Pencil, Trash2 } from "lucide-react";
import type { FileRow } from "@/lib/types";
import { accentForKind, fileKind, formatBytes } from "@/lib/utils";
import { FileIcon } from "@/components/FileIcon";
import ItemMenu from "@/components/ItemMenu";

// Cache thumbnail per sesi (di luar komponen, jadi bertahan selama halaman
// tidak di-reload). Signed URL thumbnail dibuat dengan expiry 1 jam, jadi
// aman dipakai ulang tanpa fetch berulang saat pindah folder bolak-balik.
const thumbCache = new Map<string, string>();

export default function FileCard({
  file,
  onOpen,
  onDownload,
  onRename,
  onDelete,
  getThumbnailUrl,
}: {
  file: FileRow;
  onOpen: () => void;
  onDownload: () => void;
  onRename: () => void;
  onDelete: () => void;
  // Opsional: kalau disediakan, thumbnail gambar/video ditampilkan langsung
  // di kartu (mis. saat folder dibuka), bukan hanya di modal preview.
  getThumbnailUrl?: (file: FileRow) => Promise<string>;
}) {
  const kind = fileKind(file.mime_type, file.name);
  const accent = accentForKind(kind);
  const canThumb = kind === "image" || kind === "video";

  const [thumbUrl, setThumbUrl] = useState<string | null>(
    canThumb ? thumbCache.get(file.id) ?? null : null
  );
  const [thumbFailed, setThumbFailed] = useState(false);
  const [inView, setInView] = useState(false);
  const cardRef = useRef<HTMLButtonElement | null>(null);

  // Hanya mulai muat thumbnail saat kartu benar-benar terlihat (atau
  // hampir terlihat) di layar, bukan langsung semua sekaligus saat folder
  // dibuka. Ini mencegah puluhan request paralel untuk folder besar.
  useEffect(() => {
    if (!canThumb || thumbUrl || !getThumbnailUrl) return;
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [canThumb, thumbUrl, getThumbnailUrl]);

  useEffect(() => {
    if (!inView || !getThumbnailUrl || thumbUrl || thumbFailed || !canThumb) return;
    let cancelled = false;
    getThumbnailUrl(file)
      .then((url) => {
        if (cancelled) return;
        thumbCache.set(file.id, url);
        setThumbUrl(url);
      })
      .catch(() => {
        if (!cancelled) setThumbFailed(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, file.id, canThumb]);

  const showThumb = canThumb && thumbUrl && !thumbFailed;

  return (
    <motion.button
      ref={cardRef}
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
        className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface-bg ${accent}`}
      >
        {showThumb && kind === "image" && (
          <img
            src={thumbUrl}
            alt={file.name}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            onError={() => setThumbFailed(true)}
          />
        )}
        {showThumb && kind === "video" && (
          <video
            src={thumbUrl}
            className="h-full w-full object-cover"
            muted
            preload="metadata"
            onError={() => setThumbFailed(true)}
          />
        )}
        {!showThumb && <FileIcon kind={kind} className="h-5 w-5" />}
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
