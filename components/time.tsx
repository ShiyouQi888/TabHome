"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar } from "lucide-react"

export function Time() {
  const [currentTime, setCurrentTime] = useState(new Date())

  // 实时更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 格式化时间
  const formattedTime = currentTime.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  // 格式化日期
  const formattedDate = currentTime.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground transition-all hover:text-foreground">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5" />
        <span className="font-medium">{formattedTime}</span>
      </div>
      <div className="hidden sm:flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        <span>{formattedDate}</span>
      </div>
    </div>
  )
}