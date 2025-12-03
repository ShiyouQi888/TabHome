"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { SearchEngine } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Trash2, Search, Star } from "lucide-react"

interface SearchEngineManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  searchEngines: SearchEngine[]
  userId: string
  onSuccess: () => void
}

export function SearchEngineManager({
  open,
  onOpenChange,
  searchEngines,
  userId,
  onSuccess,
}: SearchEngineManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [newIcon, setNewIcon] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddEngine = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newUrl) return

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("search_engines").insert({
        user_id: userId,
        name: newName,
        url: newUrl,
        icon: newIcon || null,
        is_default: false,
        is_builtin: false,
        position: searchEngines.length,
      })

      if (error) throw error

      onSuccess()
      setShowAddForm(false)
      resetForm()
    } catch (error) {
      console.error("Failed to add search engine:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetDefault = async (engineId: string) => {
    try {
      const supabase = createClient()

      // 先将所有引擎设为非默认
      await supabase.from("search_engines").update({ is_default: false }).eq("user_id", userId)

      // 设置选中的引擎为默认
      await supabase.from("search_engines").update({ is_default: true }).eq("id", engineId)

      onSuccess()
    } catch (error) {
      console.error("Failed to set default:", error)
    }
  }

  const handleDeleteEngine = async (engineId: string) => {
    try {
      const supabase = createClient()
      await supabase.from("search_engines").delete().eq("id", engineId)
      onSuccess()
    } catch (error) {
      console.error("Failed to delete search engine:", error)
    }
  }

  const resetForm = () => {
    setNewName("")
    setNewUrl("")
    setNewIcon("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>管理搜索引擎</DialogTitle>
          <DialogDescription>添加、删除或设置默认搜索引擎</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Engine List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {searchEngines.map((engine) => (
              <div key={engine.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  {engine.icon ? (
                    <img
                      src={engine.icon || "/placeholder.svg"}
                      alt={engine.name}
                      className="h-6 w-6"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = "none"
                      }}
                    />
                  ) : (
                    <Search className="h-6 w-6 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{engine.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-48">{engine.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={engine.is_default ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleSetDefault(engine.id)}
                  >
                    <Star className={`h-4 w-4 ${engine.is_default ? "fill-current" : ""}`} />
                  </Button>
                  {!engine.is_builtin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteEngine(engine.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Form */}
          {showAddForm ? (
            <form onSubmit={handleAddEngine} className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="engine-name">名称</Label>
                <Input
                  id="engine-name"
                  placeholder="例如: GitHub"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="engine-url">搜索 URL</Label>
                <Input
                  id="engine-url"
                  placeholder="例如: https://github.com/search?q="
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">搜索词会自动添加到 URL 末尾</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="engine-icon">图标 URL (可选)</Label>
                <Input
                  id="engine-icon"
                  placeholder="https://github.com/favicon.ico"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    resetForm()
                  }}
                >
                  取消
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  添加
                </Button>
              </div>
            </form>
          ) : (
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              添加自定义搜索引擎
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
