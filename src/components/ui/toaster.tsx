"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { 
  Root as Toast,
  Action as ToastAction,
  Close as ToastClose,
  Description as ToastDescription,
  Provider as ToastProvider,
  Title as ToastTitle,
  Viewport as ToastViewport,
  type ToastActionProps,
  type ToastVariant,
  type ToastProps
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export type ToasterToast = Omit<ToastProps, 'id' | 'title' | 'description' | 'action'> & {
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

const ToastActionButton = React.forwardRef<
  React.ElementRef<typeof ToastAction>,
  React.ComponentProps<typeof ToastAction> & { altText: string }
>(({ children, altText, ...props }, ref) => (
  <ToastAction ref={ref} altText={altText} {...props}>
    {children}
  </ToastAction>
))
ToastActionButton.displayName = "ToastActionButton"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ 
        id, 
        title, 
        description, 
        actionAltText, 
        action,
        variant = "default",
        className,
        ...props 
      }) => {
        // Ensure action has proper altText
        const actionProps = action ? {
          action: React.cloneElement(
            <ToastAction 
              altText={action.altText || action.label}
              onClick={action.onClick}
            >
              {action.label}
            </ToastAction>,
            {
              altText: action.altText || action.label
            }
          )
        } : {};

        return (
          <Toast
            key={id}
            variant={variant}
            className={cn(className)}
            actionAltText={actionAltText}
            {...props}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action && (
              <ToastAction 
                altText={action.altText || action.label}
                onClick={action.onClick}
              >
                {action.label}
              </ToastAction>
            )}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
