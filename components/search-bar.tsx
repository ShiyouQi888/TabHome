"use client"

import type React from "react"

import { useState } from "react"
import type { SearchEngine } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, ChevronDown } from "lucide-react"
import { Weather } from "@/components/weather"
import { Time } from "@/components/time"

interface SearchBarProps {
  searchEngines: SearchEngine[]
  currentEngine: SearchEngine | null
  onEngineChange: (engine: SearchEngine) => void
}

export function SearchBar({ searchEngines, currentEngine, onEngineChange }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || !currentEngine) return
    window.open(currentEngine.url + encodeURIComponent(query), "_blank")
  }

  return (
    <div className="flex flex-col items-center mb-6">
      {/* 时间和天气显示在搜索框上方 */}
      <div className="flex items-center justify-center gap-8 mb-4">
        <Time />
        <Weather />
      </div>
      
      {/* 搜索框 */}
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-primary" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索网页..."
              className="w-full pl-10 pr-12 h-14 text-lg rounded-xl border-2 border-primary/20 bg-background/90 backdrop-blur-sm focus:border-primary focus:bg-background focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {searchEngines.length > 1 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 w-24 border-0 bg-transparent hover:bg-primary/5 focus:ring-0 focus:ring-offset-0 text-xs"
                    >
                      {currentEngine?.icon ? (
                        <img
                          src={currentEngine.icon || "/placeholder.svg"}
                          alt={currentEngine.name}
                          className="h-4 w-4"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = "none"
                            // 确保显示备用图标
                            const nextSibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement
                            if (nextSibling) {
                              nextSibling.style.display = 'block'
                            }
                          }}
                          onLoad={(e) => {
                            // 图片加载成功时隐藏备用图标
                            const nextSibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement
                            if (nextSibling && nextSibling.tagName === 'svg'.toUpperCase()) {
                              nextSibling.style.display = 'none'
                            }
                          }}
                        />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      {/* 备用图标 - 初始隐藏 */}
                      <Search className="h-4 w-4" style={{ display: currentEngine?.icon ? 'none' : 'block' }} />
                      <span className="hidden sm:inline">{currentEngine?.name || "搜索"}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    {searchEngines.map((engine) => (
                      <DropdownMenuItem key={engine.id} onClick={() => onEngineChange(engine)} className="gap-2">
                        {engine.icon ? (
                          <img
                            src={engine.icon || "/placeholder.svg"}
                            alt={engine.name}
                            className="h-4 w-4"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).style.display = "none"
                              const nextSibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement
                              if (nextSibling) {
                                nextSibling.style.display = 'block'
                              }
                            }}
                            onLoad={(e) => {
                              const nextSibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement
                              if (nextSibling && nextSibling.tagName === 'svg'.toUpperCase()) {
                                nextSibling.style.display = 'none'
                              }
                            }}
                          />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                        {/* 备用图标 - 初始隐藏 */}
                        <Search className="h-4 w-4" style={{ display: engine.icon ? 'none' : 'block' }} />
                        {engine.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
