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

  console.log('Rendering BookmarkGrid with bookmarks:', bookmarks.length)
  console.log('Filtered bookmarks:', filteredBookmarks.length)
  console.log('Selected folder:', selectedFolder)
  
  // 详细检查每个书签的图标数据
  filteredBookmarks.forEach((bookmark, index) => {
    console.log(`Bookmark ${index}:`, {
      id: bookmark.id,
      title: bookmark.title,
      hasIcon: !!bookmark.icon,
      iconLength: bookmark.icon?.length,
      iconPreview: bookmark.icon?.substring(0, 100),
      isDataUrl: bookmark.icon?.startsWith('data:')
    })
  })

  if (filteredBookmarks.length === 0) {
    const currentFolder = folders.find((f) => f.id === selectedFolder)
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
        <div className="relative mb-8">
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-xl animate-pulse-slow" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg">
            <Sparkles className="h-12 w-12 text-primary animate-pulse" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-3 tracking-tight">
          {selectedFolder ? `"${currentFolder?.name}" 分类为空` : "还没有书签"}
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
          {selectedFolder 
            ? "这个分类下还没有书签，点击下方按钮添加新书签，或从其他分类移动书签过来" 
            : "开始添加你常用的网站，打造个性化的浏览器主页。添加后可以快速访问你的收藏，提升浏览效率"}
        </p>
        <button
          onClick={onAddNew}
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full gradient-bg text-white font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          {selectedFolder ? "添加书签到分类" : "添加第一个书签"}
        </button>
        <p className="mt-4 text-sm text-muted-foreground">
          {selectedFolder ? "或从其他分类移动书签到此分类" : "支持批量导入和自动获取网站图标"}
        </p>
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

      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-5 md:gap-6 justify-items-center">
        {filteredBookmarks.map((bookmark) => {
          console.log('Rendering bookmark:', bookmark.id, 'with icon:', bookmark.icon?.substring(0, 50))
          return (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              folders={folders}
              onEdit={() => onEdit(bookmark)}
              onDelete={() => onDelete(bookmark)}
              onMoveToFolder={(folderId) => onMoveToFolder(bookmark, folderId)}
            />
          )
        })
        }

        {/* Add New Bookmark Card */}
        <button
          onClick={onAddNew}
          className="group flex flex-col items-center justify-center gap-1.5 p-2 transition-all duration-300 max-w-[120px]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted/50 dark:bg-card/80 border border-dashed border-border/50 dark:border-border/50 shadow-sm dark:shadow-primary/5 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
            <Plus className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="text-xs font-medium text-foreground opacity-85 group-hover:opacity-100 transition-opacity max-w-[110px]">
            添加书签
          </span>
        </button>
      </div>
    </div>
  )
}
