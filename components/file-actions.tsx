'use client'

import type React from 'react'
import { useState } from 'react'
import { MoreVertical, Pencil, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FileData } from './columns'
import { getFileById } from '@/lib/api'
interface FileActionsProps {
  file: FileData
  onEdit: (file: FileData) => void
  onDelete: (id: string) => void
  toast?: any
}

export function FileActions({ file, onEdit, onDelete, toast }: FileActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editedFile, setEditedFile] = useState(file)

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault()
    onEdit(editedFile)
    setShowEditDialog(false)
  }

  const handleDelete = () => {
    onDelete(file.id)
    setShowDeleteDialog(false)
  }

  const handleDownload = async () => {
    try {
      // Get the file URL from the API
      const url = await getFileById(file.id)

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const blob = await response.blob()

      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = downloadUrl
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl)

      toast({
        title: 'File downloaded',
        description: `${file.name} has been downloaded.`
      })
    } catch (error) {
      toast({
        title: 'Download failed',
        description: `Failed to download ${file.name}`,
        variant: 'destructive'
      })
    }
  }

  return (
    <div onClick={e => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download file
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete file
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit file</DialogTitle>
            <DialogDescription>Make changes to your file here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editedFile.name}
                  onChange={e => setEditedFile({ ...editedFile, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editedFile.location}
                  onChange={e => setEditedFile({ ...editedFile, location: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete{' '}
              <span className="font-medium">{file.name}</span> and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete file
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
