import { cn } from "@/lib/utils";

import "./dot-matrix.css";

export function DotMatrix({
  className,
  reveal = true,
  ...props
}: React.ComponentProps<"div"> & { reveal?: boolean }) {
  return (
    <div
      className={cn(
        "dot-matrix relative block overflow-hidden",
        "after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0",
        { "dot-matrix__reveal": reveal },
        className
      )}
      {...props}
    />
  );
}
