'use client'
import React from 'react'
import { X, FileIcon, ChevronRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { DataTable } from '@/components/data-table'
import { columns, type FileData } from '@/components/columns'
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
import { getFolders, getDocuments } from '@/lib/api'
import { cookies } from 'next/headers'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface FolderPageClientProps {
  files: FileData[]
  subfolders: { id: string; name: string; path: string }[]
  breadcrumbs: { name: string; path: string }[]
  currentFolderId: string
}

export function FolderPageContent({ files, subfolders, breadcrumbs, currentFolderId }: FolderPageClientProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('list')

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

  const handleDeleteFile = (id: string) => {
    // In a real app, you would delete the file from your database
    toast({
      title: 'File deleted',
      description: 'The file has been permanently deleted.',
      variant: 'destructive'
    })
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
      toast({
        title: 'File moved',
        description: (
          <span>
            Moved <strong>{data.name}</strong> to <strong>{targetFolder.name}</strong>
          </span>
        )
      })
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

  return (
    <PageDropzone onFilesDropped={processFiles}>
      <div className="min-h-screen bg-background">
        <div className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Button className="h-8 w-8" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                      <BreadcrumbItem>
                        {index === breadcrumbs.length - 1 ? (
                          <span className="font-medium">{crumb.name}</span>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={crumb.path}>{crumb.name}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
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
                // Files will be uploaded directly via the component
              }}
            />

            {/* Subfolders */}
            {subfolders.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Folders</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {subfolders.map(folder => (
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

              {files.length > 0 ? (
                <div className="rounded-lg">
                  {view === 'list' ? (
                    <div className="border rounded-lg">
                      <DataTable
                        columns={columns(handleEditFile, handleDeleteFile, toast)}
                        data={files}
                        onRowClick={handleFileClick}
                      />
                    </div>
                  ) : (
                    <FileGrid
                      files={files}
                      onFileClick={handleFileClick}
                      onEdit={handleEditFile}
                      onDelete={handleDeleteFile}
                      onFileDragStart={file => {
                        // This is just for visual feedback, actual drag handling is in DraggableFile
                        toast({
                          title: 'Dragging file',
                          description: `Drag ${file.name} to a folder to move it`
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
                <Button className="h-8 w-8" onClick={() => setIsOpen(false)}>
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
