import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Parameters<typeof clsx>[number][]) {
  return twMerge(clsx(...inputs));
}

export function formatPrice({
  amount,
  currencyCode,
}: {
  amount: unknown;
  currencyCode: string;
}) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(String(amount)));
}
