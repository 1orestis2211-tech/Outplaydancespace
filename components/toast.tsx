"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastProps extends Toast {
  onClose: (id: string) => void
}

function ToastComponent({ id, type, title, description, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  }

  const iconColors = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600",
    warning: "text-yellow-600",
  }

  const Icon = icons[type]

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${colors[type]} animate-in slide-in-from-right-full`}
    >
      <Icon className={`w-5 h-5 mt-0.5 ${iconColors[type]}`} />
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        {description && <p className="text-sm mt-1 opacity-90">{description}</p>}
      </div>
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-black/10" onClick={() => onClose(id)}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}

let toastCounter = 0
const toastListeners: ((toasts: Toast[]) => void)[] = []
let toasts: Toast[] = []

export function addToast(toast: Omit<Toast, "id">) {
  const newToast = { ...toast, id: `toast-${++toastCounter}` }
  toasts = [...toasts, newToast]
  toastListeners.forEach((listener) => listener(toasts))
}

export function removeToast(id: string) {
  toasts = toasts.filter((toast) => toast.id !== id)
  toastListeners.forEach((listener) => listener(toasts))
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setCurrentToasts(newToasts)
    toastListeners.push(listener)
    return () => {
      const index = toastListeners.indexOf(listener)
      if (index > -1) toastListeners.splice(index, 1)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {currentToasts.map((toast) => (
        <ToastComponent key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  )
}
