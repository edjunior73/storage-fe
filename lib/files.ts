import { create } from 'zustand'
import {
  getDocuments,
  uploadFile,
  getFolders,
  createFolder,
  addDocumentToFolder,
  removeDocumentFromFolder,
  deleteFile
} from './api'
import { FileData, FolderData } from './types'

// Re-export the types
export type { FileData, FolderData }

interface FilesState {
  files: FileData[]
  folders: FolderData[]
  isLoading: boolean
  error: string | null
  fetchFiles: (args?: { silent?: boolean }) => Promise<void>
  fetchFolders: (args?: { silent?: boolean }) => Promise<void>
  uploadFile: (file: File, folderId?: string) => Promise<void>
  createFolder: (name: string) => Promise<void>
  moveFileToFolder: (fileId: string, folderId: string) => Promise<void>
  removeFileFromFolder: (fileId: string, folderId: string) => Promise<void>
  deleteFile: (fileId: string) => Promise<void>
}

export const useFiles = create<FilesState>((set, get) => ({
  files: [],
  folders: [],
  isLoading: false,
  error: null,

  fetchFiles: async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!silent) set({ isLoading: true, error: null })
    try {
      const documents = await getDocuments()

      // Convert documents to file data
      const files: FileData[] = documents.map(doc => {
        return {
          id: doc.latestVersionId,
          name: doc.title,
          date: new Date(doc.updatedAt).toLocaleDateString(),
          size: 'Unknown', // Size information not available from API
          location: doc.folderId ? 'Folder' : 'Home',
          url: doc.latestFile?.path,
          path: doc.latestFile?.path,
          documentId: doc.id
        }
      })

      set({ files, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch files'
      })
    }
  },

  fetchFolders: async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!silent) set({ isLoading: true, error: null })
    try {
      const foldersData = await getFolders()

      // Convert API folders to app folder format
      const folders: FolderData[] = foldersData.map(folder => ({
        id: folder.id,
        name: folder.title,
        count: folder.documents?.length || 0,
        files: folder.documents?.map(doc => ({
          id: doc.id,
          name: doc.title,
          date: new Date(doc.updatedAt).toLocaleDateString(),
          size: 'Unknown', // Size information not available from API
          location: `Folders > ${folder.title}`
        }))
      }))

      set({ folders, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch folders'
      })
    }
  },

  uploadFile: async (file: File, folderId?: string) => {
    // set({ isLoading: true, error: null })
    try {
      // Prepare the file data for the API
      const fileData = {
        document: {
          title: file.name,
          description: `Uploaded on ${new Date().toLocaleString()}`
        },
        title: file.name,
        folderId
      }

      // Get the presigned URL and file metadata from the API
      const response = await uploadFile(fileData)

      // Use the presigned URL to upload the file directly
      // Using fetch instead of axios to have more control over the request
      const uploadResponse = await fetch(response.presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to storage')
      }

      // Refresh files and folders after upload
      await get().fetchFiles({ silent: true })
      await get().fetchFolders({ silent: true })

      set({ isLoading: false })
    } catch (error) {
      console.error('Upload error:', error)
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to upload file'
      })
    }
  },

  createFolder: async (name: string) => {
    try {
      await createFolder(name)

      // Refresh folders after creation
      await get().fetchFolders({ silent: true })

      set({ isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create folder'
      })
    }
  },

  moveFileToFolder: async (fileId: string, folderId: string) => {
    // set({ isLoading: true, error: null })
    try {
      await addDocumentToFolder(folderId, fileId)

      // Refresh files and folders after move
      await get().fetchFiles({ silent: true })
      await get().fetchFolders({ silent: true })

      set({ isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to move file'
      })
    }
  },

  removeFileFromFolder: async (fileId: string, folderId: string) => {
    set({ isLoading: true, error: null })
    try {
      await removeDocumentFromFolder(folderId, fileId)

      // Refresh files and folders after removal
      await get().fetchFiles({ silent: true })
      await get().fetchFolders({ silent: true })

      set({ isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to remove file from folder'
      })
    }
  },

  deleteFile: async (fileId: string) => {
    set({ isLoading: true, error: null })
    try {
      // Try to use the server-side API route first
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        // If server-side route fails, try direct API call as fallback
        await deleteFile(fileId)
      }

      // Refresh files and folders after deletion
      await get().fetchFiles()
      await get().fetchFolders()

      set({ isLoading: false })
    } catch (error) {
      console.error('Delete file error:', error)
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete file'
      })
    }
  }
}))
