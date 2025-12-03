"use client"

import { Globe, Github, Heart } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4 text-primary" />
            <span>TabHome</span>
            <span className="mx-2">·</span>
            <span>&copy; {currentYear} 版权所有</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="/about" className="hover:text-foreground transition-colors">
              关于我们
            </a>
            <a href="/tutorial" className="hover:text-foreground transition-colors">
              使用教程
            </a>
            <a href="/terms" className="hover:text-foreground transition-colors">
              使用条款
            </a>
            <a href="/privacy" className="hover:text-foreground transition-colors">
              隐私政策
            </a>
            <a href="https://github.com/ShiyouQi888/TabHome" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>

          {/* Made with love */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>用</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>打造</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
