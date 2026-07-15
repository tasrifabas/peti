"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function NamePromptModal({
  open,
  onClose,
  title,
  label,
  initialValue = "",
  confirmLabel = "Simpan",
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  label: string;
  initialValue?: string;
  confirmLabel?: string;
  onSubmit: (value: string) => Promise<void>;
}) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setError(null);
    }
  }, [open, initialValue]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(value.trim());
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-soft">{label}</label>
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-xl2 border border-line bg-surface-raised px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-violet"
          />
        </div>
        {error && <p className="text-sm text-coral">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl2 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-bg"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "flex items-center gap-2 rounded-xl2 bg-gradient-to-r from-coral via-violet to-blue px-4 py-2",
              "text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-70"
            )}
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
