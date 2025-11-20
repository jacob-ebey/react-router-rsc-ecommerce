"use server";

import { graphql } from "gql.tada";
import { redirectDocument } from "react-router";

import { getClient } from "@/lib/gql";

export type CartActionResult = { id: string; error?: string };

export async function checkout(
  cartId: string,
  formData: FormData
): Promise<CartActionResult> {
  throw redirectDocument("https://example.com/");
  return { id: cartId };
}

const RemoveFromCart = graphql(
  `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
        }
      }
    }
  `
);

export async function removeFromCart(
  cartId: string,
  lineId: string
): Promise<CartActionResult> {
  const client = getClient();

  try {
    const result = await client.mutation(RemoveFromCart, {
      cartId,
      lineIds: [lineId],
    });

    const cart = result.data?.cartLinesRemove?.cart;

    if (!cart) {
      return { id: cartId, error: "Failed to remove item from cart." };
    }

    return { id: cart.id };
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    return { id: cartId, error: "Failed to remove item from cart." };
  }
}

const SetLineQuantity = graphql(
  `
    mutation SetLineQuantity($cartId: ID!, $lineId: ID!, $quantity: Int!) {
      cartLinesUpdate(
        cartId: $cartId
        lines: { id: $lineId, quantity: $quantity }
      ) {
        cart {
          id
        }
      }
    }
  `
);

export async function setLineQuantity(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<CartActionResult> {
  const client = getClient();

  try {
    const result = await client.mutation(SetLineQuantity, {
      cartId,
      lineId,
      quantity,
    });

    const cart = result.data?.cartLinesUpdate?.cart;

    if (!cart) {
      return { id: cartId, error: "Failed to update item quantity." };
    }

    return { id: cart.id };
  } catch (error) {
    console.error("Failed to set line quantity:", error);
    return { id: cartId, error: "Failed to update item quantity." };
  }
}
