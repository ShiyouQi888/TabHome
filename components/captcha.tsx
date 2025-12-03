"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface CaptchaProps {
  length?: number
  onVerify: (isValid: boolean) => void
}

export function Captcha({ length = 6, onVerify }: CaptchaProps) {
  const [captcha, setCaptcha] = useState("")
  const [userInput, setUserInput] = useState("")
  const [isValid, setIsValid] = useState<boolean | null>(null)

  // 生成随机验证码
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // 排除容易混淆的字符
    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptcha(result)
    setUserInput("")
    setIsValid(null)
  }

  // 初始化验证码
  useEffect(() => {
    generateCaptcha()
  }, [length])

  // 验证输入
  const handleVerify = () => {
    const isValid = userInput.toUpperCase() === captcha
    setIsValid(isValid)
    onVerify(isValid)
  }

  // 输入变化时重置验证状态
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value)
    setIsValid(null)
  }

  // 点击验证码区域刷新
  const handleCaptchaClick = () => {
    generateCaptcha()
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-center">
        {/* Captcha Display */}
        <div 
          className="flex items-center justify-center h-10 w-32 bg-background border border-border rounded-md cursor-pointer select-none font-mono text-lg font-bold text-primary shadow-sm hover:border-primary/50 transition-colors"
          onClick={handleCaptchaClick}
        >
          {captcha}
        </div>
        
        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-muted-foreground hover:text-foreground"
          onClick={generateCaptcha}
        >
          <RefreshCw className="h-5 w-5" />
          <span className="sr-only">刷新验证码</span>
        </Button>
      </div>
      
      {/* Input */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="captcha" className="text-sm font-medium">验证码</label>
          <span className="text-xs text-muted-foreground">点击图片刷新</span>
        </div>
        <div className="flex gap-3">
          <input
            id="captcha"
            type="text"
            placeholder={`请输入${length}位验证码`}
            required
            maxLength={length}
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button
            variant="primary"
            size="sm"
            className="h-10"
            onClick={handleVerify}
          >
            验证
          </Button>
        </div>
      </div>
      
      {/* Validation Result */}
      {isValid !== null && (
        <p className={`text-sm ${isValid ? "text-green-500" : "text-destructive"} text-center`}>
          {isValid ? "验证码正确" : "验证码错误，请重新输入"}
        </p>
      )}
    </div>
  )
}