"use client"

import { useState, useMemo } from "react"
import { Plus, Grid, List, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabPage } from "./tab-page"
import { AddBookmarkDialog } from "./add-bookmark-dialog"
import type { Bookmark, Folder } from "@/lib/types"

interface TabGridProps {
  bookmarks: Bookmark[]
  folders: Folder[]
  isLoading: boolean
  onAddBookmark: () => void
  onEditBookmark: (bookmark: Bookmark) => void
  onDeleteBookmark: (id: string) => void
  onRefresh: () => void
  selectedFolder?: string | null
}

export function TabGrid({ 
  bookmarks, 
  folders, 
  isLoading, 
  onAddBookmark, 
  onEditBookmark, 
  onDeleteBookmark,
  onRefresh,
  selectedFolder 
}: TabGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showAddDialog, setShowAddDialog] = useState(false)

  // 过滤书签
  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks

    // 按文件夹过滤
    if (selectedFolder) {
      filtered = filtered.filter(bookmark => bookmark.folder_id === selectedFolder)
    }

    // 按搜索词过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(bookmark => 
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [bookmarks, selectedFolder, searchQuery])

  // 按文件夹分组
  const groupedBookmarks = useMemo(() => {
    const groups: Record<string, Bookmark[]> = {}
    
    filteredBookmarks.forEach(bookmark => {
      const folderId = bookmark.folder_id || "uncategorized"
      if (!groups[folderId]) {
        groups[folderId] = []
      }
      groups[folderId].push(bookmark)
    })

    return groups
  }, [filteredBookmarks])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="mb-4">
          <Grid className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">还没有书签</h3>
        <p className="text-muted-foreground mb-4">开始添加您常用的网站，创建您的个性化标签页</p>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          添加书签
        </Button>
      </div>
    )
  }

  if (filteredBookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="mb-4">
          <Search className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">没有找到匹配的书签</h3>
        <p className="text-muted-foreground">尝试调整搜索条件或选择其他分类</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 搜索和视图控制 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索书签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          添加书签
        </Button>
      </div>

      {/* 标签页内容 */}
      {selectedFolder ? (
        // 单个分类视图
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {folders.find(f => f.id === selectedFolder)?.name || "未分类"}
            <span className="ml-2 text-sm text-muted-foreground">
              ({filteredBookmarks.length})
            </span>
          </h2>
          <div className={viewMode === "grid" 
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            : "space-y-2"
          }>
            {filteredBookmarks.map((bookmark) => (
              <TabPage
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={onEditBookmark}
                onDelete={onDeleteBookmark}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        </div>
      ) : (
        // 全部分类视图
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">全部</TabsTrigger>
            {folders.map((folder) => (
              <TabsTrigger key={folder.id} value={folder.id}>
                {folder.name}
                <span className="ml-1 text-xs">
                  ({groupedBookmarks[folder.id]?.length || 0})
                </span>
              </TabsTrigger>
            ))}
            <TabsTrigger value="uncategorized">
              未分类
              <span className="ml-1 text-xs">
                ({groupedBookmarks["uncategorized"]?.length || 0})
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className={viewMode === "grid" 
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
              : "space-y-2"
            }>
              {filteredBookmarks.map((bookmark) => (
                <TabPage
                  key={bookmark.id}
                  bookmark={bookmark}
                  onEdit={onEditBookmark}
                  onDelete={onDeleteBookmark}
                  onRefresh={onRefresh}
                />
              ))}
            </div>
          </TabsContent>

          {folders.map((folder) => (
            <TabsContent key={folder.id} value={folder.id}>
              <div className={viewMode === "grid" 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                : "space-y-2"
              }>
                {groupedBookmarks[folder.id]?.map((bookmark) => (
                  <TabPage
                    key={bookmark.id}
                    bookmark={bookmark}
                    onEdit={onEditBookmark}
                    onDelete={onDeleteBookmark}
                    onRefresh={onRefresh}
                  />
                )) || (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    这个分类还没有书签
                  </div>
                )}
              </div>
            </TabsContent>
          ))}

          <TabsContent value="uncategorized">
            <div className={viewMode === "grid" 
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
              : "space-y-2"
            }>
              {groupedBookmarks["uncategorized"]?.map((bookmark) => (
                <TabPage
                  key={bookmark.id}
                  bookmark={bookmark}
                  onEdit={onEditBookmark}
                  onDelete={onDeleteBookmark}
                  onRefresh={onRefresh}
                />
              )) || (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  没有未分类的书签
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* 添加书签对话框 */}
      <AddBookmarkDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        userId="" // 这里需要从父组件传入
        folders={folders}
        selectedFolder={selectedFolder}
        onSuccess={() => {
          setShowAddDialog(false)
          onRefresh()
        }}
      />
    </div>
  )
}