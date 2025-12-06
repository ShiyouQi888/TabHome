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
import { BookmarkIcon } from "./bookmark-icon"

interface BookmarkCardProps {
  bookmark: Bookmark
  folders: Folder[]
  onEdit: () => void
  onDelete: () => void
  onMoveToFolder: (folderId: string | null) => void
}

export function BookmarkCard({ bookmark, folders, onEdit, onDelete, onMoveToFolder }: BookmarkCardProps) {
  console.log('BookmarkCard rendering with icon:', bookmark.icon?.substring(0, 50))

  const handleClick = () => {
    window.open(bookmark.url, "_blank")
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(bookmark.url)
  }

  const currentFolder = folders.find((f) => f.id === bookmark.folder_id)

  const FolderSubmenu = () => (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <FolderInput className="mr-2 h-4 w-4" />
          移动到分类
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-48 max-h-60 overflow-y-auto">
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
        <div className="group relative flex flex-col items-center gap-2 p-2 transition-all duration-300 max-w-[120px]">
          {/* Category indicator */}
          {currentFolder && (
            <div
              className="absolute top-1 left-1 h-2 w-2 rounded-full"
              style={{ backgroundColor: currentFolder.color }}
              title={currentFolder.name}
            />
          )}

          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-3.5 w-3.5" />
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

          <button onClick={handleClick} className="flex flex-col items-center gap-1.5 w-full">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl overflow-hidden shadow-sm dark:shadow-primary/5 group-hover:scale-105 group-hover:shadow-md dark:group-hover:shadow-primary/15 transition-all duration-300 bg-card/50 dark:bg-card/80 border border-border/30 dark:border-border/50">
              <BookmarkIcon 
                title={bookmark.title} 
                iconUrl={bookmark.icon} 
                size="md" 
                onLoad={() => console.log('Icon loaded successfully:', bookmark.icon?.substring(0, 50))} 
              />
            </div>
            <span className="text-xs text-center line-clamp-2 text-foreground opacity-85 group-hover:opacity-100 transition-opacity max-w-[110px] font-medium">
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
          <ContextMenuSubContent className="w-48 max-h-60 overflow-y-auto">
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
