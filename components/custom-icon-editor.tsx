"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { HexColorInput } from "@/components/hex-color-input"

interface CustomIconEditorProps {
  onIconChange: (icon: string | null) => void
  initialIcon?: string | null
  initialTitle?: string
}

// 预设颜色选项
export const PRESET_COLORS = [
  "#3b82f6", // 蓝色
  "#8b5cf6", // 紫色
  "#ec4899", // 粉色
  "#ef4444", // 红色
  "#f97316", // 橙色
  "#eab308", // 黄色
  "#22c55e", // 绿色
  "#06b6d4", // 青色
  "#6366f1", // 靛蓝
  "#10b981", // 薄荷色
  "#f59e0b", // 琥珀色
  "#84cc16", // 浅绿色
  "#0ea5e9", // 天空蓝
]

export function CustomIconEditor({ onIconChange, initialIcon, initialTitle }: CustomIconEditorProps) {
  const [backgroundColor, setBackgroundColor] = useState("#3b82f6")
  const [iconText, setIconText] = useState(initialTitle?.slice(0, 2).toUpperCase() || "")
  const [isCustom, setIsCustom] = useState(false)

  // 生成自定义图标
  const generateCustomIcon = () => {
    // 简单的 SVG 数据 URL 生成
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <rect width="128" height="128" fill="${backgroundColor}" rx="24" />
      <text x="64" y="80" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">${iconText}</text>
    </svg>`
    
    const encodedSvg = encodeURIComponent(svgContent)
    return `data:image/svg+xml;utf8,${encodedSvg}`
  }

  // 应用自定义图标
  const applyCustomIcon = () => {
    if (!iconText) return
    const customIcon = generateCustomIcon()
    onIconChange(customIcon)
    setIsCustom(true)
  }

  // 清除自定义图标
  const clearCustomIcon = () => {
    onIconChange(null)
    setIsCustom(false)
  }

  // 处理颜色选择
  const handleColorSelect = (color: string) => {
    setBackgroundColor(color)
    if (isCustom && iconText) {
      applyCustomIcon()
    }
  }

  // 处理文字输入
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.slice(0, 2).toUpperCase()
    setIconText(text)
    if (isCustom && text) {
      applyCustomIcon()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">自定义纯色图标</h3>
        {isCustom && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-sm"
            onClick={clearCustomIcon}
          >
            清除
          </Button>
        )}
      </div>

      {/* Icon Preview */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center border overflow-hidden shadow-sm">
          {isCustom && (
            <img
              src={initialIcon || generateCustomIcon()}
              alt="Custom Icon"
              className="h-full w-full object-contain"
            />
          )}
          {!isCustom && (
            <div className="flex items-center justify-center h-full w-full text-muted-foreground">
              预览
            </div>
          )}
        </div>
        
        {/* Icon Text Input */}
        <div className="flex-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="icon-text" className="text-sm">图标文字 (1-2个字符)</Label>
              <Button
                variant="default"
                size="sm"
                className="h-7 text-sm"
                onClick={applyCustomIcon}
                disabled={!iconText}
              >
                应用
              </Button>
            </div>
            <Input
              id="icon-text"
              type="text"
              placeholder="例如：TH"
              maxLength={2}
              value={iconText}
              onChange={handleTextChange}
              className="text-center font-bold"
            />
          </div>
        </div>
      </div>

      {/* Background Color */}
      <div className="space-y-2">
        <Label className="text-sm">背景颜色</Label>
        <div className="grid grid-cols-12 gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              className={`h-8 rounded border-2 ${backgroundColor === color ? "border-primary ring-2 ring-primary/50" : "border-transparent hover:border-primary/50"}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
              aria-label={`选择颜色 ${color}`}
            />
          ))}
        </div>
        <div className="mt-2">
          <HexColorInput
            value={backgroundColor}
            onChange={setBackgroundColor}
            label="自定义颜色"
          />
        </div>
      </div>
    </div>
  )
}