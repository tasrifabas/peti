"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export type MenuAction = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
};

export default function ItemMenu({ actions }: { actions: MenuAction[] }) {
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
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="rounded-full p-1.5 text-ink-faint opacity-0 transition-all hover:bg-surface-bg hover:text-ink group-hover:opacity-100 data-[open=true]:opacity-100"
        data-open={open}
        aria-label="Menu aksi"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-xl2 border border-line bg-surface py-1 shadow-card"
        >
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                setOpen(false);
                action.onClick();
              }}
              className={cn(
                "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors hover:bg-surface-bg",
                action.danger ? "text-coral" : "text-ink"
              )}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
