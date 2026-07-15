import { PackageOpen } from "lucide-react";

export default function EmptyState({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl3 border border-dashed border-line py-20 text-center animate-fade-up">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-coral/15 via-violet/15 to-blue/15 text-violet">
        <PackageOpen className="h-6 w-6" strokeWidth={1.8} />
      </div>
      <p className="font-display text-base font-medium text-ink">
        {label ?? "Folder ini masih kosong"}
      </p>
      <p className="mt-1 text-sm text-ink-soft">
        Seret file ke sini, atau buat folder baru untuk mulai merapikan arsipmu.
      </p>
    </div>
  );
}
