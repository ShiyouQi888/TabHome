"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Globe } from "lucide-react"
import { Captcha } from "@/components/captcha"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isCaptchaValid, setIsCaptchaValid] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("密码至少需要6个字符")
      setIsLoading(false)
      return
    }

    // Validate captcha
    if (!isCaptchaValid) {
      setError("请先验证验证码")
      setIsLoading(false)
      return
    }

    // Validate terms agreement
    if (!agreeTerms) {
      setError("请同意用户协议和隐私政策")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "注册失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">TabHome</span>
          </div>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">创建账户</CardTitle>
              <CardDescription>注册以开始使用 TabHome</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">密码</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="至少6个字符"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">确认密码</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  {/* Captcha */}
                  <Captcha onVerify={setIsCaptchaValid} />
                  
                  {/* Terms Agreement */}
                  <div className="flex items-start gap-2">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="terms" className="text-xs text-muted-foreground">
                      注册即表示您同意我们的
                      <Link href="/terms" className="text-primary hover:text-primary/80 underline underline-offset-2">
                        使用条款
                      </Link> 和 
                      <Link href="/privacy" className="text-primary hover:text-primary/80 underline underline-offset-2">
                        隐私政策
                      </Link>
                    </label>
                  </div>
                  
                  {error && <p className="text-sm text-destructive text-center">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "注册中..." : "注册"}
                  </Button>
                </div>
                <div className="mt-6 text-center text-sm">
                  已有账户？{" "}
                  <Link href="/auth/login" className="text-primary underline underline-offset-4 hover:text-primary/80">
                    立即登录
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              返回首页
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
