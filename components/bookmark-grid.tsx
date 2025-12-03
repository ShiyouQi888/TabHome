"use client"

import type { Bookmark, Folder } from "@/lib/types"
import { BookmarkCard } from "@/components/bookmark-card"
import { Plus, Loader2, Sparkles } from "lucide-react"

interface BookmarkGridProps {
  bookmarks: Bookmark[]
  folders: Folder[]
  isLoading: boolean
  onEdit: (bookmark: Bookmark) => void
  onDelete: (bookmark: Bookmark) => void
  onMoveToFolder: (bookmark: Bookmark, folderId: string | null) => void
  onAddNew: () => void
  selectedFolder: string | null
}

export function BookmarkGrid({
  bookmarks,
  folders,
  isLoading,
  onEdit,
  onDelete,
  onMoveToFolder,
  onAddNew,
  selectedFolder,
}: BookmarkGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const filteredBookmarks = selectedFolder ? bookmarks.filter((b) => b.folder_id === selectedFolder) : bookmarks

  if (filteredBookmarks.length === 0) {
    const currentFolder = folders.find((f) => f.id === selectedFolder)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {selectedFolder ? `"${currentFolder?.name}" 分类为空` : "还没有书签"}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          {selectedFolder ? "将书签移动到此分类，或添加新的书签" : "添加你常用的网站，快速访问你的收藏"}
        </p>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-bg text-white font-medium hover:opacity-90 transition-opacity shadow-lg"
        >
          <Plus className="h-5 w-5" />
          添加第一个书签
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {selectedFolder ? `${filteredBookmarks.length} 个书签` : `共 ${bookmarks.length} 个书签`}
        </p>
        <p className="text-xs text-muted-foreground hidden sm:block">右键或悬停显示更多选项</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {filteredBookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            folders={folders}
            onEdit={() => onEdit(bookmark)}
            onDelete={() => onDelete(bookmark)}
            onMoveToFolder={(folderId) => onMoveToFolder(bookmark, folderId)}
          />
        ))}

        {/* Add New Bookmark Card */}
        <button
          onClick={onAddNew}
          className="group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-card transition-all min-h-[120px]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-accent/20 transition-all">
            <Plus className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            添加书签
          </span>
        </button>
      </div>
    </div>
  )
}
