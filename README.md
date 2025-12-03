# TabHome - 现代化浏览器主页

一个功能丰富的现代化浏览器主页，支持书签管理、分类、搜索和个性化定制。

## 🌟 功能特性

### 📑 书签管理
- ✅ 添加、编辑、删除书签
- ✅ 自定义书签图标和颜色
- ✅ 拖拽排序和分类管理
- ✅ 批量操作和快速搜索

### 🔍 智能搜索
- ✅ 多搜索引擎支持（Google、百度、必应等）
- ✅ 自定义搜索引擎管理
- ✅ 实时搜索建议和自动完成

### 🎨 个性化定制
- ✅ 深色/浅色主题切换
- ✅ 自定义背景图片和颜色
- ✅ 可配置的布局选项
- ✅ 响应式设计，支持移动端

### 📊 实用工具
- ✅ 实时天气显示
- ✅ 日期时间显示
- ✅ 网站分类管理
- ✅ 隐私模式和设置同步

## 🚀 快速开始

### 环境要求
- Node.js 18.0 或更高版本
- npm、yarn 或 pnpm 包管理器
- Git（用于版本控制）

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/ShiyouQi888/TabHome.git
cd TabHome
```

2. **安装依赖**
```bash
npm install
# 或者使用 yarn
yarn install
# 或者使用 pnpm
pnpm install
```

3. **环境配置**

创建 `.env.local` 文件并配置必要的环境变量：

```bash
# 复制示例环境文件
cp .env.example .env.local
```

编辑 `.env.local` 文件，添加您的配置：

```env
# 数据库配置（使用 Supabase）
NEXT_PUBLIC_SUPABASE_URL=您的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=您的Supabase匿名密钥
SUPABASE_SERVICE_ROLE_KEY=您的Supabase服务角色密钥

# 天气API配置（可选）
NEXT_PUBLIC_WEATHER_API_KEY=您的天气API密钥
NEXT_PUBLIC_WEATHER_API_URL=https://api.openweathermap.org/data/2.5

# 搜索引擎配置
NEXT_PUBLIC_SEARCH_ENGINE_API_KEY=您的搜索引擎API密钥

# 应用配置
NEXT_PUBLIC_APP_NAME=TabHome
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPPORT_EMAIL=blacklaw@foxmail.com

# 开发模式
NODE_ENV=development
```

4. **数据库设置**

如果您使用 Supabase，请执行以下 SQL 脚本创建必要的表结构：

```sql
-- 运行数据库迁移脚本
-- 文件位置：scripts/001-create-tables.sql
-- scripts/002-fix-position-type.sql
-- scripts/003-update-folders-table.sql
```

5. **启动开发服务器**
```bash
npm run dev
# 或者使用 yarn
yarn dev
# 或者使用 pnpm
pnpm dev
```

6. **访问应用**
打开浏览器访问：http://localhost:3000

## 📁 项目结构

```
TabHome/
├── app/                    # Next.js App Router 页面
│   ├── about/             # 关于页面
│   ├── auth/              # 认证相关页面
│   ├── dashboard/         # 仪表板页面
│   ├── privacy/          # 隐私政策页面
│   ├── settings/          # 设置页面
│   ├── terms/             # 服务条款页面
│   └── tutorial/          # 教程页面
├── components/             # React 组件
│   ├── ui/                # 基础UI组件
│   ├── add-bookmark-dialog.tsx
│   ├── bookmark-card.tsx
│   ├── bookmark-grid.tsx
│   ├── category-sidebar.tsx
│   ├── search-bar.tsx
│   └── ...
├── lib/                    # 工具函数和配置
│   ├── supabase/          # Supabase 客户端配置
│   ├── types.ts           # TypeScript 类型定义
│   └── utils.ts           # 工具函数
├── hooks/                  # 自定义React Hooks
├── scripts/               # 数据库脚本
├── public/                 # 静态资源
└── styles/                # 样式文件
```

## 🔧 开发指南

### 代码规范
- 使用 TypeScript 进行类型安全的开发
- 遵循 ESLint 和 Prettier 代码格式化规则
- 使用有意义的变量名和函数名
- 添加必要的注释说明复杂逻辑

### 提交规范
- 使用清晰的提交信息
- 遵循约定式提交规范（Conventional Commits）
- 示例：`feat: 添加书签搜索功能`、`fix: 修复移动端显示问题`

### 分支管理
- `main` 分支：主分支，包含稳定代码
- `develop` 分支：开发分支，集成新功能
- `feature/*` 分支：功能开发分支
- `hotfix/*` 分支：紧急修复分支

## 🚀 部署

### Vercel 部署（推荐）
1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署 main 分支

### 自建部署
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📋 环境变量说明

| 变量名 | 说明 | 是否必需 |
|--------|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务角色密钥 | ✅ |
| `NEXT_PUBLIC_WEATHER_API_KEY` | 天气 API 密钥 | ❌ |
| `NEXT_PUBLIC_APP_NAME` | 应用名称 | ❌ |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | 支持邮箱 | ❌ |

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'feat: 添加一些功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📝 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 💌 邮箱：blacklaw@foxmail.com
- 📧 技术支持：blacklaw@foxmail.com
- 💬 反馈建议：欢迎通过 GitHub Issues 提交

## 🙏 致谢

- [Next.js](https://nextjs.org/) - 强大的 React 框架
- [Supabase](https://supabase.com/) - 开源的 Firebase 替代方案
- [Tailwind CSS](https://tailwindcss.com/) - 实用的 CSS 框架
- [Vercel](https://vercel.com/) - 优秀的部署平台

---

⭐ 如果这个项目对您有帮助，请给个 Star 支持一下！

Made with ❤️ by ShiyouQi888