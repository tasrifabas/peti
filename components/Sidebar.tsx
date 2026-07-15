"use client";

import { Box, LogOut, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar({
  email,
  atRoot,
  onGoRoot,
  onLogout,
}: {
  email: string | null;
  atRoot: boolean;
  onGoRoot: () => void;
  onLogout: () => void;
}) {
  return (
    <aside className="flex h-full w-full shrink-0 flex-col justify-between border-r border-line bg-surface/60 p-5 backdrop-blur-xl md:w-56">
      <div>
        <div className="mb-8 flex items-center gap-2.5 px-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-coral via-violet to-blue text-white shadow-glow">
            <Box className="h-[18px] w-[18px]" strokeWidth={2.5} />
          </div>
          <p className="font-display text-lg font-semibold text-ink">Peti</p>
        </div>

        <button
          onClick={onGoRoot}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl2 px-3 py-2.5 text-sm font-medium transition-colors",
            atRoot ? "bg-gradient-to-r from-coral/10 via-violet/10 to-blue/10 text-violet" : "text-ink-soft hover:bg-surface-bg"
          )}
        >
          <Home className="h-4 w-4" />
          Semua arsip
        </button>
      </div>

      <div className="border-t border-line pt-4">
        {email && <p className="mb-2 truncate px-1 text-xs text-ink-faint">{email}</p>}
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-xl2 px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-bg hover:text-coral"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
