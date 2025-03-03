"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FileData } from "./columns"

interface FileDetailActionsProps {
  file: FileData
  toast: any
}

export function FileDetailActions({ file, toast }: FileDetailActionsProps) {
  const handleDownload = () => {
    // In a real app, this would trigger the actual file download
    toast({
      title: "File downloaded",
      description: `${file.name} has been downloaded.`,
    })
  }

  return (
    <div className="flex gap-2 mt-6">
      <Button onClick={handleDownload} className="w-full">
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
    </div>
  )
}

