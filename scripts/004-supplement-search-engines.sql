-- 补充常用搜索引擎数据
-- 为所有现有用户添加缺失的内置搜索引擎

-- Bing (为所有缺失的用户添加)
INSERT INTO search_engines (user_id, name, url, icon, is_default, is_builtin, position)
SELECT 
  u.id,
  'Bing',
  'https://www.bing.com/search?q=',
  'https://www.bing.com/favicon.ico',
  false,
  true,
  4
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM search_engines se 
  WHERE se.user_id = u.id AND se.name = 'Bing'
);

-- Yahoo (为所有缺失的用户添加)
INSERT INTO search_engines (user_id, name, url, icon, is_default, is_builtin, position)
SELECT 
  u.id,
  'Yahoo',
  'https://search.yahoo.com/search?p=',
  'https://www.yahoo.com/favicon.ico',
  false,
  true,
  5
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM search_engines se 
  WHERE se.user_id = u.id AND se.name = 'Yahoo'
);

-- DuckDuckGo (为所有缺失的用户添加)
INSERT INTO search_engines (user_id, name, url, icon, is_default, is_builtin, position)
SELECT 
  u.id,
  'DuckDuckGo',
  'https://duckduckgo.com/?q=',
  'https://duckduckgo.com/favicon.ico',
  false,
  true,
  6
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM search_engines se 
  WHERE se.user_id = u.id AND se.name = 'DuckDuckGo'
);

-- GitHub (为所有缺失的用户添加)
INSERT INTO search_engines (user_id, name, url, icon, is_default, is_builtin, position)
SELECT 
  u.id,
  'GitHub',
  'https://github.com/search?q=',
  'https://github.com/favicon.ico',
  false,
  true,
  7
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM search_engines se 
  WHERE se.user_id = u.id AND se.name = 'GitHub'
);

-- 注意：此SQL会自动为所有现有用户添加缺失的内置搜索引擎
-- 如果执行时出现重复键错误，可以忽略错误继续执行