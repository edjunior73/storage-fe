// API base URL
const API_BASE_URL = 'https://d782-179-117-20-89.ngrok-free.app'

// Types based on the API schema
export interface User {
  id: string
  createdAt: string
  updatedAt: string
  email: string
  refreshToken: string
}

export interface UserLogin {
  token: string
  refreshToken: string
  user: User
}

export interface LoginDto {
  email: string
  password: string
}

export interface RefreshTokenDto {
  refreshToken: string
}

export interface Document {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  description?: string
  latestVersionId: string
  userId: string
  folderId?: string
  latestFile?: {
    id: string
    path: string
    userId: string
    documentId: string
    createdAt: string
    updatedAt: string
  }
}

export interface Folder {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  userId: string
  user?: User
  documents?: Document[]
}

export interface UploadFileDto {
  documentId?: string
  document?: any
  folderId?: string
}

export interface CreatedFile {
  id: string
  path: string
  userId: string
  documentId: string
  createdAt: string
  updatedAt: string
}

export interface FileUploadResponse {
  presignedUrl: string
  createdFile: CreatedFile
}

// Helper function for API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}, isJson = true): Promise<T> {
  const token = localStorage.getItem('token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {})
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'An error occurred')
  }

  return isJson ? response.json() : response.text()
}

// Auth API functions
export async function login(credentials: LoginDto): Promise<UserLogin> {
  const data = await apiRequest<UserLogin>('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })

  // Store tokens in localStorage
  localStorage.setItem('token', data.token)
  localStorage.setItem('refreshToken', data.refreshToken)

  return data
}

export async function refreshToken(refreshTokenData: RefreshTokenDto): Promise<UserLogin> {
  const data = await apiRequest<UserLogin>('/users/refresh-token', {
    method: 'POST',
    body: JSON.stringify(refreshTokenData)
  })

  // Update tokens in localStorage
  localStorage.setItem('token', data.token)
  localStorage.setItem('refreshToken', data.refreshToken)

  return data
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>('/users/me')
}

export async function logout(): Promise<void> {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
}

// Files API functions
export async function getDocuments(): Promise<Document[]> {
  return apiRequest<Document[]>('/documents')
}

export async function uploadFile(fileData: UploadFileDto): Promise<FileUploadResponse> {
  return apiRequest<FileUploadResponse>('/files', {
    method: 'POST',
    body: JSON.stringify(fileData)
  })
}

export async function deleteFile(fileId: string): Promise<void> {
  return apiRequest<void>(`/files/${fileId}`, {
    method: 'DELETE'
  })
}

export async function getObjectUrl(objectName: string): Promise<string> {
  return apiRequest<string>(`/objects/${objectName}`)
}

export async function getFileById(fileId: string): Promise<string> {
  return apiRequest<string>(`/files/${fileId}`, {}, false)
}

// Folders API functions
export async function getFolders(): Promise<Folder[]> {
  return apiRequest<Folder[]>('/folders')
}

export async function getFolderById(folderId: string): Promise<Folder> {
  const folders = await getFolders()
  const folder = folders.find(folder => folder.id === folderId)
  if (!folder) {
    throw new Error('Folder not found')
  }
  return folder
}

export async function createFolder(title: string): Promise<Folder> {
  return apiRequest<Folder>('/folders', {
    method: 'POST',
    body: JSON.stringify({ title })
  })
}

export async function addDocumentToFolder(folderId: string, documentId: string): Promise<Folder> {
  return apiRequest<Folder>(`/folders/${folderId}/${documentId}`, {
    method: 'PUT'
  })
}

export async function removeDocumentFromFolder(folderId: string, documentId: string): Promise<boolean> {
  return apiRequest<boolean>(`/folders/${folderId}/${documentId}`, {
    method: 'DELETE'
  })
}
