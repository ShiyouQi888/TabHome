"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface HexColorInputProps {
  value: string
  onChange: (color: string) => void
  label?: string
}

export function HexColorInput({ value, onChange, label }: HexColorInputProps) {
  // 验证颜色格式
  const validateColor = (color: string) => {
    if (!color.startsWith("#")) {
      return `#${color}`
    }
    return color
  }

  // 处理颜色输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = validateColor(e.target.value)
    onChange(color)
  }

  return (
    <div className="space-y-1">
      {label && <Label className="text-xs">{label}</Label>}
      <div className="flex items-center gap-2">
        {/* Color Preview */}
        <div 
          className="h-8 w-8 rounded border flex-shrink-0 cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => {
            const input = document.getElementById("hex-color") as HTMLInputElement
            input?.click()
          }}
        />
        
        {/* Hex Input */}
        <Input
          id="hex-color"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="#3b82f6"
          className="flex-1"
          maxLength={7}
        />
        
        {/* Native Color Picker */}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="hidden"
        />
      </div>
    </div>
  )
}