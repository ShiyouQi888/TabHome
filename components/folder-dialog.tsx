"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Folder,
  Star,
  Heart,
  Briefcase,
  Code,
  Music,
  Video,
  ImageIcon,
  Book,
  ShoppingBag,
  Gamepad2,
  Globe,
} from "lucide-react"
import { FOLDER_COLORS, type Folder as FolderType } from "@/lib/types"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Folder,
  Star,
  Heart,
  Briefcase,
  Code,
  Music,
  Video,
  ImageIcon,
  Book,
  ShoppingBag,
  Gamepad2,
  Globe,
}

const iconList = Object.keys(iconMap)

interface FolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  folder?: FolderType | null
  onSuccess: () => void
}

export function FolderDialog({ open, onOpenChange, userId, folder, onSuccess }: FolderDialogProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState(FOLDER_COLORS[0].value)
  const [icon, setIcon] = useState("Folder")
  const [isLoading, setIsLoading] = useState(false)

  const isEdit = !!folder

  useEffect(() => {
    if (folder) {
      setName(folder.name)
      setColor(folder.color)
      setIcon(folder.icon || "Folder")
    } else {
      setName("")
      setColor(FOLDER_COLORS[0].value)
      setIcon("Folder")
    }
  }, [folder, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)

    try {
      const supabase = createClient()

      if (isEdit && folder) {
        await supabase
          .from("folders")
          .update({ name, color, icon, updated_at: new Date().toISOString() })
          .eq("id", folder.id)
      } else {
        const { count } = await supabase
          .from("folders")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)

        await supabase.from("folders").insert({
          user_id: userId,
          name,
          color,
          icon,
          position: (count || 0) + 1,
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save folder:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑分类" : "新建分类"}</DialogTitle>
          <DialogDescription>{isEdit ? "修改分类信息" : "创建一个新的书签分类"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">分类名称</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：工作、学习、娱乐"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>选择颜色</Label>
            <div className="flex flex-wrap gap-2">
              {FOLDER_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={cn(
                    "h-8 w-8 rounded-full transition-all",
                    color === c.value ? "ring-2 ring-offset-2 ring-foreground scale-110" : "hover:scale-105",
                  )}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>选择图标</Label>
            <div className="flex flex-wrap gap-2">
              {iconList.map((iconName) => {
                const IconComponent = iconMap[iconName]
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setIcon(iconName)}
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center transition-all",
                      icon === iconName ? "bg-primary text-primary-foreground shadow-md" : "bg-muted hover:bg-muted/80",
                    )}
                  >
                    <IconComponent className="h-5 w-5" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: color + "20", color: color }}
            >
              {(() => {
                const IconComponent = iconMap[icon]
                return <IconComponent className="h-5 w-5" />
              })()}
            </div>
            <span className="font-medium">{name || "分类预览"}</span>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : isEdit ? (
                "保存"
              ) : (
                "创建"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
