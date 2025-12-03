"use client"

import { useState, useEffect } from "react"
import { Cloud, Sun, CloudRain, CloudSnow, Wind, ThermometerSun } from "lucide-react"

interface WeatherData {
  temp: number
  condition: string
  humidity: number
  windSpeed: number
  location: string
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "sunny":
    case "clear":
      return <Sun className="h-8 w-8 text-yellow-500" />
    case "cloudy":
      return <Cloud className="h-8 w-8 text-gray-500" />
    case "rainy":
    case "drizzle":
      return <CloudRain className="h-8 w-8 text-blue-500" />
    case "snowy":
    case "snow":
      return <CloudSnow className="h-8 w-8 text-blue-300" />
    default:
      return <Sun className="h-8 w-8 text-yellow-500" />
  }
}

export function Weather() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 22,
    condition: "sunny",
    humidity: 45,
    windSpeed: 12,
    location: "获取中...",
  })

  useEffect(() => {
    // 获取地理位置 - 使用简单的IP定位
    const getLocation = async () => {
      try {
        // 使用IP定位服务，添加超时和CORS处理
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时
        
        const response = await fetch('https://ipapi.co/json/', {
          signal: controller.signal,
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          }
        })
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        if (data.city) {
          setWeather(prev => ({ ...prev, location: data.city }))
        } else {
          setWeather(prev => ({ ...prev, location: '地球' }))
        }
      } catch (error) {
        console.warn('获取地理位置失败:', error instanceof Error ? error.message : '未知错误')
        // 如果IP定位失败，尝试其他服务
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时
          
          const response = await fetch('https://freegeoip.app/json/', {
            signal: controller.signal,
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
            }
          })
          clearTimeout(timeoutId)
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const data = await response.json()
          setWeather(prev => ({ ...prev, location: data.city || '地球' }))
        } catch (fallbackError) {
          console.warn('备用IP定位也失败了:', fallbackError instanceof Error ? fallbackError.message : '未知错误')
          setWeather(prev => ({ ...prev, location: '地球' }))
        }
      }
    }

    getLocation()

    // 模拟天气数据更新
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: Math.floor(Math.random() * 15) + 15,
        humidity: Math.floor(Math.random() * 30) + 50,
        windSpeed: Math.floor(Math.random() * 10) + 5
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-4 text-base text-muted-foreground transition-all hover:text-foreground">
      <div className="flex items-center gap-3">
        {getWeatherIcon(weather.condition)}
        <span className="font-medium">{weather.temp}°</span>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        <span className="capitalize">{weather.condition}</span>
        <span className="mx-2">|</span>
        <span>{weather.location}</span>
      </div>
    </div>
  )
}