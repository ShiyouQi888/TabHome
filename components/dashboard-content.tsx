"use client"

import { useState, useEffect, useMemo } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { SearchBar } from "@/components/search-bar"
import { BookmarkGrid } from "@/components/bookmark-grid"
import { TabGrid } from "@/components/tab-grid"
import { DashboardHeader } from "@/components/dashboard-header"
import { AddBookmarkDialog } from "@/components/add-bookmark-dialog"
import { EditBookmarkDialog } from "@/components/edit-bookmark-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { SearchEngineManager } from "@/components/search-engine-manager"
import { CategorySidebar } from "@/components/category-sidebar"
import { MobileCategoryTabs } from "@/components/mobile-category-tabs"
import { FolderDialog } from "@/components/folder-dialog"
import { Footer } from "@/components/footer"
import { type Bookmark, type SearchEngine, type Folder, DEFAULT_SEARCH_ENGINES } from "@/lib/types"
import useSWR, { mutate } from "swr"

interface DashboardContentProps {
  user: User
}

const fetcher = async (key: string, userId?: string) => {
  const supabase = createClient()
  let query = supabase.from(key).select("*").order("position", { ascending: true })
  
  // 对于需要用户过滤的表，添加用户ID条件
  if (userId && (key === "bookmarks" || key === "folders" || key === "search_engines")) {
    query = query.eq("user_id", userId)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showSearchEngineManager, setShowSearchEngineManager] = useState(false)
  const [showFolderDialog, setShowFolderDialog] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null)
  const [deletingBookmark, setDeletingBookmark] = useState<Bookmark | null>(null)
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentSearchEngine, setCurrentSearchEngine] = useState<SearchEngine | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"bookmarks" | "tabs">("bookmarks")

  const { data: bookmarks = [], error: bookmarksError, isLoading: bookmarksLoading, mutate: bookmarksMutate } = useSWR<Bookmark[]>(["bookmarks", user.id], ([key, userId]) => fetcher(key, userId), { refreshInterval: 30000, revalidateOnFocus: true })
  
  // 检查书签数据中的图标信息
  useEffect(() => {
    if (bookmarks && bookmarks.length > 0) {
      console.log('=== BOOKMARKS DATA CHECK ===')
      console.log('Total bookmarks:', bookmarks.length)
      bookmarks.forEach((bookmark, index) => {
        if (bookmark.icon) {
          console.log(`Bookmark ${index}:`, {
            id: bookmark.id,
            title: bookmark.title,
            iconLength: bookmark.icon.length,
            iconPreview: bookmark.icon.substring(0, 50),
            isDataUrl: bookmark.icon.startsWith('data:')
          })
        }
      })
      console.log('=== END BOOKMARKS CHECK ===')
    }
  }, [bookmarks])
  const { data: folders = [], isLoading: foldersLoading } = useSWR<Folder[]>(["folders", user.id], ([key, userId]) => fetcher(key, userId))
  const { data: searchEngines = [], isLoading: enginesLoading } = useSWR<SearchEngine[]>(["search_engines", user.id], ([key, userId]) => fetcher(key, userId))

  // 计算每个分类的书签数量
  const bookmarkCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    bookmarks.forEach((b) => {
      if (b.folder_id) {
        counts[b.folder_id] = (counts[b.folder_id] || 0) + 1
      }
    })
    return counts
  }, [bookmarks])

  // 初始化搜索引擎
  useEffect(() => {
    const initSearchEngines = async () => {
      if (!enginesLoading && searchEngines.length === 0) {
        const supabase = createClient()
        
        // 先检查是否已存在内置搜索引擎，避免重复插入
        const { data: existingEngines } = await supabase
          .from("search_engines")
          .select("name, is_builtin")
          .eq("user_id", user.id)
          .eq("is_builtin", true)
        
        // 只插入不存在的内置搜索引擎
        const existingBuiltinNames = existingEngines?.map(e => e.name) || []
        const enginesToInsert = DEFAULT_SEARCH_ENGINES
          .filter(engine => !existingBuiltinNames.includes(engine.name))
          .map((engine, index) => ({
            ...engine,
            user_id: user.id,
            position: index,
          }))
        
        if (enginesToInsert.length > 0) {
          await supabase.from("search_engines").insert(enginesToInsert)
          mutate(["search_engines", user.id])
        }
      }
    }
    initSearchEngines()
  }, [enginesLoading, searchEngines.length, user.id])

  // 清理重复的搜索引擎
  const cleanupDuplicateEngines = async () => {
    try {
      const supabase = createClient()
      
      // 获取所有搜索引擎
      const { data: allEngines } = await supabase
        .from("search_engines")
        .select("id, name, user_id, is_builtin")
        .eq("user_id", user.id)
      
      if (!allEngines || allEngines.length === 0) return
      
      // 按名称分组，找出重复的
      const engineGroups: Record<string, typeof allEngines> = {}
      allEngines.forEach(engine => {
        if (!engineGroups[engine.name]) {
          engineGroups[engine.name] = []
        }
        engineGroups[engine.name].push(engine)
      })
      
      // 删除重复的，只保留每组第一个
      const enginesToDelete: string[] = []
      Object.values(engineGroups).forEach(group => {
        if (group.length > 1) {
          // 保留第一个，删除其余的
          const [, ...duplicates] = group
          enginesToDelete.push(...duplicates.map(e => e.id))
        }
      })
      
      if (enginesToDelete.length > 0) {
        console.log(`发现 ${enginesToDelete.length} 个重复搜索引擎，正在清理...`)
        await supabase.from("search_engines").delete().in("id", enginesToDelete)
        mutate(["search_engines", user.id])
        console.log("重复搜索引擎清理完成")
      }
    } catch (error) {
      console.error("清理重复搜索引擎失败:", error)
    }
  }

  // 设置当前搜索引擎
  useEffect(() => {
    if (searchEngines.length > 0) {
      console.log('=== SEARCH ENGINES DATA CHECK ===')
      console.log('Total search engines:', searchEngines.length)
      searchEngines.forEach((engine, index) => {
        console.log(`Engine ${index}:`, {
          id: engine.id,
          name: engine.name,
          is_builtin: engine.is_builtin,
          is_default: engine.is_default,
          url: engine.url,
          user_id: engine.user_id
        })
      })
      console.log('=== END SEARCH ENGINES CHECK ===')
      
      // 清理重复的搜索引擎
      cleanupDuplicateEngines()
      
      const defaultEngine = searchEngines.find((e) => e.is_default) || searchEngines[0]
      setCurrentSearchEngine(defaultEngine)
    }
  }, [searchEngines])

  const handleDeleteBookmarkRequest = (bookmark: Bookmark) => {
    setDeletingBookmark(bookmark)
  }

  const handleDeleteBookmarkConfirm = async () => {
    if (!deletingBookmark) return

    setIsDeleting(true)
    try {
      const supabase = createClient()
      await supabase.from("bookmarks").delete().eq("id", deletingBookmark.id)
      mutate(["bookmarks", user.id])
      setDeletingBookmark(null)
    } catch (error) {
      console.error("Failed to delete bookmark:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteFolderRequest = (folder: Folder) => {
    setDeletingFolder(folder)
  }

  const handleDeleteFolderConfirm = async () => {
    if (!deletingFolder) return

    setIsDeleting(true)
    try {
      const supabase = createClient()
      // 将该分类下的书签移到"无分类"
      await supabase.from("bookmarks").update({ folder_id: null }).eq("folder_id", deletingFolder.id)
      // 删除分类
      await supabase.from("folders").delete().eq("id", deletingFolder.id)
      mutate(["bookmarks", user.id])
      mutate(["folders", user.id])
      setDeletingFolder(null)
      if (selectedFolder === deletingFolder.id) {
        setSelectedFolder(null)
      }
    } catch (error) {
      console.error("Failed to delete folder:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleMoveToFolder = async (bookmark: Bookmark, folderId: string | null) => {
    try {
      const supabase = createClient()
      await supabase
        .from("bookmarks")
        .update({ folder_id: folderId, updated_at: new Date().toISOString() })
        .eq("id", bookmark.id)
      mutate(["bookmarks", user.id])
    } catch (error) {
      console.error("Failed to move bookmark:", error)
    }
  }

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder)
    setShowFolderDialog(true)
  }

  const handleAddFolder = () => {
    setEditingFolder(null)
    setShowFolderDialog(true)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 6) return "夜深了"
    if (hour < 12) return "早上好"
    if (hour < 14) return "中午好"
    if (hour < 18) return "下午好"
    return "晚上好"
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <DashboardHeader
        user={user}
        onAddBookmark={() => setShowAddDialog(true)}
        onAddFolder={handleAddFolder}
        onManageSearchEngines={() => setShowSearchEngineManager(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Category Sidebar (Desktop) - Fixed on left */}
        <CategorySidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          onAddFolder={handleAddFolder}
          onEditFolder={handleEditFolder}
          onDeleteFolder={handleDeleteFolderRequest}
          bookmarkCounts={bookmarkCounts}
          totalBookmarks={bookmarks.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Greeting */}
          <div className="text-center mb-6 md:mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">{getGreeting()}</span>，{user.email?.split("@")[0]}
            </h1>
            <p className="text-muted-foreground">今天想做些什么？</p>
          </div>

          {/* Search Bar */}
          <SearchBar
            searchEngines={searchEngines}
            currentEngine={currentSearchEngine}
            onEngineChange={setCurrentSearchEngine}
          />

          {/* Mobile Category Tabs */}
          <MobileCategoryTabs
            folders={folders}
            selectedFolder={selectedFolder}
            onSelectFolder={setSelectedFolder}
            onAddFolder={handleAddFolder}
          />

          {/* View Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode("bookmarks")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "bookmarks"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                书签管理
              </button>
              <button
                onClick={() => setViewMode("tabs")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "tabs"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                标签页视图
              </button>
            </div>
          </div>

          {/* Content based on view mode */}
          {viewMode === "bookmarks" ? (
            /* Bookmarks Grid */
            <div className="pt-6">
              <BookmarkGrid
                bookmarks={bookmarks}
                folders={folders}
                isLoading={bookmarksLoading || foldersLoading}
                onEdit={setEditingBookmark}
                onDelete={handleDeleteBookmarkRequest}
                onMoveToFolder={handleMoveToFolder}
                onAddNew={() => setShowAddDialog(true)}
                selectedFolder={selectedFolder}
              />
            </div>
          ) : (
            /* Tab Page View */
            <div className="pt-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">我的标签页</h2>
                <p className="text-muted-foreground">快速访问您常用的网站</p>
              </div>
              <TabGrid
                bookmarks={bookmarks}
                folders={folders}
                isLoading={bookmarksLoading || foldersLoading}
                onAddBookmark={() => setShowAddDialog(true)}
                onEditBookmark={setEditingBookmark}
                onDeleteBookmark={handleDeleteBookmarkRequest}
                onRefresh={() => {
                  mutate(["bookmarks", user.id])
                  mutate(["folders", user.id])
                }}
                selectedFolder={selectedFolder}
              />
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Dialogs */}
      <AddBookmarkDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        userId={user.id}
        folders={folders}
        selectedFolder={selectedFolder}
        onSuccess={() => mutate(["bookmarks", user.id])}
      />

      {editingBookmark && (
        <EditBookmarkDialog
          bookmark={editingBookmark}
          folders={folders}
          open={!!editingBookmark}
          onOpenChange={(open) => !open && setEditingBookmark(null)}
          onSuccess={() => {
            console.log('EditBookmarkDialog onSuccess called, refreshing bookmarks')
            setTimeout(() => {
              bookmarksMutate()
              console.log('bookmarksMutate called after timeout')
            }, 500)
            setEditingBookmark(null)
          }}
        />
      )}

      <DeleteConfirmDialog
        open={!!deletingBookmark}
        onOpenChange={(open) => !open && setDeletingBookmark(null)}
        title="删除书签"
        description={`确定要删除书签 "${deletingBookmark?.title}" 吗？此操作无法撤销。`}
        onConfirm={handleDeleteBookmarkConfirm}
        isLoading={isDeleting}
      />

      <DeleteConfirmDialog
        open={!!deletingFolder}
        onOpenChange={(open) => !open && setDeletingFolder(null)}
        title="删除分类"
        description={`确定要删除分类 "${deletingFolder?.name}" 吗？该分类下的书签将移到"无分类"。`}
        onConfirm={handleDeleteFolderConfirm}
        isLoading={isDeleting}
      />

      <FolderDialog
        open={showFolderDialog}
        onOpenChange={setShowFolderDialog}
        userId={user.id}
        folder={editingFolder}
        onSuccess={() => {
          mutate(["folders", user.id])
          setEditingFolder(null)
        }}
      />

      <SearchEngineManager
        open={showSearchEngineManager}
        onOpenChange={setShowSearchEngineManager}
        searchEngines={searchEngines}
        userId={user.id}
        onSuccess={() => mutate(["search_engines", user.id])}
      />
    </div>
  )
}
