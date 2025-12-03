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
      return <Sun className="h-6 w-6 text-yellow-500" />
    case "cloudy":
      return <Cloud className="h-6 w-6 text-gray-500" />
    case "rainy":
    case "drizzle":
      return <CloudRain className="h-6 w-6 text-blue-500" />
    case "snowy":
    case "snow":
      return <CloudSnow className="h-6 w-6 text-blue-300" />
    default:
      return <Sun className="h-6 w-6 text-yellow-500" />
  }
}

export function Weather() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 22,
    condition: "sunny",
    humidity: 45,
    windSpeed: 12,
    location: "北京",
  })

  // 模拟天气数据更新
  useEffect(() => {
    const updateWeather = () => {
      // 这里可以替换为真实的天气API调用
      setWeather(prev => ({
        ...prev,
        temp: Math.floor(Math.random() * 15) + 15, // 15-30°C
        condition: ['sunny', 'cloudy', 'rainy', 'snowy'][Math.floor(Math.random() * 4)],
      }))
    }

    const interval = setInterval(updateWeather, 60000) // 每分钟更新一次
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground transition-all hover:text-foreground">
      <div className="flex items-center gap-2">
        {getWeatherIcon(weather.condition)}
        <span className="font-medium">{weather.temp}°</span>
      </div>
      <div className="hidden sm:flex items-center gap-1">
        <span className="capitalize">{weather.condition}</span>
        <span className="mx-1">|</span>
        <span>{weather.location}</span>
      </div>
    </div>
  )
}