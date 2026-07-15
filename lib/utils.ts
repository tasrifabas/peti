import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// A small, curated set of gradient pairs drawn from the Peti palette.
// Deterministically picked per item name so the archive stays colorful
// but cohesive rather than randomly rainbow.
const GRADIENTS = [
  "from-coral to-sun",
  "from-violet to-blue",
  "from-mint to-blue",
  "from-sun to-coral",
  "from-blue to-violet",
  "from-mint to-sun",
];

export function gradientForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

export type FileKind =
  | "image"
  | "pdf"
  | "video"
  | "audio"
  | "archive"
  | "spreadsheet"
  | "document"
  | "text"
  | "other";

export function fileKind(mime: string | null | undefined, name: string): FileKind {
  const m = mime ?? "";
  const ext = name.split(".").pop()?.toLowerCase() ?? "";

  if (m.startsWith("image/")) return "image";
  if (m === "application/pdf" || ext === "pdf") return "pdf";
  if (m.startsWith("video/")) return "video";
  if (m.startsWith("audio/")) return "audio";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  if (["xls", "xlsx", "csv"].includes(ext)) return "spreadsheet";
  if (["doc", "docx"].includes(ext) || m.includes("word")) return "document";
  if (["txt", "md", "json"].includes(ext) || m.startsWith("text/")) return "text";
  return "other";
}

const KIND_ACCENT: Record<FileKind, string> = {
  image: "text-coral",
  pdf: "text-violet",
  video: "text-blue",
  audio: "text-mint",
  archive: "text-sun",
  spreadsheet: "text-mint",
  document: "text-blue",
  text: "text-ink-soft",
  other: "text-ink-soft",
};

export function accentForKind(kind: FileKind): string {
  return KIND_ACCENT[kind];
}

export function sanitizeName(name: string): string {
  return name.trim().replace(/[/\\]/g, "-");
}
