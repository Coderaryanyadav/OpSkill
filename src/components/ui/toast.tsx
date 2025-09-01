"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// Types
type ToastVariantType = "default" | "destructive" | "success" | "warning" | "info"

// Toast variants
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "border-destructive bg-destructive text-destructive-foreground",
        success: "border-green-500 bg-green-50 text-green-800 dark:bg-green-900/90 dark:text-green-100",
        warning: "border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-900/90 dark:text-amber-100",
        info: "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900/90 dark:text-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Component props
export interface ToastActionProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> {
  altText: string
  children: React.ReactNode
}

export interface ToastProps extends Omit<React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>, 'title'> {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement<ToastActionProps>
  actionAltText?: string
  variant?: ToastVariantType
  icon?: React.ReactNode
  duration?: number
  onOpenChange?: (open: boolean) => void
  className?: string
}

// Components
const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

// Action element type for use in toast props
export type ToastActionElement = React.ReactElement<ToastActionProps>

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ 
  className, 
  variant, 
  title,
  description,
  action, 
  actionAltText = 'Action', 
  icon,
  children,
  ...props 
}, ref) => {
  const actionWithProps = React.isValidElement(action)
    ? React.cloneElement(action, {
        altText: actionAltText,
        className: cn("ml-auto", action.props.className)
      } as ToastActionProps)
    : null

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {icon && <div className="mr-3 flex-shrink-0">{icon}</div>}
      <div className="grid flex-1 gap-1">
        {title && <ToastTitle>{title}</ToastTitle>}
        {description && <ToastDescription>{description}</ToastDescription>}
        {children}
      </div>
      {actionWithProps && (
        <div className="ml-auto flex items-center">
          {actionWithProps}
        </div>
      )}
      <ToastClose />
    </ToastPrimitives.Root>
  )
})
Toast.displayName = "Toast"

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  ToastActionProps
>(({ className, altText = "Close", children, ...props }, ref) => {
  // Ensure we're not passing altText to the underlying button element
  const { onClick, ...restProps } = props as any;
  
  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
        className
      )}
      aria-label={altText}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </ToastPrimitives.Action>
  )
})
ToastAction.displayName = "ToastAction"

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    aria-label="Close"
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold [grid-area:_title]", className)}
    {...props}
  />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 [grid-area:_description]", className)}
    {...props}
  />
))
ToastDescription.displayName = "ToastDescription"

// Export components with consistent naming
export const Provider = ToastProvider
export const Viewport = ToastViewport
export const Root = Toast
export const Title = ToastTitle
export const Description = ToastDescription
export const Close = ToastClose
export const Action = ToastAction

// Export types
export type { ToastVariantType as ToastVariant }
