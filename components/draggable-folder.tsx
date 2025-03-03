"use client"

import type React from "react"

import { useState } from "react"
import { Folder } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface FolderData {
  id: string
  name: string
  path?: string
  count?: number
}

interface DroppableProps {
  folder: FolderData
  onDrop?: (data: any, targetFolder: FolderData) => void
}

export function DroppableFolder({ folder, onDrop }: DroppableProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isOver, setIsOver] = useState(false)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "folder",
        id: folder.id,
        name: folder.name,
        path: folder.path,
      }),
    )
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOver(false)

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"))

      // Prevent dropping a folder into itself
      if (data.type === "folder" && data.id === folder.id) {
        return
      }

      if (onDrop) {
        onDrop(data, folder)
      }
    } catch (error) {
      console.error("Error parsing dropped data:", error)
    }
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "p-4 border rounded-lg transition-colors cursor-pointer",
        isDragging && "opacity-50 border-dashed",
        isOver && "bg-primary/10 border-primary",
        !isDragging && !isOver && "hover:bg-accent",
      )}
    >
      <Link
        href={folder.path ? `/folders/${folder.path}` : `/folders/${folder.id}`}
        onClick={(e) => isOver && e.preventDefault()}
      >
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
          <Folder className="w-4 h-4 text-blue-500" />
        </div>
        <h3 className="font-medium">{folder.name}</h3>
        {folder.count !== undefined && <p className="text-sm text-muted-foreground">{folder.count} Files</p>}
      </Link>
    </div>
  )
}

