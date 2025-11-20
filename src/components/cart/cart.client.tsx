"use client";

import { Button, buttonStyles } from "@/components/ui/button";

import { cn, formatPrice } from "@/lib/utils";
import { useActionState, useId, useOptimistic, useTransition } from "react";
import { Group, Input, Label, NumberField } from "react-aria-components";

import { useHydrated } from "@/components/ui/use-hydrated";

import type {
  CartActionResult,
  checkout,
  removeFromCart,
  setLineQuantity,
} from "./cart.actions";
import type { CartFragment } from "./cart.fagments";

export function EmptyCart() {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 px-4 text-center"
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
        <h2 className="text-lg font-semibold">Empty Cart</h2>
        <p className="text-sm text-gray-600 mt-1">
          You have no items in your shopping cart.
        </p>
      </div>
    </div>
  );
}

export function CartForm({
  cart,
  checkoutAction,
  removeFromCartAction,
  setLineQuantityAction,
  sticky,
}: {
  className?: string;
  cart: Exclude<CartFragment, null>;
  checkoutAction: typeof checkout;
  removeFromCartAction: typeof removeFromCart;
  setLineQuantityAction: typeof setLineQuantity;
  sticky?: boolean;
}) {
  const formId = useId();
  const [isTransitioning, startTransition] = useTransition();
  const hydrated = useHydrated();

  const [error, cartAction, isUpdatingCart] = useActionState<
    CartActionResult,
    | { type: "removeFromCart"; lineId: string }
    | { type: "setLineQuantity"; lineId: string; quantity: number }
    | { type: "checkout"; formData: FormData }
  >(
    async (cartState, action) => {
      let resultPromise: Promise<CartActionResult | undefined> =
        Promise.resolve(undefined);

      switch (action.type) {
        case "removeFromCart":
          resultPromise = removeFromCartAction(cartState.id, action.lineId);
          break;
        case "setLineQuantity": {
          resultPromise = setLineQuantityAction(
            cartState.id,
            action.lineId,
            action.quantity
          );
          break;
        }
        case "checkout": {
          resultPromise = checkoutAction(cartState.id, action.formData);
          break;
        }
      }

      const result = await resultPromise;

      return result ?? cartState;
    },
    { id: cart.id }
  );

  const [optimisticCart, cartActionOptimistic] = useOptimistic<
    CartFragment,
    | { type: "removeFromCart"; lineId: string }
    | { type: "setLineQuantity"; lineId: string; quantity: number }
  >(cart, (state, action) => {
    switch (action.type) {
      case "removeFromCart":
        return {
          ...state,
          lines: {
            ...state.lines,
            nodes: state.lines.nodes.filter(
              (line) => line.id !== action.lineId
            ),
          },
        };
      case "setLineQuantity":
        return {
          ...state,
          lines: {
            ...state.lines,
            nodes: state.lines.nodes.map((line) =>
              line.id === action.lineId
                ? { ...line, quantity: action.quantity }
                : line
            ),
          },
        };
      default:
        return state;
    }
  });

  const removeFromCart = (lineId: string) => {
    startTransition(() => {
      const event = {
        type: "removeFromCart",
        lineId,
      } as const;

      cartActionOptimistic(event);
      cartAction(event);
    });
  };

  const setLineQuantity = (lineId: string, quantity: number) => {
    startTransition(() => {
      const event = {
        type: "setLineQuantity",
        lineId,
        quantity,
      } as const;

      cartActionOptimistic(event);
      cartAction(event);
    });
  };

  const checkout = (formData: FormData) => {
    startTransition(() => {
      const event = { type: "checkout", formData } as const;
      cartAction(event);
    });
  };

  const isPending = isTransitioning || isUpdatingCart;

  const lines = optimisticCart.lines.nodes;
  const total = optimisticCart.cost.totalAmount;
  const totalItems = optimisticCart.lines.nodes.reduce(
    (sum, line) => sum + line.quantity,
    0
  );

  if (totalItems === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className={cn("px-6 py-4 top-0 bg-background paper border-b-2 z-10", {
          sticky,
        })}
      >
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <p className="text-text-dimmed mt-1">
          {isPending ? (
            <>&#11834;</>
          ) : (
            <>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </>
          )}
        </p>
      </div>

      <div className="space-y-4 px-6 flex-1 py-4">
        {lines.map((line) => (
          <CartLineItem
            key={line.id}
            line={line}
            cartFormId={formId}
            onQuantityChange={(quantity) => setLineQuantity(line.id, quantity)}
            onRemoveFromCart={() => removeFromCart(line.id)}
          />
        ))}
      </div>

      <div
        className={cn(
          "bottom-0 bg-background paper px-6 py-4 border-t-2 space-y-4",
          { sticky }
        )}
      >
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold">
            {isPending ? <>&#11834;</> : formatPrice(total)}
          </span>
        </div>

        <form
          id={formId}
          action={
            hydrated ? checkout : (checkoutAction.bind(null, cart.id) as any)
          }
        >
          <Button
            type="submit"
            isPending={isPending}
            className={cn(buttonStyles({}), "w-full")}
          >
            Checkout
          </Button>
        </form>
      </div>
    </div>
  );
}

type CartLine = Exclude<CartFragment, null>["lines"]["nodes"][number];

function CartLineItem({
  cartFormId,
  line,
  onQuantityChange,
  onRemoveFromCart,
}: {
  cartFormId: string;
  line: CartLine;
  onQuantityChange: (quantity: number) => void;
  onRemoveFromCart: () => void;
}) {
  const hydrated = useHydrated();

  const variant = line.merchandise;
  const product = variant.product;
  const price = variant.price;

  return (
    <div className="grid gap-2 p-4 border-2">
      <div className="flex-1">
        <h3 className="font-semibold">{product.title}</h3>
        <div className="flex">
          {variant.title !== "Default Title" ? (
            <p className="text-sm flex-1">{variant.title}</p>
          ) : (
            <div className="flex-1" />
          )}
          <div className="whitespace-nowrap">{formatPrice(price)}</div>
        </div>
      </div>

      <div className="flex gap-2 justify-between">
        <div className="flex flex-col justify-end">
          {variant.image ? (
            <div className="aspect-square border border-border w-19">
              <img
                src={variant.image.url as string}
                alt={product.title}
                className="object-cover aspect-square"
              />
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <div className="flex flex-col gap-2 justify-end flex-1">
            <NumberField
              form={cartFormId}
              minValue={1}
              maxValue={10}
              value={line.quantity}
              onChange={onQuantityChange}
              isDisabled={!hydrated}
            >
              <Label className="sr-only">Quantity</Label>
              <Group className="flex gap-1 w-full">
                <Button slot="decrement" size="sm">
                  -
                </Button>
                <Input className="flex-1 w-10 text-center px-2" />
                <Button slot="increment" size="sm">
                  +
                </Button>
              </Group>
            </NumberField>

            <Button
              type="submit"
              size="sm"
              aria-label={`Remove ${product.title} from cart`}
              className="block w-full text-xs"
              onClick={() => onRemoveFromCart()}
            >
              Remove From Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
