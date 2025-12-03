import type React from "react"
import Link from "next/link"
import { Globe } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            <Link href="/" className="text-xl font-bold">TabHome</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">隐私政策</h1>
          <p className="text-muted-foreground">最后更新：2025年1月1日</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. 我们收集的信息</h2>
            <p className="mb-4">
              当您使用TabHome服务时，我们可能会收集以下类型的信息：
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>您的账号信息，包括电子邮件地址和密码</li>
              <li>您的书签数据，包括网站URL、标题和图标</li>
              <li>您的偏好设置，包括主题和搜索引擎选择</li>
              <li>使用数据，包括您如何与我们的服务交互</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. 我们如何使用您的信息</h2>
            <p className="mb-4">
              我们使用您的信息来：
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>提供和维护我们的服务</li>
              <li>个性化您的体验</li>
              <li>改进我们的服务</li>
              <li>与您沟通，包括发送服务更新和安全通知</li>
              <li>保护我们的服务和用户</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. 信息共享和披露</h2>
            <p className="mb-4">
              我们不会出售您的个人信息。我们可能会与以下各方共享您的信息：
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>我们的服务提供商，他们帮助我们提供服务</li>
              <li>法律要求时，遵守适用的法律、法规或法律程序</li>
              <li>保护我们的权利、财产或安全，以及我们用户的权利、财产或安全</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. 数据安全</h2>
            <p className="mb-4">
              我们采取合理的安全措施来保护您的个人信息，防止未经授权的访问、使用或披露。然而，没有任何互联网传输或电子存储方法是100%安全的，我们不能保证绝对的安全性。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. 数据保留</h2>
            <p className="mb-4">
              我们会在必要的时间内保留您的个人信息，以提供我们的服务并遵守我们的法律义务。当您删除您的账号时，我们会删除或匿名化您的个人信息，除非法律要求我们保留这些信息。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. 您的权利</h2>
            <p className="mb-4">
              根据适用的法律，您可能有权：
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>访问您的个人信息</li>
              <li>纠正不准确的信息</li>
              <li>删除您的个人信息</li>
              <li>限制或反对信息处理</li>
              <li>数据可移植性</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. 隐私政策更新</h2>
            <p className="mb-4">
              我们可能会不时更新本隐私政策。我们将通过在服务上发布更新后的政策来通知您任何更改。您继续使用服务即表示您接受修改后的隐私政策。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. 联系我们</h2>
            <p className="mb-4">
              如果您对本隐私政策有任何疑问，请通过privacy@tabhome.com联系我们。
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">返回首页</Link> · 
            <Link href="/terms" className="ml-2 hover:text-primary transition-colors">使用条款</Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 TabHome. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}