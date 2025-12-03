export interface Bookmark {
  id: string
  user_id: string
  title: string
  url: string
  icon: string | null
  folder_id: string | null
  position: number
  created_at: string
  updated_at: string
}

export interface Folder {
  id: string
  user_id: string
  name: string
  color: string
  icon: string | null
  position: number
  created_at: string
  updated_at: string
}

export const FOLDER_COLORS = [
  { name: "蓝色", value: "#3b82f6" },
  { name: "紫色", value: "#8b5cf6" },
  { name: "粉色", value: "#ec4899" },
  { name: "红色", value: "#ef4444" },
  { name: "橙色", value: "#f97316" },
  { name: "黄色", value: "#eab308" },
  { name: "绿色", value: "#22c55e" },
  { name: "青色", value: "#06b6d4" },
  { name: "靛蓝", value: "#6366f1" },
]

export const FOLDER_ICONS = [
  "Folder",
  "Star",
  "Heart",
  "Briefcase",
  "Code",
  "Music",
  "Video",
  "Image",
  "Book",
  "ShoppingBag",
  "Gamepad2",
  "Globe",
]

export interface SearchEngine {
  id: string
  user_id: string
  name: string
  url: string
  icon: string | null
  is_default: boolean
  is_builtin: boolean
  position: number
  created_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  theme: "light" | "dark" | "system"
  background_url: string | null
  show_greeting: boolean
  columns: number
  created_at: string
  updated_at: string
}

export const DEFAULT_SEARCH_ENGINES: Omit<SearchEngine, "id" | "user_id" | "created_at">[] = [
  {
    name: "Google",
    url: "https://www.google.com/search?q=",
    icon: "https://www.google.com/favicon.ico",
    is_default: true,
    is_builtin: true,
    position: 0,
  },
  {
    name: "Bing",
    url: "https://www.bing.com/search?q=",
    icon: "https://www.bing.com/favicon.ico",
    is_default: false,
    is_builtin: true,
    position: 1,
  },
  {
    name: "DuckDuckGo",
    url: "https://duckduckgo.com/?q=",
    icon: "https://duckduckgo.com/favicon.ico",
    is_default: false,
    is_builtin: true,
    position: 2,
  },
  {
    name: "Baidu",
    url: "https://www.baidu.com/s?wd=",
    icon: "https://www.baidu.com/favicon.ico",
    is_default: false,
    is_builtin: true,
    position: 3,
  },
]
