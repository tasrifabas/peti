"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export type Toast = { id: string; message: string; type: "success" | "error" };

export default function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2.5 rounded-xl2 border border-line bg-surface px-4 py-3 text-sm text-ink shadow-card"
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-mint" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0 text-coral" />
            )}
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
