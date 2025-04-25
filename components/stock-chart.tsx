"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartArea, ChartLine } from "@/components/ui/chart"
import { AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface StockChartProps {
  symbol: string
}

export function StockChart({ symbol }: StockChartProps) {
  const [timeframe, setTimeframe] = useState("1D")
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>([])

  useEffect(() => {
    // Generate new chart data when symbol or timeframe changes
    generateChartData()
  }, [symbol, timeframe])

  const generateChartData = () => {
    const data = []
    let baseValue = 100 + Math.random() * 100
    const range = baseValue * 0.2
    let points = 24

    switch (timeframe) {
      case "1W":
        points = 7
        break
      case "1M":
        points = 30
        break
      case "3M":
        points = 90
        break
      case "1Y":
        points = 12
        break
      case "All":
        points = 60
        break
      default:
        points = 24
    }

    for (let i = 0; i < points; i++) {
      // Add some randomness but with a trend
      const trend = Math.sin((i / points) * Math.PI) * range * 0.5
      const randomness = Math.random() * range * 2 - range
      const value = baseValue + trend + randomness

      let timeLabel
      if (timeframe === "1D") {
        timeLabel = `${i}:00`
      } else if (timeframe === "1W") {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        timeLabel = days[i % 7]
      } else if (timeframe === "1M" || timeframe === "3M") {
        timeLabel = `Day ${i + 1}`
      } else {
        timeLabel = `Month ${i + 1}`
      }

      data.push({
        time: timeLabel,
        value: Number.parseFloat(value.toFixed(2)),
      })

      // Update base value for next point to create a somewhat realistic chart
      baseValue = value
    }

    setChartData(data)
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-1">
          {["1D", "1W", "1M", "3M", "1Y", "All"].map((time) => (
            <Button
              key={time}
              variant="ghost"
              size="sm"
              className={`px-2 py-1 h-auto text-xs ${
                timeframe === time ? "text-primary bg-primary/10" : "text-muted-foreground"
              }`}
              onClick={() => setTimeframe(time)}
            >
              {time}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[150px]">
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffd700" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ffd700" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#888" }}
                tickFormatter={(value) => value}
                minTickGap={30}
              />
              <YAxis
                domain={["dataMin - 5", "dataMax + 5"]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#888" }}
                tickFormatter={(value) => `$${value}`}
                width={40}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background/80 backdrop-blur-sm border border-border p-2 rounded-md shadow-md">
                        <p className="text-sm font-medium">{`$${payload[0].value}`}</p>
                        <p className="text-xs text-muted-foreground">{payload[0].payload.time}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <ChartArea dataKey="value" stroke="#ffd700" fill="url(#colorValue)" />
              <ChartLine type="monotone" dataKey="value" stroke="#ffd700" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
