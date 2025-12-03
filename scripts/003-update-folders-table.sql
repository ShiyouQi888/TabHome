-- 为文件夹表添加图标字段
ALTER TABLE folders ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'Folder';
