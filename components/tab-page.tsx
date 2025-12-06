"use client"

import { useState } from "react"
import { MoreVertical, Edit, Trash2, ExternalLink } from "lucide-react"
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
import { BookmarkIcon } from "./bookmark-icon"

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
        {/* 图标 - 使用可复用组件 */}
        <div className="mb-3 flex items-center justify-center">
          <BookmarkIcon 
            title={bookmark.title} 
            iconUrl={bookmark.icon} 
            size="sm" 
            className="h-8 w-8" 
          />
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

        {/* 操作按钮 - 增强版 */}
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm border border-border/60 hover:bg-background/100 shadow-sm focus:opacity-100 focus:scale-110"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
                onMouseEnter={(e) => {
                  // 确保按钮在悬停时可见
                  e.currentTarget.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  // 鼠标离开时恢复悬停效果
                  if (!e.currentTarget.matches(':focus')) {
                    e.currentTarget.style.opacity = ''
                  }
                }}
              >
                <MoreVertical className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-40 z-30"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(bookmark.url, '_blank')
                }}
                className="cursor-pointer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                在新标签页打开
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  handleEdit()
                }}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
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