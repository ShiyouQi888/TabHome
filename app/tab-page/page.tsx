"use client"

import { useState, useEffect } from "react"
import { TabGrid } from "@/components/tab-grid"
import { AddBookmarkDialog } from "@/components/add-bookmark-dialog"
import { EditBookmarkDialog } from "@/components/edit-bookmark-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bookmark, Grid3x3, Settings, Search, Plus } from "lucide-react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { Bookmark as BookmarkType, Folder, UserSettings } from "@/lib/types"
import { useUser } from "@/hooks/use-user"
import { useRouter } from "next/navigation"
import { SearchBar } from "@/components/search-bar"

export default function TabPage() {
  const { user, isLoading: isUserLoading } = useUser()
  const router = useRouter()
  
  // 状态管理
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<BookmarkType | null>(null)
  const [viewMode, setViewMode] = useState<"tabs" | "bookmarks">("tabs")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)

  // 获取数据
  const { data: bookmarks = [], mutate: mutateBookmarks, isLoading: isLoadingBookmarks } = useSWR<BookmarkType[]>(
    user ? `/api/bookmarks?user_id=${user.id}` : null,
    fetcher
  )

  const { data: folders = [], mutate: mutateFolders } = useSWR<Folder[]>(
    user ? `/api/folders?user_id=${user.id}` : null,
    fetcher
  )

  const { data: settings, mutate: mutateSettings } = useSWR<UserSettings>(
    user ? `/api/settings?user_id=${user.id}` : null,
    fetcher
  )

  // 认证检查
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login")
    }
  }, [user, isUserLoading, router])

  // 处理编辑书签
  const handleEditBookmark = (bookmark: BookmarkType) => {
    setEditingBookmark(bookmark)
  }

  // 处理删除书签
  const handleDeleteBookmark = async (id: string) => {
    try {
      const response = await fetch(`/api/bookmarks?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await mutateBookmarks()
      } else {
        throw new Error("删除失败")
      }
    } catch (error) {
      console.error("删除书签失败:", error)
      alert("删除书签失败，请重试")
    }
  }

  // 刷新数据
  const handleRefresh = () => {
    mutateBookmarks()
    mutateFolders()
    mutateSettings()
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 头部 */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                我的标签页
              </h1>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "tabs" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("tabs")}
                >
                  <Grid3x3 className="mr-2 h-4 w-4" />
                  标签页
                </Button>
                <Button
                  variant={viewMode === "bookmarks" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("bookmarks")}
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  书签管理
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
              >
                <Settings className="mr-2 h-4 w-4" />
                设置
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-6">
        {viewMode === "tabs" ? (
          // 标签页视图
          <div className="space-y-6">
            {/* 搜索栏 */}
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                settings={settings}
                onRefresh={handleRefresh}
              />
            </div>

            {/* 标签页网格 */}
            <TabGrid
              bookmarks={bookmarks}
              folders={folders}
              isLoading={isLoadingBookmarks}
              onAddBookmark={() => setShowAddDialog(true)}
              onEditBookmark={handleEditBookmark}
              onDeleteBookmark={handleDeleteBookmark}
              onRefresh={handleRefresh}
              selectedFolder={selectedFolder}
            />
          </div>
        ) : (
          // 书签管理视图
          <div className="space-y-6">
            {/* 分类选择 */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedFolder === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFolder(null)}
              >
                全部分类
              </Button>
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFolder(folder.id)}
                  className="flex items-center gap-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: folder.color }}
                  />
                  {folder.name}
                </Button>
              ))}
            </div>

            {/* 书签列表 */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">书签列表</h2>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加书签
                </Button>
              </div>

              {isLoadingBookmarks ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* 过滤书签 */}
                  {selectedFolder 
                    ? bookmarks.filter(bookmark => bookmark.folder_id === selectedFolder).map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={bookmark.icon || `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}`}
                          alt=""
                          className="w-4 h-4 rounded"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                        <div>
                          <h3 className="font-medium">{bookmark.title}</h3>
                          <p className="text-sm text-muted-foreground">{bookmark.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBookmark(bookmark)}
                        >
                          编辑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBookmark(bookmark.id)}
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  ))
                  : bookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={bookmark.icon || `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}`}
                          alt=""
                          className="w-4 h-4 rounded"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                        <div>
                          <h3 className="font-medium">{bookmark.title}</h3>
                          <p className="text-sm text-muted-foreground">{bookmark.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBookmark(bookmark)}
                        >
                          编辑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBookmark(bookmark.id)}
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </main>

      {/* 添加书签对话框 */}
      <AddBookmarkDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        userId={user.id}
        folders={folders}
        selectedFolder={selectedFolder}
        onSuccess={() => {
          setShowAddDialog(false)
          handleRefresh()
        }}
      />

      {/* 编辑书签对话框 */}
      <EditBookmarkDialog
        open={!!editingBookmark}
        onOpenChange={(open) => !open && setEditingBookmark(null)}
        bookmark={editingBookmark}
        folders={folders}
        onSuccess={() => {
          setEditingBookmark(null)
          handleRefresh()
        }}
      />
    </div>
  )
}