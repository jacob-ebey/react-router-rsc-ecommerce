import { Cart } from "@/components/cart/cart";
import { getSession } from "@/lib/session";

export default async function CartRoute() {
  const session = getSession();
  const cartId = session.get("cartId");

  return (
    <>
      <title>Shopping Cart | Remix Store</title>
      <meta name="description" content="View and manage your shopping cart." />

      <Cart cartId={cartId} />
    </>
  );
}
