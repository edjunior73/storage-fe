"use client"

import type { FileData } from "./columns"
import { DraggableFile } from "./draggable-file"

interface FileGridProps {
  files: FileData[]
  onFileClick: (file: FileData) => void
  onEdit: (file: FileData) => void
  onDelete: (id: string) => void
  onFileDragStart?: (file: FileData) => void
  toast?: any
}

export function FileGrid({ files, onFileClick, onEdit, onDelete, onFileDragStart, toast }: FileGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map((file) => (
        <DraggableFile
          key={file.id}
          file={file}
          onFileClick={onFileClick}
          onEdit={onEdit}
          onDelete={onDelete}
          onDragStart={onFileDragStart}
          toast={toast}
        />
      ))}
    </div>
  )
}

