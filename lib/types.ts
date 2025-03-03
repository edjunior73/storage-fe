export interface FileData {
  id: string
  name: string
  date: string
  size: string
  location: string
  url?: string
  path?: string
  documentId?: string
}

export interface FolderData {
  id: string
  name: string
  count: number
  files?: FileData[]
}
