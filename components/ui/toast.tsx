"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive" | "success"
  onDismiss: (id: string) => void
}

export function Toast({ id, title, description, variant = "default", onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss(id), 300)
  }

  return (
    <div
      className={`glass-card p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      } ${
        variant === "destructive"
          ? "border-red-500/30 bg-red-950/30"
          : variant === "success"
            ? "border-green-500/30 bg-green-950/30"
            : "border-primary/30"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3
            className={`font-medium ${
              variant === "destructive" ? "text-red-500" : variant === "success" ? "text-green-500" : "text-primary"
            }`}
          >
            {title}
          </h3>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleDismiss}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function ToastContainer({ toasts, dismiss }: { toasts: any[]; dismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 max-w-xs w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onDismiss={dismiss}
        />
      ))}
    </div>
  )
}
