import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe, Bookmark, Search, Cloud, Shield, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">TabHome</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">登录</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>免费注册</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
          打造您的
          <span className="text-primary"> 个性化浏览器主页</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
          智能书签管理、多搜索引擎支持、自动获取网站图标，让您的浏览体验更高效、更美观
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/sign-up">
            <Button size="lg" className="text-lg px-8">
              立即开始
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              登录账户
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">核心功能</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Bookmark className="h-10 w-10" />}
            title="智能书签管理"
            description="轻松添加、编辑和组织您的书签，支持文件夹分类和拖拽排序"
          />
          <FeatureCard
            icon={<Search className="h-10 w-10" />}
            title="多搜索引擎"
            description="内置 Google、Bing、百度等主流搜索引擎，支持自定义添加"
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10" />}
            title="自动获取图标"
            description="智能获取网站的名称和图标，让您的书签更加直观美观"
          />
          <FeatureCard
            icon={<Cloud className="h-10 w-10" />}
            title="云端同步"
            description="数据安全存储在云端，多设备实时同步，随时随地访问"
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10" />}
            title="安全可靠"
            description="采用行级安全策略，确保您的数据只有您能访问"
          />
          <FeatureCard
            icon={<Globe className="h-10 w-10" />}
            title="响应式设计"
            description="完美适配各种屏幕尺寸，桌面和移动设备均可使用"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary/10 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">免费注册，立即体验功能强大的个性化浏览器主页</p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="text-lg px-8">
              免费注册
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 TabHome. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}