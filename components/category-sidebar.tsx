"use client"

import type React from "react"
import type { Folder } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FolderIcon,
  Star,
  Heart,
  Briefcase,
  Code,
  Music,
  Video,
  ImageIcon,
  Book,
  ShoppingBag,
  Gamepad2,
  Globe,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Home,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Folder: FolderIcon,
  Star,
  Heart,
  Briefcase,
  Code,
  Music,
  Video,
  ImageIcon,
  Book,
  ShoppingBag,
  Gamepad2,
  Globe,
}

interface CategorySidebarProps {
  folders: Folder[]
  selectedFolder: string | null
  onSelectFolder: (folderId: string | null) => void
  onAddFolder: () => void
  onEditFolder: (folder: Folder) => void
  onDeleteFolder: (folder: Folder) => void
  bookmarkCounts: Record<string, number>
  totalBookmarks: number
}

export function CategorySidebar({
  folders,
  selectedFolder,
  onSelectFolder,
  onAddFolder,
  onEditFolder,
  onDeleteFolder,
  bookmarkCounts,
  totalBookmarks,
}: CategorySidebarProps) {
  return (
    <div className="w-56 flex-shrink-0 hidden lg:block">
      <div className="glass rounded-2xl p-4 sticky top-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">分类</h3>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAddFolder}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-1">
            {/* All Bookmarks */}
            <button
              onClick={() => onSelectFolder(null)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                selectedFolder === null
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <Home className="h-4 w-4" />
              <span className="flex-1 text-left">全部书签</span>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  selectedFolder === null ? "bg-primary-foreground/20" : "bg-muted",
                )}
              >
                {totalBookmarks}
              </span>
            </button>

            {/* Folders */}
            {folders.map((folder) => {
              const IconComponent = iconMap[folder.icon || "Folder"] || FolderIcon
              const count = bookmarkCounts[folder.id] || 0

              return (
                <div key={folder.id} className="group relative">
                  <button
                    onClick={() => onSelectFolder(folder.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                      selectedFolder === folder.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <div className="h-4 w-4 rounded flex items-center justify-center" style={{ color: folder.color }}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-left truncate">{folder.name}</span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        selectedFolder === folder.id ? "bg-primary-foreground/20" : "bg-muted",
                      )}
                    >
                      {count}
                    </span>
                  </button>

                  <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditFolder(folder)}>
                          <Edit className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteFolder(folder)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
