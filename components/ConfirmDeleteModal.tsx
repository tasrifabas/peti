"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { cn } from "@/lib/utils";
import { Loader2, TriangleAlert } from "lucide-react";

export default function ConfirmDeleteModal({
  open,
  onClose,
  itemName,
  isFolder,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  itemName: string;
  isFolder: boolean;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Gagal menghapus, coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Hapus item">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral">
          <TriangleAlert className="h-[18px] w-[18px]" />
        </div>
        <p className="text-sm text-ink-soft">
          Yakin mau menghapus <span className="font-medium text-ink">"{itemName}"</span>
          {isFolder ? " beserta semua isi di dalamnya" : ""}? Tindakan ini tidak bisa dibatalkan.
        </p>
      </div>
      {error && <p className="mt-3 text-sm text-coral">{error}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-xl2 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-bg"
        >
          Batal
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={cn(
            "flex items-center gap-2 rounded-xl2 bg-coral px-4 py-2 text-sm font-medium text-white",
            "transition-transform hover:scale-[1.02] disabled:opacity-70"
          )}
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Hapus
        </button>
      </div>
    </Modal>
  );
}
