/*

*/

export interface FileEntry {
  name: string;
  fullPath: string;
  size: number;
  extension: string | null;
  isDirectory: boolean;
  createdAt: Date;
  permissions: string;
}