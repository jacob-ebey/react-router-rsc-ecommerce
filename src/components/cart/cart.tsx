import { graphql, readFragment } from "gql.tada";

import { getClient } from "@/lib/gql";
import { cn } from "@/lib/utils";

import { checkout, removeFromCart, setLineQuantity } from "./cart.actions";
import { CartForm, EmptyCart } from "./cart.client";
import { cartFragment } from "./cart.fagments";

export function CartSkeleton({ className }: { className?: string } = {}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 px-4 text-center",
        className
      )}
    >
      <div>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-10 w-10"
          aria-hidden="true"
        >
          <path d="M15.55 13c1.22 0 1.74-1.01 1.75-1.03l3.55-6.44c.23-.45.18-.84-.01-1.11-.18-.26-.51-.42-.84-.42H5.21l-.67-1.43c-.16-.35-.52-.57-.9-.57H2c-.55 0-1 .45-1 1s.45 1 1 1h1l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45z"></path>
          <circle cx="7" cy="20" r="2"></circle>
          <circle cx="17" cy="20" r="2"></circle>
        </svg>
      </div>
      <div>
        <h2 className="text-lg font-semibold">Loading cart...</h2>
        <p className="text-sm text-gray-600 mt-1">
          Please wait while we fetch your items
        </p>
      </div>
    </div>
  );
}

export async function Cart({
  cartId,
  sticky,
}: {
  cartId: string | undefined;
  sticky?: boolean;
}) {
  const client = getClient();

  const result = cartId ? await client.query(CartQuery, { cartId }) : undefined;
  const cart = result?.data?.cart;

  const cartContent = cart && readFragment(cartFragment, cart);

  if (!cartContent || cartContent.lines.nodes.length === 0) {
    return <EmptyCart />;
  }

  return (
    <CartForm
      cart={readFragment(cartFragment, cart)}
      checkoutAction={checkout}
      removeFromCartAction={removeFromCart}
      setLineQuantityAction={setLineQuantity}
      sticky={sticky}
    />
  );
}

export const CartQuery = graphql(
  `
    query Cart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFragment
      }
    }
  `,
  [cartFragment]
);
