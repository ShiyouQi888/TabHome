"use client"

import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, Plus, Settings, LogOut, UserIcon, Moon, Sun, FolderPlus } from "lucide-react"
import { useTheme } from "next-themes"

interface DashboardHeaderProps {
  user: User
  onAddBookmark: () => void
  onAddFolder: () => void
  onManageSearchEngines: () => void
}

export function DashboardHeader({ user, onAddBookmark, onAddFolder, onManageSearchEngines }: DashboardHeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="border-b border-border/40 glass sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg gradient-text">TabHome</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="group flex items-center gap-1 px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-200"
            onClick={onAddBookmark}
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            <span className="hidden sm:inline text-sm">书签</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="group flex items-center gap-1 px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-200"
            onClick={onAddFolder}
          >
            <FolderPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline text-sm">分类</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-full transition-all duration-200"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">切换主题</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <UserIcon className="h-5 w-5" />
                <span className="sr-only">用户菜单</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onManageSearchEngines}>
                <Settings className="mr-2 h-4 w-4" />
                管理搜索引擎
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
