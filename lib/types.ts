export type FolderRow = {
  id: string;
  name: string;
  parent_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type FileRow = {
  id: string;
  name: string;
  folder_id: string | null;
  storage_path: string;
  size: number;
  mime_type: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type ArchiveItem =
  | { kind: "folder"; data: FolderRow }
  | { kind: "file"; data: FileRow };
