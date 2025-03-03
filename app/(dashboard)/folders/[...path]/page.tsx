'use client'

import React from 'react'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { X, FileIcon, ChevronRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { DataTable } from '@/components/data-table'
import { columns, type FileData } from '@/components/columns'
import { useToast } from '@/components/ui/use-toast'
import { ViewToggle } from '@/components/view-toggle'
import { FileGrid } from '@/components/file-grid'
import { UploadDropzone } from '@/components/upload-dropzone'
import { PageDropzone } from '@/components/page-dropzone'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { DroppableFolder } from '@/components/draggable-folder'
import { FileDetailActions } from '@/components/file-detail-actions'
import Link from 'next/link'
import { deleteFile, getFolderById } from '@/lib/api'

export default function FolderPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('list')
  const [folderData, setFolderData] = useState<{
    files: FileData[]
    subfolders: { id: string; name: string; path: string }[]
    breadcrumbs: { name: string; path: string }[]
    currentPath: string
  } | null>(null)

  const path = Array.isArray(params.path) ? params.path : [params.path as string]
  const currentFolderId = path[path.length - 1]

  async function getFolder() {
    const folder = await getFolderById(currentFolderId)
    setFolderData({
      files: (folder.documents || []).map(doc => ({
        id: doc.latestVersionId,
        name: doc.title,
        date: doc.createdAt,
        size: '0 Bytes',
        location: folder.title
      })),
      subfolders: [],
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: folder.title, path: `/folders/${folder.id}` }
      ],
      currentPath: folder.title
    })
    setIsLoading(false)
  }

  useEffect(() => {
    getFolder()
  }, [path])

  const handleFileClick = (file: FileData) => {
    setSelectedFile(file)
    setIsOpen(true)
  }

  const handleEditFile = (editedFile: FileData) => {
    // In a real app, you would update the file in your database
    toast({
      title: 'File updated',
      description: `Successfully updated ${editedFile.name}`
    })
  }

  const handleDeleteFile = async (id: string) => {
    await deleteFile(id)

    await getFolder()

    // In a real app, you would delete the file from your database
    toast({
      title: 'File deleted',
      description: 'The file has been permanently deleted.',
      variant: 'destructive'
    })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const processFiles = async (files: FileList) => {
    // In a real app, you would upload the files to your server
    toast({
      title: 'Success',
      description: `Successfully uploaded ${files.length} file${files.length === 1 ? '' : 's'}`
    })
  }

  const handleFolderDrop = (data: any, targetFolder: any) => {
    if (data.type === 'file') {
      // Handle file drop into folder
      if (folderData && folderData.files) {
        // Remove the file from the current folder's files
        setFolderData({
          ...folderData,
          files: folderData.files.filter(file => file.id !== data.id)
        })

        toast({
          title: 'File moved',
          description: (
            <span>
              Moved <strong>{data.name}</strong> to <strong>{targetFolder.name}</strong>
            </span>
          )
        })
      }
      // In a real app, you would update your file location in the database
    } else if (data.type === 'folder') {
      // Prevent moving a folder into itself or its children
      if (targetFolder.path && targetFolder.path.startsWith(data.path)) {
        toast({
          title: 'Cannot move folder',
          description: 'Cannot move a folder into itself or its children',
          variant: 'destructive'
        })
        return
      }

      toast({
        title: 'Folder moved',
        description: (
          <span>
            Moved <strong>{data.name}</strong> to <strong>{targetFolder.name}</strong>
          </span>
        )
      })
      // In a real app, you would update your folder structure in the database
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col gap-4">
        <div className="h-8 w-40 bg-gray-200 animate-pulse rounded-md" />
        <div className="h-24 w-full bg-gray-200 animate-pulse rounded-md" />
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-md" />
          ))}
        </div>
        <div className="h-64 w-full bg-gray-200 animate-pulse rounded-md mt-4" />
      </div>
    )
  }

  if (!folderData) {
    return <div className="p-6">Folder not found</div>
  }

  return (
    <PageDropzone onFilesDropped={processFiles}>
      <div className="min-h-screen bg-background">
        <div className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.back()} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <Breadcrumb>
                <BreadcrumbList>
                  {folderData.breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                      <BreadcrumbItem>
                        {index === folderData.breadcrumbs.length - 1 ? (
                          <span className="font-medium">{crumb.name}</span>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={crumb.path}>{crumb.name}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < folderData.breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator>
                          <ChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Upload Area */}
            <UploadDropzone
              folderId={currentFolderId}
              onFilesUploaded={newFiles => {
                getFolder()
              }}
            />

            {/* Subfolders */}
            {folderData.subfolders.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Folders</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {folderData.subfolders.map(folder => (
                    <DroppableFolder key={folder.id} folder={folder} onDrop={handleFolderDrop} />
                  ))}
                </div>
              </div>
            )}

            {/* Files */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Files</h2>
                <ViewToggle view={view} onViewChange={setView} />
              </div>

              {folderData.files.length > 0 ? (
                <div className="rounded-lg">
                  {view === 'list' ? (
                    <div className="border rounded-lg">
                      <DataTable
                        columns={columns(handleEditFile, handleDeleteFile, toast)}
                        data={folderData.files}
                        onRowClick={handleFileClick}
                      />
                    </div>
                  ) : (
                    <FileGrid
                      files={folderData.files}
                      onFileClick={handleFileClick}
                      onEdit={handleEditFile}
                      onDelete={handleDeleteFile}
                      onFileDragStart={file => {
                        // This is just for visual feedback, actual drag handling is in DraggableFile
                        toast({
                          title: 'Dragging file',
                          description: `Drag ${file.name} to a folder to move it`,
                          duration: 2000
                        })
                      }}
                      toast={toast}
                    />
                  )}
                </div>
              ) : (
                <div className="text-center p-8 border rounded-lg bg-muted/30">
                  <p className="text-muted-foreground">No files in this folder</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* File Details Sheet */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent className="w-full sm:w-[540px] p-0">
            <div className="flex flex-col h-full">
              <SheetHeader className="p-6 flex flex-row items-center justify-between border-b">
                <SheetTitle>File Details</SheetTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </SheetHeader>

              {selectedFile && (
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center mb-4">
                      <FileIcon className="w-6 h-6 text-red-500" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Location</h3>
                      <p className="text-sm text-muted-foreground">{selectedFile.location}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">File Name</h3>
                      <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Date Uploaded</h3>
                      <p className="text-sm text-muted-foreground">{selectedFile.date}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">File size</h3>
                      <p className="text-sm text-muted-foreground">{selectedFile.size}</p>
                    </div>
                  </div>

                  <FileDetailActions file={selectedFile} toast={toast} />
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </PageDropzone>
  )
}
