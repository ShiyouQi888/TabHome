"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { SearchEngine } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Trash2, Search, Star, Edit } from "lucide-react"

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
  const [editingEngine, setEditingEngine] = useState<SearchEngine | null>(null)
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
      
      if (editingEngine) {
        // 更新现有引擎
        const { error } = await supabase
          .from("search_engines")
          .update({
            name: newName,
            url: newUrl,
            icon: newIcon || null,
          })
          .eq("id", editingEngine.id)

        if (error) throw error
      } else {
        // 添加新引擎
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
      }

      onSuccess()
      setShowAddForm(false)
      setEditingEngine(null)
      resetForm()
    } catch (error) {
      console.error("Failed to save search engine:", error)
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

  const handleEditEngine = (engine: SearchEngine) => {
    setEditingEngine(engine)
    setNewName(engine.name)
    setNewUrl(engine.url)
    setNewIcon(engine.icon || "")
    setShowAddForm(true)
  }

  const handleUpdateEngine = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEngine || !newName || !newUrl) return

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("search_engines")
        .update({
          name: newName,
          url: newUrl,
          icon: newIcon || null,
        })
        .eq("id", editingEngine.id)

      if (error) throw error

      onSuccess()
      setShowAddForm(false)
      setEditingEngine(null)
      resetForm()
    } catch (error) {
      console.error("Failed to update search engine:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setNewName("")
    setNewUrl("")
    setNewIcon("")
    setEditingEngine(null)
  }

  // 测试函数：添加示例搜索引擎
  const addTestEngine = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("search_engines").insert({
        user_id: userId,
        name: "测试搜索引擎",
        url: "https://example.com/search?q=",
        icon: "https://example.com/favicon.ico",
        is_default: false,
        is_builtin: false,
        position: searchEngines.length,
      })

      if (error) throw error
      onSuccess()
      console.log("测试搜索引擎添加成功")
    } catch (error) {
      console.error("添加测试搜索引擎失败:", error)
    }
  }

  // 清理重复搜索引擎
  const cleanupDuplicates = async () => {
    try {
      const supabase = createClient()
      
      // 获取所有搜索引擎
      const { data: allEngines } = await supabase
        .from("search_engines")
        .select("id, name, user_id, is_builtin")
        .eq("user_id", userId)
      
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
        onSuccess()
        console.log("重复搜索引擎清理完成")
      } else {
        console.log("没有发现重复的搜索引擎")
      }
    } catch (error) {
      console.error("清理重复搜索引擎失败:", error)
    }
  }

  // 恢复缺失的内置搜索引擎
  const restoreMissingBuiltinEngines = async () => {
    try {
      const supabase = createClient()
      
      // 获取当前用户的所有搜索引擎
      const { data: existingEngines } = await supabase
        .from("search_engines")
        .select("name, is_builtin")
        .eq("user_id", userId)
      
      const existingNames = existingEngines?.map(e => e.name) || []
      
      // 找出缺失的内置搜索引擎
      const missingEngines = DEFAULT_SEARCH_ENGINES
        .filter(engine => !existingNames.includes(engine.name))
        .map((engine, index) => ({
          ...engine,
          user_id: userId,
          position: searchEngines.length + index,
        }))
      
      if (missingEngines.length > 0) {
        console.log(`发现 ${missingEngines.length} 个缺失的内置搜索引擎，正在恢复...`)
        await supabase.from("search_engines").insert(missingEngines)
        onSuccess()
        console.log("缺失的内置搜索引擎恢复完成")
      } else {
        console.log("所有内置搜索引擎都存在")
      }
    } catch (error) {
      console.error("恢复内置搜索引擎失败:", error)
    }
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
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = "none"
                        const searchIcon = (e.target as HTMLImageElement).nextElementSibling as HTMLElement
                        if (searchIcon) searchIcon.style.display = "block"
                      }}
                      onLoad={(e) => {
                        const searchIcon = (e.target as HTMLImageElement).nextElementSibling as HTMLElement
                        if (searchIcon) searchIcon.style.display = "none"
                      }}
                    />
                  ) : null}
                  <Search 
                    className="h-6 w-6 text-muted-foreground" 
                    style={{ display: engine.icon ? "none" : "block" }}
                  />
                  <div>
                    <p className="font-medium text-sm">{engine.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-48">{engine.url}</p>
                    <p className="text-xs text-muted-foreground">is_builtin: {engine.is_builtin ? 'true' : 'false'}</p>
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
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-100"
                        onClick={() => handleEditEngine(engine)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive opacity-100"
                        onClick={() => handleDeleteEngine(engine.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Form */}
          {showAddForm ? (
            <form onSubmit={handleAddEngine} className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">{editingEngine ? "编辑搜索引擎" : "添加搜索引擎"}</h3>
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
                  {editingEngine ? "保存" : "添加"}
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
