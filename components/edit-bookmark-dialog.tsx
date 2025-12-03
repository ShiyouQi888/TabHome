"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Bookmark, Folder } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Wand2, FolderIcon } from "lucide-react"
import { CustomIconEditor } from "@/components/custom-icon-editor"

interface EditBookmarkDialogProps {
  bookmark: Bookmark
  folders: Folder[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditBookmarkDialog({ bookmark, folders, open, onOpenChange, onSuccess }: EditBookmarkDialogProps) {
  const [url, setUrl] = useState(bookmark.url)
  const [title, setTitle] = useState(bookmark.title)
  const [icon, setIcon] = useState(bookmark.icon || "")
  const [folderId, setFolderId] = useState<string | null>(bookmark.folder_id)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    setUrl(bookmark.url)
    setTitle(bookmark.title)
    setIcon(bookmark.icon || "")
    setFolderId(bookmark.folder_id)
  }, [bookmark])

  const fetchSiteInfo = async () => {
    if (!url) return
    setIsFetching(true)

    try {
      let normalizedUrl = url
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        normalizedUrl = "https://" + url
      }

      const urlObj = new URL(normalizedUrl)
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`
      setIcon(faviconUrl)
      setUrl(normalizedUrl)
    } catch (error) {
      console.error("Failed to fetch site info:", error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || !title) return

    setIsLoading(true)

    try {
      let normalizedUrl = url
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        normalizedUrl = "https://" + url
      }

      const supabase = createClient()
      const { error } = await supabase
        .from("bookmarks")
        .update({
          url: normalizedUrl,
          title,
          icon: icon || null,
          folder_id: folderId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookmark.id)

      if (error) throw error

      onSuccess()
    } catch (error) {
      console.error("Failed to update bookmark:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>编辑书签</DialogTitle>
          <DialogDescription>修改书签信息</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-url">网址</Label>
            <div className="flex gap-2">
              <Input
                id="edit-url"
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <Button type="button" variant="outline" size="icon" onClick={fetchSiteInfo} disabled={!url || isFetching}>
                {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-title">名称</Label>
            <Input
              id="edit-title"
              type="text"
              placeholder="网站名称"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Custom Icon Editor */}
          <div className="space-y-3">
            <Label>图标设置</Label>
            <div className="space-y-3">
              {/* URL Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-icon" className="text-sm">图标 URL (可选)</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-sm"
                    onClick={fetchSiteInfo}
                    disabled={!url || isFetching}
                  >
                    {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                    <span className="ml-1">自动获取</span>
                  </Button>
                </div>
                <div className="flex gap-2 items-center">
                  <Input
                    id="edit-icon"
                    type="text"
                    placeholder="https://example.com/favicon.ico"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                  />
                  {icon && (
                    <div className="flex-shrink-0 h-8 w-8 rounded border bg-muted flex items-center justify-center overflow-hidden shadow-sm">
                      <img
                        src={icon || "/placeholder.svg"}
                        alt="Preview"
                        className="h-6 w-6 object-contain"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Custom Icon Editor */}
              <div className="pt-3 border-t border-border/30">
                <CustomIconEditor 
                  onIconChange={setIcon} 
                  initialIcon={icon}
                  initialTitle={title}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>分类</Label>
            <Select value={folderId || "none"} onValueChange={(v) => setFolderId(v === "none" ? null : v)}>
              <SelectTrigger>
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex items-center gap-2">
                    <FolderIcon className="h-4 w-4" />
                    无分类
                  </div>
                </SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    <div className="flex items-center gap-2">
                      <FolderIcon className="h-4 w-4" style={{ color: folder.color }} />
                      {folder.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isLoading || !url || !title} className="gradient-bg text-white">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                "保存"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
