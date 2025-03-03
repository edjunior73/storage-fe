import type * as React from "react"

export type ToastActionElement = React.ReactNode

export type ToastProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  autoClose?: number
  variant?: "default" | "destructive"
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  className?: string
}

