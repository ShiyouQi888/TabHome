import type React from "react"
import Link from "next/link"
import { Globe } from "lucide-react"

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold mb-2">使用条款</h1>
          <p className="text-muted-foreground">最后更新：2025年1月1日</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. 接受条款</h2>
            <p className="mb-4">
              欢迎使用TabHome！通过访问或使用我们的服务，您同意遵守本使用条款和我们的隐私政策。如果您不同意这些条款，请不要使用我们的服务。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. 服务描述</h2>
            <p className="mb-4">
              TabHome提供个性化浏览器主页服务，包括书签管理、搜索引擎集成和其他相关功能。我们保留随时修改、暂停或终止服务的权利，无需事先通知。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. 用户责任</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>您必须确保您的账号信息准确无误</li>
              <li>您对您在服务上的所有活动负责</li>
              <li>您不得使用服务进行任何非法或侵权活动</li>
              <li>您不得干扰或破坏服务的正常运行</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. 知识产权</h2>
            <p className="mb-4">
              TabHome及其所有内容，包括但不限于商标、徽标、文字、图像、软件和代码，均受版权和其他知识产权法律的保护。未经我们的明确书面许可，您不得复制、修改或分发这些内容。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. 免责声明</h2>
            <p className="mb-4">
              服务按"原样"提供，不提供任何形式的保证，包括但不限于适销性、特定用途适用性或非侵权性的保证。我们不保证服务将始终可用、及时、安全或无错误。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. 责任限制</h2>
            <p className="mb-4">
              在任何情况下，TabHome或其董事、员工或代理人均不对任何间接、偶然、特殊、后果性或惩罚性损害负责，即使我们已被告知此类损害的可能性。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. 条款修改</h2>
            <p className="mb-4">
              我们可能会不时更新本使用条款。我们将通过在服务上发布更新后的条款来通知您任何更改。您继续使用服务即表示您接受修改后的条款。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. 适用法律</h2>
            <p className="mb-4">
              本使用条款受中华人民共和国法律管辖，不考虑其法律冲突原则。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">9. 联系我们</h2>
            <p className="mb-4">
              如果您对本使用条款有任何疑问，请通过support@tabhome.com联系我们。
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">返回首页</Link> · 
            <Link href="/privacy" className="ml-2 hover:text-primary transition-colors">隐私政策</Link>
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