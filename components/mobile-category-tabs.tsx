"use client"

import type React from "react"

import type { Folder } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
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

interface MobileCategoryTabsProps {
  folders: Folder[]
  selectedFolder: string | null
  onSelectFolder: (folderId: string | null) => void
  onAddFolder: () => void
}

export function MobileCategoryTabs({ folders, selectedFolder, onSelectFolder, onAddFolder }: MobileCategoryTabsProps) {
  return (
    <div className="lg:hidden mb-6">
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
          </button>

          {/* Folder Buttons */}
          {folders.map((folder) => {
            const IconComponent = iconMap[folder.icon || "Folder"] || FolderIcon
            return (
              <button
                key={folder.id}
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
              </button>
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
