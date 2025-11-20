import { cn } from "@/lib/utils";

export function Grid({
  className,
  nested,
  ...props
}: React.ComponentProps<"div"> & { nested?: boolean }) {
  return (
    <div
      className={cn(
        "grid bg-border gap-0.5",
        { "border-2": !nested },
        className
      )}
      {...props}
    />
  );
}

export function GridCol({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("bg-background paper", className)} {...props} />;
}

export function GridRow({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid gap-0.5", className)} {...props} />;
}

const BREAKPOINT_CLASSES = {
  default: { hidden: "hidden", block: "block" },
  sm: { hidden: "sm:hidden", block: "sm:block" },
  md: { hidden: "md:hidden", block: "md:block" },
  lg: { hidden: "lg:hidden", block: "lg:block" },
  xl: { hidden: "xl:hidden", block: "xl:block" },
  "2xl": { hidden: "2xl:hidden", block: "2xl:block" },
} as const;

export function FillRow({
  cols: _cols,
  count,
}: {
  cols: number | ["default" | "sm" | "md" | "lg" | "xl" | "2xl", number][];
  count: number;
}) {
  if (typeof _cols === "number") {
    const cols = _cols;
    return (
      cols - (count % cols) < cols &&
      Array(cols - (count % cols))
        .fill(null)
        .map((_, index) => (
          <div key={`fill-${index}`} className={cn("bg-background")} />
        ))
    );
  }

  // Calculate fills needed per breakpoint
  const breakpointFills = _cols.map(([breakpoint, cols]) => ({
    breakpoint,
    fillCount: cols - (count % cols) < cols ? cols - (count % cols) : 0,
  }));

  // Get max fills needed across all breakpoints
  const maxFills = Math.max(...breakpointFills.map((bf) => bf.fillCount));

  if (maxFills === 0) return null;

  // Generate visibility classes for each fill div
  return Array(maxFills)
    .fill(null)
    .map((_, index) => {
      const visibilityClasses = breakpointFills.map(
        ({ breakpoint, fillCount }) => {
          const classes = BREAKPOINT_CLASSES[breakpoint];
          // Show this div if index < fillCount for this breakpoint
          return index < fillCount ? classes.block : classes.hidden;
        }
      );

      return (
        <div
          key={`fill-${index}`}
          className={cn("bg-background paper", ...visibilityClasses)}
        />
      );
    });
}
