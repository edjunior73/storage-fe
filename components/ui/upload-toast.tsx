"use client"
import { Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface UploadToastProps {
  fileName: string
  progress: number
}

export function UploadToast({ fileName, progress }: UploadToastProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Upload className="h-4 w-4" />
        <span className="font-medium">Uploading {fileName}</span>
      </div>
      <Progress value={progress} className="h-2" />
      <span className="text-xs text-muted-foreground">{progress}%</span>
    </div>
  )
}

