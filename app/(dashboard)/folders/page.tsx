'use client'
import { useToast } from '@/components/ui/use-toast'
import { PageDropzone } from '@/components/page-dropzone'
import { UploadDropzone } from '@/components/upload-dropzone'
import { DroppableFolder } from '@/components/draggable-folder'
import { CreateFolderDialog } from '@/components/create-folder-dialog'

const folders = [
  {
    id: 'documents',
    name: 'Documents',
    icon: 'document',
    count: 24
  },
  {
    id: 'images',
    name: 'Images',
    icon: 'image',
    count: 2140
  },
  {
    id: 'videos',
    name: 'Videos',
    icon: 'video',
    count: 16
  },
  {
    id: 'downloads',
    name: 'Downloads',
    icon: 'download',
    count: 15
  }
]

export default function FoldersPage() {
  const { toast } = useToast()

  const processFiles = async (files: FileList) => {
    // In a real app, you would upload the files to your server
    toast({
      title: 'Success',
      description: `Successfully uploaded ${files.length} file${files.length === 1 ? '' : 's'}`
    })
  }

  const handleFolderDrop = (data: any, targetFolder: any) => {
    if (data.type === 'file') {
      // Handle file drop into folder
      toast({
        title: 'File moved',
        description: (
          <span>
            Moved <strong>{data.name}</strong> to <strong>{targetFolder.name}</strong>
          </span>
        )
      })
      // In a real app, you would update your file location in the database
    } else if (data.type === 'folder') {
      // Prevent moving a folder into itself
      if (data.id === targetFolder.id) {
        toast({
          title: 'Cannot move folder',
          description: 'Cannot move a folder into itself',
          variant: 'destructive'
        })
        return
      }

      toast({
        title: 'Folder moved',
        description: `Moved ${data.name} to ${targetFolder.name}`
      })
      // In a real app, you would update your folder structure in the database
    }
  }

  return (
    <PageDropzone onFilesDropped={processFiles}>
      <div className="min-h-screen bg-background">
        <div className="p-6">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-semibold">Folders</h1>
              <p className="text-sm text-muted-foreground">Organize your files into folders</p>
            </div>

            {/* Upload Area */}
            <UploadDropzone
              onFilesUploaded={newFiles => {
                // Files will be uploaded directly via the component
              }}
            />

            {/* Folders */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Folders</h2>
                <CreateFolderDialog />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {folders.map(folder => (
                  <DroppableFolder key={folder.id} folder={folder} onDrop={handleFolderDrop} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageDropzone>
  )
}
