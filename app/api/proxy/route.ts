import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  console.log('Proxy API received request for URL:', url)

  if (!url) {
    console.error('No URL provided in proxy request')
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    // 验证URL格式
    new URL(url)
    console.log('URL validation passed:', url)
  } catch (error) {
    console.error('URL validation failed:', error)
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
  }

  try {
    console.log('Fetching content from:', url)
    
    // 获取目标网站内容
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      // 10秒超时
      signal: AbortSignal.timeout(10000),
    })
    
    console.log('Target site response status:', response.status)

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch: ${response.status}` }, { status: response.status })
    }

    const html = await response.text()
    console.log('Received HTML content, length:', html.length)
    
    // 提取标题
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : null
    console.log('Extracted title:', title)
    
    // 提取描述
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    const description = descMatch ? descMatch[1].trim() : null
    
    // 提取图标
    const iconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    let icon = iconMatch ? iconMatch[1].trim() : null
    console.log('Extracted icon:', icon)
    
    // 如果图标是相对路径，转换为绝对路径
    if (icon && !icon.startsWith('http')) {
      const urlObj = new URL(url)
      if (icon.startsWith('/')) {
        icon = `${urlObj.protocol}//${urlObj.host}${icon}`
      } else {
        icon = `${urlObj.protocol}//${urlObj.host}/${icon}`
      }
      console.log('Converted icon to absolute URL:', icon)
    }

    const result = {
      title,
      description,
      icon,
      html: html.substring(0, 500), // 只返回前500字符用于调试
    }
    console.log('Returning result:', JSON.stringify(result, null, 2))
    
    return NextResponse.json(result)

  } catch (error) {
    console.error('Proxy fetch error:', error)
    
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 408 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 配置API路由的运行时间
export const runtime = 'nodejs'
export const maxDuration = 30