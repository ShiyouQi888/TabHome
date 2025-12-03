"use client"

import type React from "react"
import type { Folder } from "@/lib/types"
import { useState, useRef, useEffect } from "react"
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
  Edit,
  Trash2,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"

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
  const [collapsed, setCollapsed] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 处理鼠标悬停展开
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setIsHovering(true)
  }

  // 处理鼠标离开折叠
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setIsHovering(false)
    }, 300)
  }

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  // 点击切换折叠状态
  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  // 计算当前显示状态
  const isExpanded = !collapsed || isHovering

  return (
    <div 
      ref={sidebarRef}
      className="flex-shrink-0 hidden lg:block h-[calc(100vh-56px)] sticky top-14 z-40"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Collapsed Sidebar */}
      <div className="h-full flex flex-col bg-card/80 backdrop-blur-sm border-r border-border/30 transition-all duration-300 ease-in-out"
        style={{ width: isExpanded ? '224px' : '64px' }}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-primary/5 transition-all"
            onClick={toggleCollapse}
          >
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="p-4">
            {isExpanded && (
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">分类</h3>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAddFolder}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}

            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="space-y-1">
                {/* All Bookmarks */}
                <button
                  onClick={() => onSelectFolder(null)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ease-in-out",
                    selectedFolder === null
                      ? "bg-primary text-primary-foreground shadow-md border border-primary/30"
                      : "hover:bg-muted/80 text-muted-foreground hover:text-foreground hover:border border-border/50",
                  )}
                >
                  <Home className="h-4 w-4" />
                  {isExpanded && (
                    <>
                      <span className="flex-1 text-left font-medium">全部书签</span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium transition-colors",
                          selectedFolder === null ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {totalBookmarks}
                      </span>
                    </>
                  )}
                </button>

                {/* Folders */}
                {folders.map((folder) => {
                  const IconComponent = iconMap[folder.icon || "Folder"] || FolderIcon
                  const count = bookmarkCounts[folder.id] || 0

                  return (
                    <ContextMenu key={folder.id}>
                      <ContextMenuTrigger asChild>
                        <button
                          onClick={() => onSelectFolder(folder.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ease-in-out border border-transparent",
                            selectedFolder === folder.id
                              ? "bg-primary text-primary-foreground shadow-md border border-primary/30"
                              : "hover:bg-muted/80 text-muted-foreground hover:text-foreground hover:border border-border/50",
                          )}
                        >
                          <div className="h-4 w-4 rounded flex items-center justify-center" style={{ color: folder.color }}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          {isExpanded && (
                            <>
                              <span className="flex-1 text-left truncate font-medium">{folder.name}</span>
                              <span
                                className={cn(
                                  "text-xs px-2 py-0.5 rounded-full font-medium transition-colors",
                                  selectedFolder === folder.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground",
                                )}
                              >
                                {count}
                              </span>
                            </>
                          )}
                        </button>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="min-w-[180px]">
                        <ContextMenuItem onClick={() => onEditFolder(folder)}>
                          <Edit className="mr-2 h-4 w-4" />
                          编辑
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => onDeleteFolder(folder)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  )
                })}

                {/* Add Folder Button (only visible when expanded) */}
                {isExpanded && (
                  <button
                    onClick={onAddFolder}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ease-in-out border border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="flex-1 text-left font-medium">添加分类</span>
                  </button>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}