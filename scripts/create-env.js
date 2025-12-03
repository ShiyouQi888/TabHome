#!/usr/bin/env node

/**
 * TabHome 环境配置文件生成器
 * 运行: node scripts/create-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return colors[color] + text + colors.reset;
}

function printHeader() {
  console.log('\n' + colorize('═'.repeat(60), 'cyan'));
  console.log(colorize('  TabHome 环境配置文件生成器', 'bright'));
  console.log(colorize('═'.repeat(60), 'cyan') + '\n');
}

function printStep(step, description) {
  console.log(colorize(`[步骤 ${step}]`, 'yellow') + ` ${description}`);
}

function printSuccess(message) {
  console.log(colorize('✓', 'green') + ` ${message}`);
}

function printWarning(message) {
  console.log(colorize('⚠', 'yellow') + ` ${message}`);
}

function printError(message) {
  console.log(colorize('✗', 'red') + ` ${message}`);
}

function askQuestion(question, defaultValue = '') {
  return new Promise((resolve) => {
    const prompt = defaultValue 
      ? `${question} (${colorize(defaultValue, 'cyan')}): `
      : `${question}: `;
    
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

function askYesNo(question, defaultValue = true) {
  return new Promise((resolve) => {
    const defaultText = defaultValue ? 'Y/n' : 'y/N';
    rl.question(`${question} (${defaultText}): `, (answer) => {
      const normalized = answer.trim().toLowerCase();
      if (normalized === '') {
        resolve(defaultValue);
      } else {
        resolve(normalized === 'y' || normalized === 'yes');
      }
    });
  });
}

function generateRandomKey(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function main() {
  try {
    printHeader();
    
    // 检查是否已存在 .env.local 文件
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      printWarning('检测到已存在的 .env.local 文件');
      const overwrite = await askYesNo('是否覆盖现有文件？', false);
      if (!overwrite) {
        console.log(colorize('\n操作已取消。', 'yellow'));
        rl.close();
        return;
      }
    }

    printStep(1, '基础配置');
    console.log(colorize('\n📋 基础信息配置', 'bright'));
    
    const appName = await askQuestion('应用名称', 'TabHome');
    const appUrl = await askQuestion('应用URL', 'http://localhost:3000');
    const supportEmail = await askQuestion('支持邮箱', 'blacklaw@foxmail.com');

    printStep(2, '数据库配置');
    console.log(colorize('\n🗄️ Supabase 数据库配置', 'bright'));
    console.log(colorize('提示：登录 https://supabase.com/ 获取以下信息', 'cyan'));
    
    const supabaseUrl = await askQuestion('Supabase 项目 URL');
    const supabaseAnonKey = await askQuestion('Supabase anon public 密钥');
    const supabaseServiceKey = await askQuestion('Supabase service_role 密钥');

    printStep(3, '可选配置');
    console.log(colorize('\n🔧 可选功能配置', 'bright'));
    
    const enableWeather = await askYesNo('是否启用天气功能？', true);
    let weatherApiKey = '';
    let weatherApiUrl = 'https://api.openweathermap.org/data/2.5';
    
    if (enableWeather) {
      printWarning('需要 OpenWeatherMap API 密钥');
      console.log(colorize('获取地址：https://openweathermap.org/api', 'cyan'));
      weatherApiKey = await askQuestion('OpenWeatherMap API 密钥', '');
    }

    const enableAnalytics = await askYesNo('是否启用 Google Analytics？', false);
    let gaTrackingId = '';
    
    if (enableAnalytics) {
      printWarning('需要 Google Analytics 跟踪 ID');
      console.log(colorize('获取地址：https://analytics.google.com/', 'cyan'));
      gaTrackingId = await askQuestion('Google Analytics 跟踪 ID (G-XXXXXXXXXX)', '');
    }

    const enableSentry = await askYesNo('是否启用 Sentry 错误监控？', false);
    let sentryDsn = '';
    
    if (enableSentry) {
      printWarning('需要 Sentry DSN');
      console.log(colorize('获取地址：https://sentry.io/', 'cyan'));
      sentryDsn = await askQuestion('Sentry DSN', '');
    }

    printStep(4, '安全密钥生成');
    console.log(colorize('\n🔐 生成安全密钥', 'bright'));
    
    const sessionSecret = generateRandomKey(32);
    const jwtSecret = generateRandomKey(64);
    
    printSuccess('已生成安全密钥');

    printStep(5, '生成配置文件');
    
    // 构建环境文件内容
    let envContent = `# TabHome 环境配置文件
# 生成时间: ${new Date().toISOString()}
# 生成工具: TabHome 环境配置生成器

# =============================================================================
# 基础配置
# =============================================================================
NEXT_PUBLIC_APP_NAME=${appName}
NEXT_PUBLIC_APP_URL=${appUrl}
NEXT_PUBLIC_SUPPORT_EMAIL=${supportEmail}

# =============================================================================
# 数据库配置（必需）
# =============================================================================
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# =============================================================================
# 开发配置
# =============================================================================
NODE_ENV=development

# =============================================================================
# 安全密钥（自动生成）
# =============================================================================
SESSION_SECRET=${sessionSecret}
JWT_SECRET=${jwtSecret}
`;

    // 添加可选配置
    if (enableWeather && weatherApiKey) {
      envContent += `
# =============================================================================
# 天气API配置
# =============================================================================
NEXT_PUBLIC_WEATHER_API_KEY=${weatherApiKey}
NEXT_PUBLIC_WEATHER_API_URL=${weatherApiUrl}
`;
    }

    if (enableAnalytics && gaTrackingId) {
      envContent += `
# =============================================================================
# Google Analytics 配置
# =============================================================================
NEXT_PUBLIC_GA_TRACKING_ID=${gaTrackingId}
`;
    }

    if (enableSentry && sentryDsn) {
      envContent += `
# =============================================================================
# Sentry 错误监控配置
# =============================================================================
NEXT_PUBLIC_SENTRY_DSN=${sentryDsn}
`;
    }

    envContent += `
# =============================================================================
# 其他配置
# =============================================================================
# CORS 配置
CORS_ORIGIN=${appUrl}

# 速率限制
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

    // 写入文件
    fs.writeFileSync(envPath, envContent);
    
    printSuccess(`配置文件已生成: ${colorize('.env.local', 'cyan')}`);
    
    console.log('\n' + colorize('═'.repeat(60), 'green'));
    console.log(colorize('✅ 环境配置文件生成完成！', 'bright'));
    console.log(colorize('═'.repeat(60), 'green'));
    
    console.log('\n' + colorize('📋 下一步操作：', 'bright'));
    console.log('1. 运行数据库迁移脚本');
    console.log('2. 启动开发服务器: ' + colorize('npm run dev', 'cyan'));
    console.log('3. 访问: ' + colorize(appUrl, 'cyan'));
    
    console.log('\n' + colorize('🔧 数据库迁移：', 'bright'));
    console.log('请在 Supabase SQL Editor 中执行以下文件：');
    console.log('- ' + colorize('scripts/001-create-tables.sql', 'cyan'));
    console.log('- ' + colorize('scripts/002-fix-position-type.sql', 'cyan'));
    console.log('- ' + colorize('scripts/003-update-folders-table.sql', 'cyan'));
    
    console.log('\n' + colorize('📞 需要帮助？', 'bright'));
    console.log('联系邮箱: ' + colorize(supportEmail, 'cyan'));
    console.log('项目仓库: ' + colorize('https://github.com/ShiyouQi888/TabHome', 'cyan'));
    
    console.log('\n' + colorize('🎉 祝使用愉快！', 'green'));
    
  } catch (error) {
    printError(`发生错误: ${error.message}`);
    console.error(error);
  } finally {
    rl.close();
  }
}

// 运行主函数
if (require.main === module) {
  main();
}