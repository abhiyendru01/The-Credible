import type React from "react"
export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full h-full">{children}</div>
}

export const ChartTooltip = ({ content }: { content: React.ReactNode }) => {
  return <>{content}</>
}

export const ChartArea = () => {
  return null
}

export const ChartLine = () => {
  return null
}
