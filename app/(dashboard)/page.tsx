'use client'

import { useState, useEffect } from 'react'
import { X, FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { DataTable } from '@/components/data-table'
import { columns } from '@/components/columns'
import { useToast } from '@/components/ui/use-toast'
import { ViewToggle } from '@/components/view-toggle'
import { FileGrid } from '@/components/file-grid'
import { UploadDropzone } from '@/components/upload-dropzone'
import { PageDropzone } from '@/components/page-dropzone'
import { DroppableFolder } from '@/components/draggable-folder'
import { FileDetailActions } from '@/components/file-detail-actions'
import { CreateFolderDialog } from '@/components/create-folder-dialog'
import { useFiles, type FileData, type FolderData } from '@/lib/files'

export default function FileDashboard() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('list')
  const { toast } = useToast()
  const {
    files,
    folders,
    isLoading,
    fetchFiles,
    fetchFolders,
    uploadFile: uploadFileToApi,
    moveFileToFolder
  } = useFiles()

  useEffect(() => {
    fetchFiles()
    fetchFolders()
  }, [fetchFiles, fetchFolders])

  const handleFileClick = (file: FileData) => {
    setSelectedFile(file)
    setIsOpen(true)
  }

  const handleEditFile = (editedFile: FileData) => {
    // In a real implementation, you would update the file in the API
    toast({
      title: 'File updated',
      description: `Successfully updated ${editedFile.name}`
    })
  }

  const handleDeleteFile = (id: string) => {
    // In a real implementation, you would delete the file from the API
    toast({
      title: 'File deleted',
      description: 'The file has been permanently deleted.',
      variant: 'destructive'
    })
  }

  const processFiles = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Create initial toast and store its ID
      const { id, update } = toast({
        title: 'Uploading files',
        description: `Uploading ${file.name}...`
      })

      try {
        await uploadFileToApi(file)

        // Update the toast on success
        update({
          title: 'Success',
          description: `Successfully uploaded ${file.name}`
        })
      } catch (error) {
        // Update the toast on error
        update({
          title: 'Error',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive'
        })
      }
    }
  }

  const handleFolderDrop = async (data: any, targetFolder: FolderData) => {
    if (data.type === 'file') {
      try {
        await moveFileToFolder(data.id, targetFolder.id)

        toast({
          title: 'File moved',
          description: (
            <span>
              Moved <strong>{data.name}</strong> to <strong>{targetFolder.name}</strong>
            </span>
          )
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to move file to folder',
          variant: 'destructive'
        })
      }
    }
  }

  return (
    <PageDropzone onFilesDropped={processFiles}>
      <div className="min-h-screen bg-background">
        <div className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold">Files</h1>
                <p className="text-sm text-muted-foreground">Upload, view and manage your files</p>
              </div>
              <div className="flex items-center gap-2">
                <CreateFolderDialog />
              </div>
            </div>

            {/* Upload Area */}
            <UploadDropzone
              onFilesUploaded={newFiles => {
                // Files will be uploaded directly via the component
              }}
            />

            {/* Folders */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Folders</h2>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 rounded-lg bg-muted animate-pulse"></div>
                  ))}
                </div>
              ) : folders.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {folders.map(folder => (
                    <DroppableFolder key={folder.id} folder={folder} onDrop={handleFolderDrop} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border rounded-lg bg-muted/30">
                  <p className="text-muted-foreground">No folders found. Create a folder to organize your files.</p>
                </div>
              )}
            </div>

            {/* Recent Files */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Files</h2>
                <ViewToggle view={view} onViewChange={setView} />
              </div>

              <div className="rounded-lg">
                {isLoading ? (
                  <div className="border rounded-lg p-8">
                    <div className="h-8 w-full bg-muted animate-pulse mb-4"></div>
                    <div className="h-8 w-full bg-muted animate-pulse mb-4"></div>
                    <div className="h-8 w-full bg-muted animate-pulse"></div>
                  </div>
                ) : files.length > 0 ? (
                  view === 'list' ? (
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
                      toast={toast}
                    />
                  )
                ) : (
                  <div className="text-center p-8 border rounded-lg bg-muted/30">
                    <p className="text-muted-foreground">No files found. Upload files to get started.</p>
                  </div>
                )}
              </div>
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
