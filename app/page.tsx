"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { FileRow, FolderRow } from "@/lib/types";
import * as archive from "@/lib/archive";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import FileGrid from "@/components/FileGrid";
import NamePromptModal from "@/components/NamePromptModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import PreviewModal from "@/components/PreviewModal";
import ToastStack, { type Toast } from "@/components/ToastStack";
import DropzoneArea from "@/components/DropzoneArea";
import { Loader2 } from "lucide-react";

type RenameTarget = { kind: "folder" | "file"; item: FolderRow | FileRow } | null;
type DeleteTarget = { kind: "folder" | "file"; item: FolderRow | FileRow } | null;

function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFolderId = searchParams.get("folder");

  const supabase = useMemo(() => createClient(), []);
  const blobCache = useRef<Map<string, string>>(new Map());

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [folderPath, setFolderPath] = useState<FolderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<{ folders: FolderRow[]; files: FileRow[] } | null>(
    null
  );

  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<RenameTarget>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [previewFile, setPreviewFile] = useState<FileRow | null>(null);
  const [uploadingCount, setUploadingCount] = useState(0);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
      setUserId(data.user?.id ?? null);
    });
  }, [supabase]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [f, fl, path] = await Promise.all([
        archive.listFolders(supabase, currentFolderId),
        archive.listFiles(supabase, currentFolderId),
        archive.getFolderPath(supabase, currentFolderId),
      ]);
      setFolders(f);
      setFiles(fl);
      setFolderPath(path);
    } catch (err: any) {
      pushToast(err?.message ?? "Gagal memuat arsip.", "error");
    } finally {
      setLoading(false);
    }
  }, [supabase, currentFolderId, pushToast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Debounced global search
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults(null);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        const results = await archive.searchArchive(supabase, search.trim());
        setSearchResults(results);
      } catch (err: any) {
        pushToast(err?.message ?? "Pencarian gagal.", "error");
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [search, supabase, pushToast]);

  function navigate(folderId: string | null) {
    setSearch("");
    if (folderId) router.push(`/?folder=${folderId}`);
    else router.push("/");
  }

  async function handleCreateFolder(name: string) {
    if (!userId) return;
    await archive.createFolder(supabase, name, currentFolderId, userId);
    pushToast(`Folder "${name}" dibuat.`);
    refresh();
  }

  async function handleRenameSubmit(name: string) {
    if (!renameTarget) return;
    if (renameTarget.kind === "folder") {
      await archive.renameFolder(supabase, renameTarget.item.id, name);
    } else {
      await archive.renameFile(supabase, renameTarget.item.id, name);
    }
    pushToast("Nama berhasil diubah.");
    refresh();
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    if (deleteTarget.kind === "folder") {
      await archive.deleteFolderDeep(supabase, deleteTarget.item.id);
    } else {
      await archive.deleteFile(supabase, deleteTarget.item as FileRow);
    }
    pushToast("Berhasil dihapus.");
    refresh();
    if (search.trim()) {
      const results = await archive.searchArchive(supabase, search.trim());
      setSearchResults(results);
    }
  }

  async function handleFiles(fileList: FileList) {
    if (!userId) return;
    const filesArr = Array.from(fileList);
    setUploadingCount((c) => c + filesArr.length);
    let successCount = 0;
    for (const file of filesArr) {
      try {
        await archive.uploadFile(supabase, file, currentFolderId, userId);
        successCount++;
      } catch (err: any) {
        pushToast(`Gagal mengunggah "${file.name}": ${err?.message ?? "coba lagi"}`, "error");
      } finally {
        setUploadingCount((c) => c - 1);
      }
    }
    if (successCount > 0) {
      pushToast(
        successCount === 1 ? "1 file berhasil diunggah." : `${successCount} file berhasil diunggah.`
      );
      refresh();
    }
  }

  async function handleDownload(file: FileRow) {
    try {
      const blob = await archive.downloadFileBlob(supabase, file);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err: any) {
      pushToast(err?.message ?? "Gagal mengunduh file.", "error");
    }
  }

  const getBlobUrl = useCallback(
    async (file: FileRow) => {
      const cached = blobCache.current.get(file.id);
      if (cached) return cached;
      const blob = await archive.downloadFileBlob(supabase, file);
      const url = URL.createObjectURL(blob);
      blobCache.current.set(file.id, url);
      return url;
    },
    [supabase]
  );

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const isSearching = search.trim().length > 0;
  const displayedFolders = isSearching ? searchResults?.folders ?? [] : folders;
  const displayedFiles = isSearching ? searchResults?.files ?? [] : files;

  return (
    <DropzoneArea onFiles={handleFiles}>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar
          email={userEmail}
          atRoot={!currentFolderId}
          onGoRoot={() => navigate(null)}
          onLogout={handleLogout}
        />

        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
          <TopBar
            path={isSearching ? [] : folderPath}
            onNavigate={navigate}
            search={search}
            onSearchChange={setSearch}
            onCreateFolder={() => setCreateFolderOpen(true)}
            onFiles={handleFiles}
          />

          {uploadingCount > 0 && (
            <div className="mb-4 flex items-center gap-2 rounded-xl2 border border-line bg-surface px-4 py-2.5 text-sm text-ink-soft animate-fade-up">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-violet" />
              Mengunggah {uploadingCount} file...
            </div>
          )}

          {isSearching && (
            <p className="mb-4 text-sm text-ink-soft">
              Hasil pencarian untuk <span className="font-medium text-ink">"{search}"</span>
            </p>
          )}

          {loading && !isSearching ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton h-[70px] rounded-xl2" />
              ))}
            </div>
          ) : (
            <FileGrid
              folders={displayedFolders}
              files={displayedFiles}
              onOpenFolder={(f) => navigate(f.id)}
              onOpenFile={(f) => setPreviewFile(f)}
              onDownloadFile={handleDownload}
              onRenameFolder={(f) => setRenameTarget({ kind: "folder", item: f })}
              onRenameFile={(f) => setRenameTarget({ kind: "file", item: f })}
              onDeleteFolder={(f) => setDeleteTarget({ kind: "folder", item: f })}
              onDeleteFile={(f) => setDeleteTarget({ kind: "file", item: f })}
              emptyLabel={isSearching ? "Tidak ada hasil ditemukan" : undefined}
            />
          )}
        </main>
      </div>

      <NamePromptModal
        open={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        title="Folder baru"
        label="Nama folder"
        confirmLabel="Buat folder"
        onSubmit={handleCreateFolder}
      />

      <NamePromptModal
        open={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        title={renameTarget?.kind === "folder" ? "Ganti nama folder" : "Ganti nama file"}
        label="Nama baru"
        initialValue={renameTarget?.item.name ?? ""}
        confirmLabel="Simpan"
        onSubmit={handleRenameSubmit}
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        itemName={deleteTarget?.item.name ?? ""}
        isFolder={deleteTarget?.kind === "folder"}
        onConfirm={handleDeleteConfirm}
      />

      <PreviewModal
        open={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
        getBlobUrl={getBlobUrl}
        onDownload={handleDownload}
      />

      <ToastStack toasts={toasts} />
    </DropzoneArea>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-violet" />
        </div>
      }
    >
      <DashboardInner />
    </Suspense>
  );
}
