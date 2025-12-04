"use client"

import { useState } from "react"
import { Bookmark, MoreVertical, Edit, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Bookmark as BookmarkType } from "@/lib/types"
import { EditBookmarkDialog } from "./edit-bookmark-dialog"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"

interface TabPageProps {
  bookmark: BookmarkType
  onEdit: (bookmark: BookmarkType) => void
  onDelete: (id: string) => void
  onRefresh: () => void
}

export function TabPage({ bookmark, onEdit, onDelete, onRefresh }: TabPageProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Ctrl+点击或Cmd+点击，在新标签页打开
      window.open(bookmark.url, '_blank')
    } else {
      // 普通点击，在当前标签页打开
      window.location.href = bookmark.url
    }
  }

  const handleEdit = () => {
    setShowEditDialog(true)
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    await onDelete(bookmark.id)
    setShowDeleteDialog(false)
  }

  const handleEditSuccess = () => {
    setShowEditDialog(false)
    onRefresh()
  }

  return (
    <>
      <div
        className={cn(
          "group relative flex flex-col items-center justify-center p-4",
          "bg-card rounded-lg border border-border/50",
          "hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer",
          "h-32 w-full"
        )}
        onClick={handleClick}
      >
        {/* 图标 */}
        <div className="mb-3 flex items-center justify-center">
          {bookmark.icon ? (
            <img
              src={bookmark.icon}
              alt={bookmark.title}
              className="h-8 w-8 rounded-lg object-contain"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                const fallback = target.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = "flex"
              }}
              onLoad={(e) => {
                const target = e.target as HTMLImageElement
                const fallback = target.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = "none"
              }}
            />
          ) : null}
          <div
            className={cn(
              "h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center",
              bookmark.icon ? "hidden" : "flex"
            )}
          >
            <Bookmark className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* 标题 */}
        <div className="text-center mb-2">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
            {bookmark.title}
          </h3>
        </div>

        {/* URL 预览 */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground line-clamp-1">
            {new URL(bookmark.url).hostname}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-background/80 backdrop-blur-sm border border-border/50"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                window.open(bookmark.url, '_blank')
              }}>
                <ExternalLink className="mr-2 h-4 w-4" />
                在新标签页打开
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                handleEdit()
              }}>
                <Edit className="mr-2 h-4 w-4" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 悬停效果 */}
        <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 编辑对话框 */}
      {showEditDialog && (
        <EditBookmarkDialog
          bookmark={bookmark}
          folders={[]} // 这里需要传入文件夹数据，暂时为空
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* 删除确认对话框 */}
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        title="删除书签"
        description={`确定要删除书签 "${bookmark.title}" 吗？此操作无法撤销。`}
      />
    </>
  )
}