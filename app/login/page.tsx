"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound, ArrowRight, Loader2, Box } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { APP_LOGIN_EMAIL } from "@/lib/auth-config";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: APP_LOGIN_EMAIL,
      password: pin,
    });
    setLoading(false);
    if (error) {
      setError("PIN salah. Coba lagi.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-coral/30 blur-3xl animate-blob-pulse"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-violet/25 blur-3xl animate-blob-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue/25 blur-3xl animate-blob-pulse"
        style={{ animationDelay: "4s" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm rounded-xl3 border border-line bg-surface/80 p-8 shadow-card backdrop-blur-xl"
      >
        <div className="mb-8 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-coral via-violet to-blue text-white shadow-glow">
            <Box className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold leading-none text-ink">Peti</p>
            <p className="text-xs text-ink-soft">Arsip pribadi, rapi & berwarna</p>
          </div>
        </div>

        <h1 className="mb-1 font-display text-2xl font-semibold text-ink">Masuk</h1>
        <p className="mb-6 text-sm text-ink-soft">Masukkan PIN untuk membuka Peti.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field icon={<KeyRound className="h-4 w-4" />}>
            <input
              type="password"
              inputMode="text"
              autoFocus
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
            />
          </Field>
          {error && <p className="text-sm text-coral">{error}</p>}
          <SubmitButton loading={loading} label="Masuk" />
        </form>
      </motion.div>
    </main>
  );
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl2 border border-line bg-surface-raised px-3.5 py-2.5 transition-colors focus-within:border-violet">
      <span className="text-ink-faint">{icon}</span>
      {children}
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-xl2 bg-gradient-to-r from-coral via-violet to-blue px-4 py-2.5",
        "font-medium text-sm text-white shadow-glow transition-transform hover:scale-[1.01] active:scale-[0.99]",
        "disabled:cursor-not-allowed disabled:opacity-70"
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {label}
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}
