"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface BookmarkIconProps {
  title: string
  iconUrl?: string
  className?: string
  size?: "sm" | "md" | "lg"
  onLoad?: () => void
}

export function BookmarkIcon({ title, iconUrl, className, size = "md", onLoad }: BookmarkIconProps) {
  const [imageError, setImageError] = useState(false)

  const getInitials = (title: string) => {
    return title.charAt(0).toUpperCase()
  }

  const getGradientFromTitle = (title: string) => {
    const gradients = [
      "from-rose-500 to-pink-500",
      "from-orange-500 to-amber-500", 
      "from-emerald-500 to-teal-500",
      "from-cyan-500 to-blue-500",
      "from-blue-500 to-indigo-500",
      "from-violet-500 to-purple-500",
      "from-fuchsia-500 to-pink-500",
      "from-lime-500 to-green-500",
    ]
    const index = title.charCodeAt(0) % gradients.length
    return gradients[index]
  }

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-9 w-9",
    lg: "h-12 w-12"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl"
  }

  return (
    <>
      {iconUrl && !imageError ? (
        <img
          src={iconUrl}
          alt={title}
          className={cn(
            sizeClasses[size],
            "object-contain rounded-lg",
            className
          )}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          onLoad={onLoad}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center text-white font-semibold bg-gradient-to-br",
            sizeClasses[size],
            textSizeClasses[size],
            getGradientFromTitle(title),
            className
          )}
        >
          {getInitials(title)}
        </div>
      )}
    </>
  )
}