'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, FileText, FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FileActions } from './file-actions'

export type FileData = {
  id: string
  name: string
  date: string
  size: string
  location: string
}

export const columns = (
  onEdit: (file: FileData) => void,
  onDelete: (id: string) => void,
  toast?: any
): ColumnDef<FileData>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
          File name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const fileName = row.getValue('name') as string
      const isPdf = fileName.toLowerCase().endsWith('.pdf')

      return (
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${isPdf ? 'bg-red-100' : 'bg-blue-100'} rounded flex items-center justify-center`}>
            {isPdf ? <FileText className="w-4 h-4 text-red-500" /> : <FileIcon className="w-4 h-4 text-blue-500" />}
          </div>
          <span>{fileName}</span>
        </div>
      )
    }
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Date uploaded
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <FileActions file={row.original} onEdit={onEdit} onDelete={onDelete} toast={toast} />
    }
  }
]
