"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button-variants"

function Button({
  className,
  variant = "default",
  size = "default",
  asChild,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const buttonClass = cn(buttonVariants({ variant, size, className }));

  if (asChild) {
    return (
      <ButtonPrimitive
        data-slot="button"
        render={children as any}
        nativeButton={false}
        className={buttonClass}
        suppressHydrationWarning
        {...props}
      />
    )
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      nativeButton={true}
      className={buttonClass}
      suppressHydrationWarning
      {...props}
    >
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
