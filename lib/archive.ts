import type { SupabaseClient } from "@supabase/supabase-js";
import type { FileRow, FolderRow } from "@/lib/types";
import { sanitizeName } from "@/lib/utils";

const BUCKET = "archive";

export async function listFolders(
  supabase: SupabaseClient,
  parentId: string | null
): Promise<FolderRow[]> {
  const query = supabase.from("folders").select("*").order("name", { ascending: true });
  const { data, error } = parentId
    ? await query.eq("parent_id", parentId)
    : await query.is("parent_id", null);
  if (error) throw error;
  return data as FolderRow[];
}

export async function listFiles(
  supabase: SupabaseClient,
  folderId: string | null
): Promise<FileRow[]> {
  const query = supabase.from("files").select("*").order("name", { ascending: true });
  const { data, error } = folderId
    ? await query.eq("folder_id", folderId)
    : await query.is("folder_id", null);
  if (error) throw error;
  return data as FileRow[];
}

export async function getFolder(
  supabase: SupabaseClient,
  id: string
): Promise<FolderRow | null> {
  const { data, error } = await supabase.from("folders").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as FolderRow | null;
}

// Dulu fungsi ini memanggil getFolder() satu per satu sambil naik ke folder
// induk (N round-trip ke database untuk folder yang dalam nested-nya).
// Sekarang cukup satu query untuk ambil semua folder (id, nama, parent_id),
// lalu susun path-nya di memori — jauh lebih cepat, terutama untuk folder
// yang bersarang dalam.
export async function getFolderPath(
  supabase: SupabaseClient,
  folderId: string | null
): Promise<FolderRow[]> {
  if (!folderId) return [];

  const { data, error } = await supabase.from("folders").select("*");
  if (error) throw error;

  const byId = new Map<string, FolderRow>((data as FolderRow[]).map((f) => [f.id, f]));

  const path: FolderRow[] = [];
  let currentId: string | null = folderId;
  let guard = 0;
  while (currentId && guard < 50) {
    const folder = byId.get(currentId);
    if (!folder) break;
    path.unshift(folder);
    currentId = folder.parent_id;
    guard++;
  }
  return path;
}

export async function createFolder(
  supabase: SupabaseClient,
  name: string,
  parentId: string | null,
  userId: string
): Promise<FolderRow> {
  const { data, error } = await supabase
    .from("folders")
    .insert({ name: sanitizeName(name), parent_id: parentId, created_by: userId })
    .select()
    .single();
  if (error) throw error;
  return data as FolderRow;
}

export async function renameFolder(supabase: SupabaseClient, id: string, name: string) {
  const { error } = await supabase
    .from("folders")
    .update({ name: sanitizeName(name), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function renameFile(supabase: SupabaseClient, id: string, name: string) {
  const { error } = await supabase
    .from("files")
    .update({ name: sanitizeName(name), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteFile(supabase: SupabaseClient, file: FileRow) {
  const { error: storageError } = await supabase.storage.from(BUCKET).remove([file.storage_path]);
  if (storageError) throw storageError;
  const { error } = await supabase.from("files").delete().eq("id", file.id);
  if (error) throw error;
}

// Recursively deletes a folder: gathers every descendant folder + file first,
// removes the underlying storage objects, then deletes the top folder row
// (the DB foreign keys cascade the rest).
export async function deleteFolderDeep(supabase: SupabaseClient, folderId: string) {
  const folderIds = [folderId];
  let frontier = [folderId];

  while (frontier.length > 0) {
    const { data, error } = await supabase
      .from("folders")
      .select("id")
      .in("parent_id", frontier);
    if (error) throw error;
    const nextIds = (data as { id: string }[]).map((f) => f.id);
    if (nextIds.length === 0) break;
    folderIds.push(...nextIds);
    frontier = nextIds;
  }

  const { data: filesInTree, error: filesError } = await supabase
    .from("files")
    .select("storage_path")
    .in("folder_id", folderIds);
  if (filesError) throw filesError;

  const paths = (filesInTree as { storage_path: string }[]).map((f) => f.storage_path);
  if (paths.length > 0) {
    const { error: removeError } = await supabase.storage.from(BUCKET).remove(paths);
    if (removeError) throw removeError;
  }

  const { error: deleteError } = await supabase.from("folders").delete().eq("id", folderId);
  if (deleteError) throw deleteError;
}

export async function uploadFile(
  supabase: SupabaseClient,
  file: File,
  folderId: string | null,
  userId: string
): Promise<FileRow> {
  const id = crypto.randomUUID();
  const storagePath = `${userId}/${id}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("files")
    .insert({
      id,
      name: sanitizeName(file.name),
      folder_id: folderId,
      storage_path: storagePath,
      size: file.size,
      mime_type: file.type || null,
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
    throw error;
  }
  return data as FileRow;
}

export async function downloadFileBlob(supabase: SupabaseClient, file: FileRow): Promise<Blob> {
  const { data, error } = await supabase.storage.from(BUCKET).download(file.storage_path);
  if (error) throw error;
  return data;
}

// Untuk preview/unduh, signed URL jauh lebih cepat daripada download() di atas:
// browser bisa langsung streaming dari server Supabase (mendukung partial
// content untuk PDF/video besar), tanpa harus menunggu seluruh file selesai
// diunduh ke memori dulu sebelum bisa ditampilkan.
export async function getSignedUrl(
  supabase: SupabaseClient,
  file: FileRow,
  expiresInSeconds = 300
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(file.storage_path, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}

export async function searchArchive(
  supabase: SupabaseClient,
  query: string
): Promise<{ folders: FolderRow[]; files: FileRow[] }> {
  const like = `%${query}%`;
  const [foldersRes, filesRes] = await Promise.all([
    supabase.from("folders").select("*").ilike("name", like).order("name"),
    supabase.from("files").select("*").ilike("name", like).order("name"),
  ]);
  if (foldersRes.error) throw foldersRes.error;
  if (filesRes.error) throw filesRes.error;
  return {
    folders: foldersRes.data as FolderRow[],
    files: filesRes.data as FileRow[],
  };
}
