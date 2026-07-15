"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound, Mail, ArrowRight, Loader2, Box } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Mode = "signin" | "invite";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=invite") || hash.includes("type=recovery")) {
      setMode("invite");
    }
  }, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email atau kata sandi salah. Coba lagi.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
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

        {mode === "signin" ? (
          <>
            <h1 className="mb-1 font-display text-2xl font-semibold text-ink">Masuk</h1>
            <p className="mb-6 text-sm text-ink-soft">
              Khusus untuk orang yang sudah diundang ke Peti.
            </p>
            <form onSubmit={handleSignIn} className="space-y-4">
              <Field icon={<Mail className="h-4 w-4" />}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
                />
              </Field>
              <Field icon={<KeyRound className="h-4 w-4" />}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata sandi"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
                />
              </Field>
              {error && <p className="text-sm text-coral">{error}</p>}
              <SubmitButton loading={loading} label="Masuk" />
            </form>
          </>
        ) : (
          <>
            <h1 className="mb-1 font-display text-2xl font-semibold text-ink">
              Buat kata sandi
            </h1>
            <p className="mb-6 text-sm text-ink-soft">
              Selamat datang! Buat kata sandi untuk akunmu di Peti.
            </p>
            <form onSubmit={handleSetPassword} className="space-y-4">
              <Field icon={<KeyRound className="h-4 w-4" />}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata sandi baru"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
                />
              </Field>
              <Field icon={<KeyRound className="h-4 w-4" />}>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
                />
              </Field>
              {error && <p className="text-sm text-coral">{error}</p>}
              <SubmitButton loading={loading} label="Simpan & masuk" />
            </form>
          </>
        )}
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
