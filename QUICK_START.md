# TabHome 快速开始指南

## 🚀 5分钟快速上手

### 步骤 1: 克隆项目
```bash
git clone https://github.com/ShiyouQi888/TabHome.git
cd TabHome
```

### 步骤 2: 安装依赖
```bash
npm install
```

### 步骤 3: 配置环境（交互式）
```bash
npm run setup
```

按照提示输入：
- Supabase 项目信息（必需）
- 天气 API 密钥（可选）
- Google Analytics（可选）

### 步骤 4: 数据库设置
1. 登录您的 Supabase 控制台
2. 打开 SQL Editor
3. 依次执行以下文件：
   - `scripts/001-create-tables.sql`
   - `scripts/002-fix-position-type.sql` 
   - `scripts/003-update-folders-table.sql`

### 步骤 5: 启动项目
```bash
npm run dev
```

访问 http://localhost:3000 🎉

## 📋 联系方式

- 📧 **邮箱**: blacklaw@foxmail.com
- 💬 **技术支持**: blacklaw@foxmail.com
- 🐛 **问题反馈**: https://github.com/ShiyouQi888/TabHome/issues

## 🔧 需要帮助？

查看完整文档：
- [详细安装指南](SETUP_GUIDE.md)
- [项目README](README.md)
- [环境配置示例](.env.example)

---

**祝您使用愉快！** ⭐ 别忘了给项目点个 Star 支持一下！