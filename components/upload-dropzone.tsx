'use client'

import * as React from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFiles } from '@/lib/files'
import { useToast } from '@/components/ui/use-toast'

interface UploadDropzoneProps {
  onFilesUploaded: (newFiles: Array<{ id: string; name: string; size: string; date: string; location: string }>) => void
  folderId?: string
}

export function UploadDropzone({ onFilesUploaded, folderId }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const { uploadFile } = useFiles()
  const { toast } = useToast()

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const formatFileSize = React.useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }, [])

  const processFiles = React.useCallback(
    async (files: FileList) => {
      const newFiles = Array.from(files).map(file => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: formatFileSize(file.size),
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        location: folderId ? 'Folder' : 'Local > Uploads'
      }))

      // Call onFilesUploaded to update UI immediately

      // Process each file with the API
      for (const file of files) {
        try {
          // Show upload toast
          const { id, update } = toast({
            title: 'Uploading file',
            description: `Uploading ${file.name}...`
          })

          // Upload the file to the API
          await uploadFile(file, folderId)

          // Update toast on success
          update({
            id,
            title: 'Success',
            description: `Successfully uploaded ${file.name}`
          })
        } catch (error) {
          // Show error toast
          toast({
            variant: 'destructive',
            title: 'Error',
            description: `Failed to upload ${file.name}`
          })
        }
      }

      onFilesUploaded(newFiles)
    },
    [formatFileSize, onFilesUploaded, uploadFile, folderId, toast]
  )

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        e.stopPropagation() // Prevent PageDropzone from handling the same files
        processFiles(files)
      }
    },
    [processFiles]
  )

  const handleFileSelect = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        processFiles(files)
      }
    },
    [processFiles]
  )

  return (
    <div
      className={cn(
        'relative border rounded-lg bg-muted/30 p-6 lg:p-12 transition-colors',
        isDragging && 'bg-muted/50 border-primary'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileSelect}
      />
      <div className="flex flex-col items-center justify-center">
        <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">
          {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
        </p>
      </div>
    </div>
  )
}
