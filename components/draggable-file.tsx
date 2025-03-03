'use client'

import type React from 'react'

import { useState } from 'react'
import { FileIcon, FileText, FileImage, FileSpreadsheet } from 'lucide-react'
import type { FileData } from './columns'
import { FileActions } from './file-actions'
import { cn } from '@/lib/utils'

interface DraggableFileProps {
  file: FileData
  onFileClick: (file: FileData) => void
  onEdit: (file: FileData) => void
  onDelete: (id: string) => void
  onDragStart?: (file: FileData) => void
  toast?: any
}

export function DraggableFile({ file, onFileClick, onEdit, onDelete, onDragStart, toast }: DraggableFileProps) {
  const [isDragging, setIsDragging] = useState(false)

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()

    switch (extension) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />
      case 'jpg':
      case 'png':
      case 'gif':
        return <FileImage className="h-8 w-8 text-blue-500" />
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />
      default:
        return <FileIcon className="h-8 w-8 text-gray-500" />
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        type: 'file',
        id: file.id,
        name: file.name,
        location: file.location
      })
    )
    setIsDragging(true)
    if (onDragStart) onDragStart(file)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-lg border bg-card p-4 hover:bg-accent transition-colors cursor-pointer',
        isDragging && 'opacity-50 border-dashed'
      )}
      onClick={() => onFileClick(file)}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <FileActions file={file} onEdit={onEdit} onDelete={onDelete} toast={toast} />
      </div>
      <div className="flex flex-col items-center text-center gap-4 p-4">
        <div className="rounded-lg bg-background p-2">{getFileIcon(file.name)}</div>
        <div className="space-y-1">
          <h3 className="font-medium truncate max-w-[200px]">{file.name}</h3>
        </div>
      </div>
      <div className="mt-auto pt-4 text-xs text-muted-foreground">{file.date}</div>
    </div>
  )
}
