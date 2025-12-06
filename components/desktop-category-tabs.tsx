"use client"

import type React from "react"
import type { Folder } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
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
  Home,
  Edit,
  Trash2,
} from "lucide-react"

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

interface DesktopCategoryTabsProps {
  folders: Folder[]
  selectedFolder: string | null
  onSelectFolder: (folderId: string | null) => void
  onAddFolder: () => void
  onEditFolder: (folder: Folder) => void
  onDeleteFolder: (folder: Folder) => void
  bookmarkCounts: Record<string, number>
  totalBookmarks: number
}

export function DesktopCategoryTabs({ 
  folders, 
  selectedFolder, 
  onSelectFolder, 
  onAddFolder,
  onEditFolder,
  onDeleteFolder,
  bookmarkCounts,
  totalBookmarks
}: DesktopCategoryTabsProps) {
  return (
    <div className="hidden lg:block mb-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {/* All Button */}
          <button
            onClick={() => onSelectFolder(null)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0",
              selectedFolder === null
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            <Home className="h-4 w-4" />
            全部
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium ml-1",
              selectedFolder === null ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background text-muted-foreground",
            )}>
              {totalBookmarks}
            </span>
          </button>

          {/* Folder Buttons */}
          {folders.map((folder) => {
            const IconComponent = iconMap[folder.icon || "Folder"] || FolderIcon
            const count = bookmarkCounts[folder.id] || 0
            
            return (
              <ContextMenu key={folder.id}>
                <ContextMenuTrigger asChild>
                  <button
                    onClick={() => onSelectFolder(folder.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0",
                      selectedFolder === folder.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    <IconComponent
                      className="h-4 w-4"
                      style={{ color: selectedFolder === folder.id ? undefined : folder.color }}
                    />
                    {folder.name}
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium ml-1",
                      selectedFolder === folder.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background text-muted-foreground",
                    )}>
                      {count}
                    </span>
                  </button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => onEditFolder(folder)}>
                    <Edit className="h-4 w-4 mr-2" />
                    编辑
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => onDeleteFolder(folder)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    删除
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            )
          })}

          {/* Add Button */}
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg flex-shrink-0 bg-transparent"
            onClick={onAddFolder}
          >
            <Plus className="h-4 w-4 mr-1" />
            新建
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}