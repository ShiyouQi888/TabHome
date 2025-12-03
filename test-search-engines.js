// 测试搜索引擎查询的脚本
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

async function testSearchEngines() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    // 模拟用户登录（你需要替换为实际的用户令牌）
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('请先登录')
      return
    }
    
    console.log('当前用户ID:', user.id)
    
    // 测试1: 不使用用户过滤（应该只能看到部分数据）
    console.log('\n=== 测试1: 不使用用户过滤 ===')
    const { data: allEngines, error: error1 } = await supabase
      .from('search_engines')
      .select('*')
      .order('position', { ascending: true })
    
    if (error1) {
      console.log('错误:', error1.message)
    } else {
      console.log('获取到的搜索引擎数量:', allEngines.length)
      allEngines.forEach((engine, index) => {
        console.log(`${index + 1}. ${engine.name} (用户ID: ${engine.user_id})`)
      })
    }
    
    // 测试2: 使用用户过滤（应该能看到所有用户数据）
    console.log('\n=== 测试2: 使用用户过滤 ===')
    const { data: userEngines, error: error2 } = await supabase
      .from('search_engines')
      .select('*')
      .eq('user_id', user.id)
      .order('position', { ascending: true })
    
    if (error2) {
      console.log('错误:', error2.message)
    } else {
      console.log('获取到的搜索引擎数量:', userEngines.length)
      userEngines.forEach((engine, index) => {
        console.log(`${index + 1}. ${engine.name} (默认: ${engine.is_default})`)
      })
    }
    
  } catch (error) {
    console.error('测试失败:', error)
  }
}

testSearchEngines()