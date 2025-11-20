"use server";

import { graphql } from "gql.tada";

import { getClient } from "@/lib/gql";
import { getSession } from "@/lib/session";

const CreateCart = graphql(`
  mutation CreateCart($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
      }
    }
  }
`);

const AddToCart = graphql(`
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
      }
    }
  }
`);

export type AddToCartResult = {
  success: boolean;
  error?: string;
};

export async function addToCartAction(
  formData: FormData
): Promise<AddToCartResult> {
  const client = getClient();
  const session = getSession();
  let cartId = session.get("cartId");

  const variantId = formData.get("variantId");
  if (!variantId || typeof variantId !== "string") {
    return { success: false, error: "Invalid variant ID" };
  }

  try {
    if (cartId) {
      const result = await client.mutation(AddToCart, {
        cartId,
        lines: [{ merchandiseId: variantId, quantity: 1 }],
      });
      cartId = result.data?.cartLinesAdd?.cart?.id ?? cartId;
    } else {
      const result = await client.mutation(CreateCart, {
        lines: [{ merchandiseId: variantId, quantity: 1 }],
      });
      cartId = result.data?.cartCreate?.cart?.id ?? cartId;
    }

    session.set("cartId", cartId);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: "Failed to add item to cart" };
  }

  return { success: true };
}
