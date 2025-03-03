"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { UploadToast } from "@/components/ui/upload-toast"

interface PageDropzoneProps {
  children: React.ReactNode
  onFilesDropped: (files: FileList) => void
}

export function PageDropzone({ children, onFilesDropped }: PageDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const { toast } = useToast()

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    //e.preventDefault()
    //setIsDragging(true)
  }, [])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    // Only set isDragging to false if we're leaving the main container
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return
    }
    setIsDragging(false)
  }, [])

  const handleDrop = React.useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        // Process each file
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          // Create initial toast and store its ID
          const { id, update } = toast({
            title: "Uploading files",
            description: <UploadToast fileName={file.name} progress={0} />,
          })

          // Simulate upload progress
          for (let progress = 0; progress <= 100; progress += 10) {
            // Update the existing toast
            update({
              title: "Uploading files",
              description: <UploadToast fileName={file.name} progress={progress} />,
            })
            await new Promise((resolve) => setTimeout(resolve, 100))
          }
        }

        onFilesDropped(files)

        toast({
          title: "Success",
          description: `Successfully uploaded ${files.length} file${files.length === 1 ? "" : "s"}`,
        })
      }
    },
    [onFilesDropped, toast],
  )

  return (
    <div
      className="relative min-h-screen"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}

      {isDragging && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="flex h-full items-center justify-center">
            <div className="rounded-lg border-2 border-dashed border-primary p-12 text-center">
              <Upload className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-lg font-semibold text-primary">Drop files here</h3>
              <p className="mt-2 text-sm text-muted-foreground">Drop anywhere to upload your files</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

