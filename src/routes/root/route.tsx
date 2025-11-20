import { Suspense } from "react";
import { Outlet } from "react-router";

import { Cart, CartQuery, CartSkeleton } from "@/components/cart/cart";
import { cartFragment } from "@/components/cart/cart.fagments";
import { getClient } from "@/lib/gql";
import { getSession } from "@/lib/session";

import { Shell } from "./client";
import "./styles.css";
import { readFragment } from "gql.tada";

export { ErrorBoundary } from "./client";

export function Layout({ children }: { children: React.ReactNode }) {
  const client = getClient();
  const session = getSession();
  const cartId = session.get("cartId");

  const cartPromise = cartId ? client.query(CartQuery, { cartId }) : undefined;
  const cartCount = cartPromise
    ? Promise.resolve(
        cartPromise.then(
          (result) =>
            readFragment(cartFragment, result?.data?.cart)?.lines.nodes.reduce(
              (sum, line) => sum + line.quantity,
              0
            ) ?? 0
        )
      )
    : undefined;

  return (
    <Shell
      cart={
        <Suspense fallback={<CartSkeleton />}>
          <Cart cartId={cartId} sticky />
        </Suspense>
      }
      cartCount={cartCount}
    >
      {children}
    </Shell>
  );
}

export default function RootRoute() {
  return <Outlet />;
}
