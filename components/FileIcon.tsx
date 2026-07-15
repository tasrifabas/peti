import {
  FileImage,
  FileText,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  File as FileGeneric,
} from "lucide-react";
import type { FileKind } from "@/lib/utils";

const ICONS: Record<FileKind, typeof FileGeneric> = {
  image: FileImage,
  pdf: FileText,
  video: FileVideo,
  audio: FileAudio,
  archive: FileArchive,
  spreadsheet: FileSpreadsheet,
  document: FileText,
  text: FileText,
  other: FileGeneric,
};

export function FileIcon({ kind, className }: { kind: FileKind; className?: string }) {
  const Icon = ICONS[kind];
  return <Icon className={className} strokeWidth={1.8} />;
}
