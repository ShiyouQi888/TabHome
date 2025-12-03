"use client"

import { useState, useEffect } from "react"
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

  // 检查初始图标是否是自定义图标
  useEffect(() => {
    if (initialIcon && initialIcon.startsWith("data:image/svg+xml")) {
      setIsCustom(true)
    }
  }, [initialIcon])

  // 生成自定义图标
  const generateCustomIcon = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <rect width="128" height="128" fill="${backgroundColor}" rx="24"/>
      <text x="64" y="80" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">${iconText}</text>
    </svg>`
    
    // 使用更紧凑的base64编码
    try {
      const base64Data = `data:image/svg+xml;base64,${btoa(svg)}`
      console.log('Generated icon data length:', base64Data.length)
      console.log('Generated icon data preview:', base64Data.substring(0, 100) + '...')
      return base64Data
    } catch (error) {
      console.error('Error generating base64:', error)
      // 如果base64失败，使用utf8编码
      const encodedSvg = encodeURIComponent(svg)
      const utf8Data = `data:image/svg+xml;utf8,${encodedSvg}`
      console.log('Using UTF8 encoding, length:', utf8Data.length)
      return utf8Data
    }
  }

  // 应用自定义图标
  const applyCustomIcon = () => {
    if (!iconText) return
    const customIcon = generateCustomIcon()
    console.log('applyCustomIcon called with:', iconText, backgroundColor)
    console.log('Generated icon data:', customIcon?.substring(0, 100))
    onIconChange(customIcon)
    setIsCustom(true)
  }

  // 清除自定义图标
  const clearCustomIcon = () => {
    onIconChange(null)
    setIsCustom(false)
  }

  // 处理颜色选择 - 不再自动应用，需要手动点击应用按钮
  const handleColorSelect = (color: string) => {
    setBackgroundColor(color)
    // 移除自动应用功能，用户必须手动点击"应用"按钮
  }

  // 处理文字输入 - 不再自动应用，需要手动点击应用按钮
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.slice(0, 2).toUpperCase()
    setIconText(text)
    // 移除自动应用功能，用户必须手动点击"应用"按钮
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
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              clearCustomIcon()
            }}
            type="button"
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
              src={generateCustomIcon()}
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
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  applyCustomIcon()
                }}
                disabled={!iconText}
                type="button"
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
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleColorSelect(color)
              }}
              aria-label={`选择颜色 ${color}`}
              type="button"
            />
          ))}
        </div>
        <div className="mt-2">
          <HexColorInput
            value={backgroundColor}
            onChange={(color) => setBackgroundColor(color)}
            label="自定义颜色"
          />
        </div>
      </div>
    </div>
  )
}