"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Wand2, Folder } from "lucide-react"
import type { Folder as FolderType } from "@/lib/types"
import { CustomIconEditor } from "@/components/custom-icon-editor"

interface AddBookmarkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  folders: FolderType[]
  selectedFolder: string | null
  onSuccess: () => void
}

export function AddBookmarkDialog({
  open,
  onOpenChange,
  userId,
  folders,
  selectedFolder,
  onSuccess,
}: AddBookmarkDialogProps) {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [icon, setIcon] = useState("")
  const [folderId, setFolderId] = useState<string | null>(selectedFolder)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

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
      
      // 获取网站标题
      try {
        // 使用代理服务获取网页内容
        const response = await fetch(`/api/proxy?url=${encodeURIComponent(normalizedUrl)}`)
        if (response.ok) {
          const data = await response.json()
          console.log('Proxy API response:', data)
          
          if (data.title) {
            console.log('Found site title:', data.title)
            setTitle(data.title)
          } else {
            // 如果没有找到标题，使用域名生成
            const hostname = urlObj.hostname.replace("www.", "")
            const generatedTitle = hostname.split(".")[0]
            const capitalizedTitle = generatedTitle.charAt(0).toUpperCase() + generatedTitle.slice(1)
            console.log('Generated title from hostname:', capitalizedTitle)
            setTitle(capitalizedTitle)
          }
          
          // 如果代理API返回了图标，也使用它
          if (data.icon) {
            console.log('Found site icon:', data.icon)
            setIcon(data.icon)
          } else {
            setIcon(faviconUrl)
          }
        } else {
          console.error('Proxy API failed:', response.status)
          // 如果代理服务失败，使用域名生成标题
          const hostname = urlObj.hostname.replace("www.", "")
          const generatedTitle = hostname.split(".")[0]
          const capitalizedTitle = generatedTitle.charAt(0).toUpperCase() + generatedTitle.slice(1)
          console.log('Generated title from hostname (proxy failed):', capitalizedTitle)
          setTitle(capitalizedTitle)
          setIcon(faviconUrl)
        }
      } catch (fetchError) {
        console.error('Failed to fetch site title, using hostname:', fetchError)
        // 如果获取失败，使用域名生成标题
        const hostname = urlObj.hostname.replace("www.", "")
        const generatedTitle = hostname.split(".")[0]
        const capitalizedTitle = generatedTitle.charAt(0).toUpperCase() + generatedTitle.slice(1)
        setTitle(capitalizedTitle)
        setIcon(faviconUrl)
      }
      
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
      const { count } = await supabase
        .from("bookmarks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

      const { error } = await supabase.from("bookmarks").insert({
        user_id: userId,
        url: normalizedUrl,
        title,
        icon: icon || null,
        folder_id: folderId,
        position: (count || 0) + 1,
      })

      if (error) throw error

      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      alert("Failed to add bookmark: " + errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setUrl("")
    setTitle("")
    setIcon("")
    setFolderId(selectedFolder)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加书签</DialogTitle>
          <DialogDescription>添加新的网站到您的主页</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">网址</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={fetchSiteInfo} 
                disabled={!url || isFetching}
                title="获取网站图标"
              >
                {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">名称</Label>
            <Input
              id="title"
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
                  <Label htmlFor="icon" className="text-sm">图标 URL (可选)</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-sm"
                    onClick={fetchSiteInfo}
                    disabled={!url || isFetching}
                  >
                    {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                    <span className="ml-1">获取图标</span>
                  </Button>
                </div>
                <div className="flex gap-2 items-center">
                  <Input
                    id="icon"
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
                  initialTitle={title}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>分类 (可选)</Label>
            <Select value={folderId || "none"} onValueChange={(v) => setFolderId(v === "none" ? null : v)}>
              <SelectTrigger>
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    无分类
                  </div>
                </SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4" style={{ color: folder.color }} />
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
                  添加中...
                </>
              ) : (
                "添加"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
