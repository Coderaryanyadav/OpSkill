"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { 
  Toast, 
  ToastClose, 
  ToastDescription, 
  ToastProvider, 
  ToastTitle, 
  ToastViewport, 
  ToastAction,
  type ToastActionElement,
  type ToastProps,
  type ToastVariant 
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export interface ToasterToast extends Omit<ToastProps, 'id' | 'title' | 'description'> {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
    altText?: string
  }
  variant?: ToastVariant
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ 
        id, 
        title, 
        description, 
        action, 
        variant = "default",
        className,
        ...props 
      }) => (
        <Toast 
          key={id} 
          variant={variant}
          className={cn("relative", className)}
          {...props}
        >
          <div className="grid gap-1 flex-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </div>
          {action && (
            <ToastAction 
              altText={action.altText || action.label}
              onClick={action.onClick}
              className="ml-auto"
            >
              {action.label}
            </ToastAction>
          )}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
