"use client";

import { useHydrated } from "@/components/ui/use-hydrated";
import { ViewTransition } from "react";
import { useNavigation } from "react-router";

export function ProductRouteTransition({
  children,
  handle,
}: {
  children?: React.ReactNode;
  handle: string;
}) {
  const hydrated = useHydrated();
  const navigation = useNavigation();

  console.log(navigation.state, hydrated);

  return (
    <ViewTransition name={hydrated ? undefined : `product-card--${handle}`}>
      {children}
    </ViewTransition>
  );
}
