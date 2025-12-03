"use client"

import { useState } from "react"
import type { Bookmark, Folder } from "@/lib/types"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Edit, Trash2, ExternalLink, MoreVertical, Copy, FolderInput, FolderIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BookmarkCardProps {
  bookmark: Bookmark
  folders: Folder[]
  onEdit: () => void
  onDelete: () => void
  onMoveToFolder: (folderId: string | null) => void
}

export function BookmarkCard({ bookmark, folders, onEdit, onDelete, onMoveToFolder }: BookmarkCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleClick = () => {
    window.open(bookmark.url, "_blank")
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(bookmark.url)
  }

  const getInitials = (title: string) => {
    return title.charAt(0).toUpperCase()
  }

  const getGradientFromTitle = (title: string) => {
    const gradients = [
      "from-rose-500 to-pink-500",
      "from-orange-500 to-amber-500",
      "from-emerald-500 to-teal-500",
      "from-cyan-500 to-blue-500",
      "from-blue-500 to-indigo-500",
      "from-violet-500 to-purple-500",
      "from-fuchsia-500 to-pink-500",
      "from-lime-500 to-green-500",
    ]
    const index = title.charCodeAt(0) % gradients.length
    return gradients[index]
  }

  const currentFolder = folders.find((f) => f.id === bookmark.folder_id)

  const FolderSubmenu = () => (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <FolderInput className="mr-2 h-4 w-4" />
          移动到分类
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-40">
          <DropdownMenuItem onClick={() => onMoveToFolder(null)}>
            <FolderIcon className="mr-2 h-4 w-4" />
            无分类
          </DropdownMenuItem>
          {folders.map((folder) => (
            <DropdownMenuItem
              key={folder.id}
              onClick={() => onMoveToFolder(folder.id)}
              className={bookmark.folder_id === folder.id ? "bg-muted" : ""}
            >
              <FolderIcon className="mr-2 h-4 w-4" style={{ color: folder.color }} />
              {folder.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  )

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="group relative flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-card hover:shadow-lg transition-all duration-300">
          {/* Category indicator */}
          {currentFolder && (
            <div
              className="absolute top-1 left-1 h-2 w-2 rounded-full"
              style={{ backgroundColor: currentFolder.color }}
              title={currentFolder.name}
            />
          )}

          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 bg-background/90 backdrop-blur-sm shadow-sm hover:bg-background"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={handleClick}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  打开链接
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyUrl}>
                  <Copy className="mr-2 h-4 w-4" />
                  复制链接
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <FolderSubmenu />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button onClick={handleClick} className="flex flex-col items-center gap-2 w-full">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-muted overflow-hidden shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
              {bookmark.icon && !imageError ? (
                <img
                  src={bookmark.icon || "/placeholder.svg"}
                  alt={bookmark.title}
                  className="h-8 w-8 object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  className={`flex h-full w-full items-center justify-center text-white font-bold text-xl bg-gradient-to-br ${getGradientFromTitle(bookmark.title)}`}
                >
                  {getInitials(bookmark.title)}
                </div>
              )}
            </div>
            <span className="text-xs text-center line-clamp-2 text-muted-foreground group-hover:text-foreground transition-colors max-w-full font-medium">
              {bookmark.title}
            </span>
          </button>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={handleClick}>
          <ExternalLink className="mr-2 h-4 w-4" />
          打开链接
        </ContextMenuItem>
        <ContextMenuItem onClick={handleCopyUrl}>
          <Copy className="mr-2 h-4 w-4" />
          复制链接
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <FolderInput className="mr-2 h-4 w-4" />
            移动到分类
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-40">
            <ContextMenuItem onClick={() => onMoveToFolder(null)}>
              <FolderIcon className="mr-2 h-4 w-4" />
              无分类
            </ContextMenuItem>
            {folders.map((folder) => (
              <ContextMenuItem key={folder.id} onClick={() => onMoveToFolder(folder.id)}>
                <FolderIcon className="mr-2 h-4 w-4" style={{ color: folder.color }} />
                {folder.name}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          编辑书签
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          删除书签
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
