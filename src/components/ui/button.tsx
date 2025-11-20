"use client";

import { Button as AriaButton } from "react-aria-components";

import { cn } from "@/lib/utils";

export const buttonStyles = ({ size }: { size?: "sm" } = {}) =>
  cn(
    // Base styles
    "inline-block text-center rounded-none border-2 border-border bg-text px-4 py-2 text-background transition-colors cursor-pointer active:scale-95 outline-offset-3",
    "hover:bg-transparent hover:text-text",
    // Hover/selected styles
    "data-selected:bg-transparent data-selected:text-text data-selected:hover:bg-transparent data-selected:hover:text-text",
    // Pending styles
    "data-pending:opacity-75 data-pending:cursor-wait data-pending:scale-100 data-pending:hover:bg-text data-pending:hover:text-background",
    // Disabled styles
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:bg-text disabled:hover:text-background",
    {
      "px-3 py-1.5 text-sm": size === "sm",
    }
  );

export function Button({
  className,
  size,
  ...props
}: React.ComponentProps<typeof AriaButton> & {
  size?: "sm";
  isSelected?: boolean;
}) {
  return (
    <AriaButton
      className={cn(buttonStyles({ size }), className)}
      data-selected={props.isSelected ? true : undefined}
      {...props}
    />
  );
}
