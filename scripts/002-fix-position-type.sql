-- 修复 position 字段类型，从 INTEGER 改为 BIGINT 以支持 Date.now() 时间戳
ALTER TABLE bookmarks ALTER COLUMN position TYPE BIGINT;
ALTER TABLE folders ALTER COLUMN position TYPE BIGINT;
ALTER TABLE search_engines ALTER COLUMN position TYPE BIGINT;
