"use client"

import type React from "react"

import { useState } from "react"
import type { SearchEngine } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, ChevronDown } from "lucide-react"

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
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
      <div className="relative">
        <div className="absolute -inset-0.5 gradient-bg rounded-full opacity-50 blur group-hover:opacity-75 transition"></div>
        <div className="relative flex items-center bg-card rounded-full shadow-lg">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="absolute left-2 h-9 px-3 gap-1.5 text-muted-foreground hover:text-foreground rounded-full"
              >
                {currentEngine?.icon ? (
                  <img
                    src={currentEngine.icon || "/placeholder.svg"}
                    alt={currentEngine.name}
                    className="h-4 w-4"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="text-sm hidden sm:inline">{currentEngine?.name || "搜索"}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {searchEngines.map((engine) => (
                <DropdownMenuItem key={engine.id} onClick={() => onEngineChange(engine)} className="gap-2">
                  {engine.icon ? (
                    <img
                      src={engine.icon || "/placeholder.svg"}
                      alt={engine.name}
                      className="h-4 w-4"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = "none"
                      }}
                    />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  {engine.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索你感兴趣的内容..."
            className="h-14 pl-28 sm:pl-32 pr-14 text-lg rounded-full border-2 border-transparent focus-visible:ring-0 focus-visible:border-primary bg-transparent"
          />

          <Button
            type="submit"
            size="icon"
            className="absolute right-2 h-10 w-10 rounded-full gradient-bg hover:opacity-90 transition-opacity"
          >
            <Search className="h-5 w-5 text-white" />
            <span className="sr-only">搜索</span>
          </Button>
        </div>
      </div>
    </form>
  )
}
