# TabHome 安装配置指南

本指南将帮助您完成 TabHome 项目的完整安装和配置过程。

## 📋 目录

1. [环境准备](#环境准备)
2. [项目安装](#项目安装)
3. [数据库配置](#数据库配置)
4. [环境变量配置](#环境变量配置)
5. [常见问题解决](#常见问题解决)
6. [联系支持](#联系支持)

## 🛠️ 环境准备

### 必需软件

1. **Node.js** (版本 18.0 或更高)
   - 下载地址：https://nodejs.org/
   - 验证安装：`node --version`

2. **Git** (用于版本控制)
   - 下载地址：https://git-scm.com/
   - 验证安装：`git --version`

3. **代码编辑器** (推荐)
   - Visual Studio Code：https://code.visualstudio.com/
   - WebStorm：https://www.jetbrains.com/webstorm/

### 可选工具

1. **包管理器** (选择其一)
   - npm (Node.js 自带)
   - yarn：`npm install -g yarn`
   - pnpm：`npm install -g pnpm`

2. **数据库** (推荐使用 Supabase)
   - Supabase 账号：https://supabase.com/

## 📦 项目安装

### 1. 克隆项目

```bash
# 使用 HTTPS
git clone https://github.com/ShiyouQi888/TabHome.git

# 或者使用 SSH
git clone git@github.com:ShiyouQi888/TabHome.git

# 进入项目目录
cd TabHome
```

### 2. 安装依赖

```bash
# 使用 npm
npm install

# 或者使用 yarn
yarn install

# 或者使用 pnpm
pnpm install
```

### 3. 验证安装

```bash
# 运行开发服务器
npm run dev

# 访问 http://localhost:3000
# 如果页面正常显示，说明安装成功
```

## 🗄️ 数据库配置

### 使用 Supabase (推荐)

#### 1. 创建 Supabase 账号

1. 访问 https://supabase.com/
2. 点击 "Start your project"
3. 使用 GitHub 或邮箱注册

#### 2. 创建新项目

1. 登录 Supabase 控制台
2. 点击 "New project"
3. 填写项目信息：
   - Project name: `tabhome`
   - Database Password: 设置强密码并保存
   - Region: 选择最近的地区

#### 3. 获取连接信息

1. 等待项目创建完成（约 2-3 分钟）
2. 进入项目后，点击左侧菜单 "Settings" → "API"
3. 记录以下信息：
   - Project URL: `https://your-project.supabase.co`
   - anon public: 复制这个密钥
   - service_role: 复制这个密钥（需要点击 reveal）

#### 4. 创建数据库表

1. 点击左侧菜单 "SQL Editor"
2. 依次执行以下 SQL 脚本：

```sql
-- 运行 scripts/001-create-tables.sql
-- 然后运行 scripts/002-fix-position-type.sql
-- 最后运行 scripts/003-update-folders-table.sql
```

或者直接复制粘贴 SQL 内容执行。

### 使用其他数据库

如果您想使用其他 PostgreSQL 数据库，请确保：
- 支持 UUID 类型
- 支持 JSONB 类型
- 支持行级安全策略 (RLS)

## ⚙️ 环境变量配置

### 1. 创建环境文件

```bash
# 复制示例文件
cp .env.example .env.local
```

### 2. 配置必需变量

编辑 `.env.local` 文件，填写以下必需信息：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# 支持邮箱
NEXT_PUBLIC_SUPPORT_EMAIL=blacklaw@foxmail.com
```

### 3. 可选配置

根据需要添加其他配置：

```env
# 天气 API (可选)
NEXT_PUBLIC_WEATHER_API_KEY=your-weather-api-key

# Google Analytics (可选)
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# Sentry 错误监控 (可选)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io
```

### 4. 获取 API 密钥

#### 天气 API (OpenWeatherMap)

1. 访问 https://openweathermap.org/api
2. 注册免费账户
3. 验证邮箱
4. 获取 API 密钥
5. 免费套餐支持 1000 次调用/天

#### Google Analytics

1. 访问 https://analytics.google.com/
2. 创建新的分析属性
3. 获取跟踪 ID (格式: G-XXXXXXXXXX)

#### Sentry

1. 访问 https://sentry.io/
2. 创建新项目
3. 在项目设置中获取 DSN

## 🔧 验证配置

### 1. 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

### 2. 测试功能

1. 访问 http://localhost:3000
2. 尝试添加书签
3. 检查控制台是否有错误
4. 测试搜索功能

### 3. 检查数据库连接

1. 在 Supabase 控制台查看数据
2. 确认表中有数据插入
3. 检查行级安全策略是否生效

## 🐛 常见问题解决

### 问题 1: 数据库连接失败

**症状**: 页面加载但无法保存书签
**解决**:
1. 检查 `.env.local` 中的 Supabase URL 是否正确
2. 确认 anon key 没有拼写错误
3. 检查网络连接
4. 查看浏览器控制台错误信息

### 问题 2: 权限错误

**症状**: 403 错误，无法访问数据
**解决**:
1. 确认 service_role key 配置正确
2. 检查 Supabase 的行级安全策略
3. 验证用户认证状态

### 问题 3: 构建失败

**症状**: `npm run build` 报错
**解决**:
1. 检查 TypeScript 类型错误
2. 确认所有依赖安装完整
3. 清理缓存：`npm clean-install`

### 问题 4: 环境变量不生效

**症状**: 配置的环境变量不起作用
**解决**:
1. 确认文件名是 `.env.local` (不是 .env)
2. 重启开发服务器
3. 检查变量名拼写是否正确
4. 确认变量前缀正确 (NEXT_PUBLIC_)

### 问题 5: 天气功能不工作

**症状**: 天气信息不显示
**解决**:
1. 确认获取了 OpenWeatherMap API 密钥
2. 检查 API 调用限制是否用完
3. 验证城市名称是否正确

## 📞 联系支持

如果您遇到无法解决的问题，可以通过以下方式联系我们：

### 📧 邮箱支持
- **技术支持**: blacklaw@foxmail.com
- **一般咨询**: blacklaw@foxmail.com

### 🐛 GitHub Issues
1. 访问项目仓库：https://github.com/ShiyouQi888/TabHome
2. 点击 "Issues" 标签
3. 点击 "New Issue"
4. 描述您的问题，包括：
   - 错误信息截图
   - 复现步骤
   - 环境信息 (操作系统、Node.js 版本等)

### 💬 社区支持
- 在 Issues 中寻求帮助
- 查看已有的解决方案
- 与其他用户交流经验

## 📚 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [React 文档](https://react.dev/)

## 🎯 下一步

完成基础配置后，您可以：

1. **个性化定制**: 修改主题、布局、颜色
2. **功能扩展**: 添加新的组件和功能
3. **性能优化**: 优化加载速度和用户体验
4. **部署上线**: 将项目部署到生产环境

---

祝您使用愉快！🎉