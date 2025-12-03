import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '使用教程 - TabHome',
  description: 'TabHome 浏览器主页使用教程',
}

export default function TutorialPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">TabHome 使用教程</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            快速上手 TabHome 浏览器主页，打造个性化的高效浏览体验
          </p>
        </section>

        {/* Getting Started */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">快速开始</h2>
          <div className="bg-muted/50 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold shrink-0">1</div>
              <div>
                <h3 className="font-medium mb-1">注册账号</h3>
                <p className="text-muted-foreground">点击右上角的登录按钮，创建一个 TabHome 账号，或者使用第三方账号登录。</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold shrink-0">2</div>
              <div>
                <h3 className="font-medium mb-1">添加书签</h3>
                <p className="text-muted-foreground">点击右下角的 "添加书签" 按钮，输入网站 URL，系统会自动获取网站信息和图标。</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold shrink-0">3</div>
              <div>
                <h3 className="font-medium mb-1">组织分类</h3>
                <p className="text-muted-foreground">创建分类文件夹，将相关书签整理到不同分类中，方便快速查找。</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Tutorial */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">核心功能教程</h2>
          
          {/* Bookmark Management */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium">1. 书签管理</h3>
            <div className="space-y-3">
              <div className="bg-card rounded-xl p-5 border border-border/50">
                <h4 className="font-medium mb-2">添加书签</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>点击右下角的 "+" 按钮或悬停在空白处点击 "+ 添加书签"</li>
                  <li>在弹出的对话框中输入网站 URL，系统会自动获取网站标题和图标</li>
                  <li>选择所属分类，或者直接点击 "保存" 添加到无分类</li>
                  <li>如果网站没有图标，可以使用自定义纯色图标功能</li>
                </ul>
              </div>
              
              <div className="bg-card rounded-xl p-5 border border-border/50">
                <h4 className="font-medium mb-2">编辑和删除书签</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>右键点击书签卡片，在弹出菜单中选择 "编辑" 或 "删除"</li>
                  <li>悬停在书签卡片上，点击右上角的三点按钮，选择相应操作</li>
                  <li>编辑时可以修改标题、URL、图标和分类</li>
                </ul>
              </div>
              
              <div className="bg-card rounded-xl p-5 border border-border/50">
                <h4 className="font-medium mb-2">移动书签到分类</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>右键点击书签卡片，选择 "移动到分类"</li>
                  <li>在子菜单中选择目标分类</li>
                  <li>支持将书签从一个分类移动到另一个分类</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Category Management */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium">2. 分类管理</h3>
            <div className="space-y-3">
              <div className="bg-card rounded-xl p-5 border border-border/50">
                <h4 className="font-medium mb-2">创建分类</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>在左侧分类栏中点击 "+ 添加分类" 按钮</li>
                  <li>选择分类图标和颜色</li>
                  <li>输入分类名称，点击 "创建"</li>
                </ul>
              </div>
              
              <div className="bg-card rounded-xl p-5 border border-border/50">
                <h4 className="font-medium mb-2">编辑和删除分类</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>右键点击分类项，选择 "编辑" 或 "删除"</li>
                  <li>编辑时可以修改分类名称、图标和颜色</li>
                  <li>删除分类时，该分类下的书签会自动移到 "无分类"</li>
                </ul>
              </div>
              
              <div className="bg-card rounded-xl p-5 border border-border/50">
                <h4 className="font-medium mb-2">分类侧边栏</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>左侧分类栏默认自动折叠，鼠标悬停时展开</li>
                  <li>点击分类栏顶部的箭头按钮可以固定展开/折叠状态</li>
                  <li>分类项显示该分类下的书签数量</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Search Features */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium">3. 搜索功能</h3>
            <div className="space-y-3">
              <div className="bg-card rounded-xl p-5 border border-border/50">
                <h4 className="font-medium mb-2">默认搜索引擎</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>在搜索框中输入关键词，直接按回车键使用默认搜索引擎搜索</li>
                  <li>点击搜索框右侧的引擎图标可以切换搜索引擎</li>
                  <li>支持自定义添加更多搜索引擎</li>
                </ul>
              </div>
              
              <div className="bg-card rounded-xl p-5 border border-border/50">
                <h4 className="font-medium mb-2">搜索历史和建议</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>搜索框会记录您的搜索历史</li>
                  <li>输入关键词时会显示相关搜索建议</li>
                  <li>点击搜索历史项可以快速重新搜索</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Customization */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium">4. 个性化定制</h3>
            <div className="space-y-3">
              <div className="bg-card rounded-xl p-5 border border-border/50">
                <h4 className="font-medium mb-2">主题切换</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>系统支持自动、浅色和深色主题</li>
                  <li>主题会根据系统设置自动切换</li>
                  <li>书签卡片会根据主题自动调整样式</li>
                </ul>
              </div>
              
              <div className="bg-card rounded-xl p-5 border border-border/50">
                <h4 className="font-medium mb-2">自定义图标</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>对于没有图标的网站，可以使用自定义纯色图标</li>
                  <li>在添加或编辑书签时，选择 "自定义图标"</li>
                  <li>选择背景颜色和1-2个字符作为图标文字</li>
                  <li>生成个性化的纯色图标</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Tips and Tricks */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">使用技巧</h2>
          <div className="bg-accent/10 rounded-xl p-6">
            <h3 className="font-medium mb-3">提升效率的小技巧</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold shrink-0">💡</div>
                <p className="text-sm text-muted-foreground">使用键盘快捷键 Ctrl+T 打开新标签页，直接访问 TabHome</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold shrink-0">💡</div>
                <p className="text-sm text-muted-foreground">将 TabHome 设置为浏览器默认主页，每次打开浏览器都能快速访问</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold shrink-0">💡</div>
                <p className="text-sm text-muted-foreground">使用分类快速筛选书签，点击左侧分类栏中的分类名称</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold shrink-0">💡</div>
                <p className="text-sm text-muted-foreground">定期整理书签，删除不常用的网站，保持书签列表整洁</p>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">常见问题</h2>
          <div className="space-y-4">
            <div className="bg-card rounded-xl p-5 border border-border/50">
              <h3 className="font-medium mb-2">为什么某些网站没有图标？</h3>
              <p className="text-muted-foreground">有些网站可能没有设置正确的 favicon 图标，或者图标无法被自动获取。您可以使用自定义纯色图标功能来创建个性化图标。</p>
            </div>
            
            <div className="bg-card rounded-xl p-5 border border-border/50">
              <h3 className="font-medium mb-2">如何导出或备份我的书签？</h3>
              <p className="text-muted-foreground">目前 TabHome 支持自动云同步书签，您的书签会安全地存储在云端。导出功能将在后续版本中推出。</p>
            </div>
            
            <div className="bg-card rounded-xl p-5 border border-border/50">
              <h3 className="font-medium mb-2">为什么搜索框没有显示我的搜索引擎？</h3>
              <p className="text-muted-foreground">点击搜索框右侧的引擎图标，选择 "管理搜索引擎"，确保您的搜索引擎已添加并启用。</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">需要帮助？</h2>
          <p className="text-muted-foreground mb-6">如果您在使用过程中遇到问题，欢迎联系我们</p>
          <a 
            href="https://github.com/ShiyouQi888/TabHome/issues" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:shadow-lg transition-all"
          >
            提交反馈
          </a>
        </section>
      </div>
    </main>
  )
}