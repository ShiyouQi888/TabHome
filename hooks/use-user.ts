"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase.auth.getUser()
        
        if (error) {
          throw error
        }
        
        setUser(data.user)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('获取用户信息失败'))
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()

    // 监听认证状态变化
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, isLoading, error }
}