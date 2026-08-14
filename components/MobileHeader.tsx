"use client";

import { useEffect, useRef, useState } from "react";
import { Box, LogOut, User } from "lucide-react";

export default function MobileHeader({
  email,
  onLogout,
}: {
  email: string | null;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface/80 px-4 py-3 backdrop-blur-xl md:hidden">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-coral via-violet to-blue text-white shadow-glow">
          <Box className="h-4 w-4" strokeWidth={2.5} />
        </div>
        <p className="font-display text-base font-semibold text-ink">Peti</p>
      </div>

      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu akun"
          data-open={open}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-bg text-ink-soft transition-colors data-[open=true]:bg-violet/10 data-[open=true]:text-violet"
        >
          <User className="h-4 w-4" />
        </button>
        {open && (
          <div className="absolute right-0 top-11 z-30 w-52 overflow-hidden rounded-xl2 border border-line bg-surface py-1 shadow-card animate-fade-up">
            {email && (
              <p className="truncate border-b border-line px-3.5 py-2.5 text-xs text-ink-faint">
                {email}
              </p>
            )}
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-ink-soft transition-colors hover:bg-surface-bg hover:text-coral active:bg-surface-bg"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
