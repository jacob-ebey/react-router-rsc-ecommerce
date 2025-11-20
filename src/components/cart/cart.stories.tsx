import type { Meta, StoryObj } from "@storybook/react-vite";

import { CartSkeleton } from "./cart";
import { CartForm } from "./cart.client";
import type { CartFragment } from "./cart.fagments";

const meta = {
  title: "Components/cart",
  component: CartSkeleton,
} satisfies Meta<typeof CartSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  render: () => (
    <div className="w-96 border overflow-auto">
      <CartSkeleton className="max-h-[95vh] h-screen" />
    </div>
  ),
};

// Mock cart data for stories
const mockCart: Exclude<CartFragment, null> = {
  id: "cart-123",
  checkoutUrl: "#checkout",
  lines: {
    nodes: [
      {
        id: "line-1",
        quantity: 2,
        merchandise: {
          __typename: "ProductVariant" as const,
          id: "var-1",
          title: "Small",
          image: {
            url: "https://cdn.shopify.com/s/files/1/0655/4127/5819/files/T-Shirt_-_Load_in_Parallel_-_Black_f3d771f2-b46e-46cc-8965-3fe72b8f17c5_x128.png?v=1747673615",
          },
          product: {
            title: "Load in Parallel T-shirt - Black",
          },
          price: {
            amount: "29.99",
            currencyCode: "USD",
          },
        },
      },
      {
        id: "line-2",
        quantity: 1,
        merchandise: {
          __typename: "ProductVariant" as const,
          id: "var-2",
          title: "Default Title",
          image: {
            url: "https://cdn.shopify.com/s/files/1/0655/4127/5819/files/Remix_Sticker_Pack_No1_-_Packaged_x128.png?v=1755025129",
          },
          product: {
            title: "Remix Sticker Pack No. 1",
          },
          price: {
            amount: "89.99",
            currencyCode: "USD",
          },
        },
      },
      {
        id: "line-3",
        quantity: 2,
        merchandise: {
          __typename: "ProductVariant" as const,
          id: "var-1",
          title: "Large",
          image: {
            url: "https://cdn.shopify.com/s/files/1/0655/4127/5819/files/T-Shirt_-_Load_in_Parallel_-_Black_f3d771f2-b46e-46cc-8965-3fe72b8f17c5_x128.png?v=1747673615",
          },
          product: {
            title: "Load in Parallel T-shirt - Black",
          },
          price: {
            amount: "29.99",
            currencyCode: "USD",
          },
        },
      },
      {
        id: "line-4",
        quantity: 2,
        merchandise: {
          __typename: "ProductVariant" as const,
          id: "var-1",
          title: "X-Large",
          image: {
            url: "https://cdn.shopify.com/s/files/1/0655/4127/5819/files/T-Shirt_-_Load_in_Parallel_-_Black_f3d771f2-b46e-46cc-8965-3fe72b8f17c5_x128.png?v=1747673615",
          },
          product: {
            title: "Load in Parallel T-shirt - Black",
          },
          price: {
            amount: "29.99",
            currencyCode: "USD",
          },
        },
      },
    ],
  },
  cost: {
    totalAmount: {
      amount: "167.95",
      currencyCode: "USD",
    },
  },
};

async function mockAction() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (Math.random() < 0.5) {
    return {
      error: "An unexpected error occurred. Please try again.",
      cart: mockCart,
    };
  }
  return { cart: mockCart };
}

export const Empty: Story = {
  render: () => (
    <div className="relative max-h-[95vh] h-screen w-96 border overflow-auto">
      <CartForm
        className="h-screen"
        cart={{
          id: "cart-123",
          checkoutUrl: "#checkout",
          lines: {
            nodes: [],
          },
          cost: {
            totalAmount: {
              amount: "0.00",
              currencyCode: "USD",
            },
          },
        }}
        checkoutAction={mockAction as any}
        removeFromCartAction={mockAction as any}
        setLineQuantityAction={mockAction as any}
      />
    </div>
  ),
};

export const SingleItem: Story = {
  render: () => (
    <div className="w-96 border overflow-auto">
      <CartForm
        className="max-h-[95vh] h-screen"
        cart={{
          ...mockCart,
          lines: {
            nodes: [mockCart.lines.nodes[0]],
          },
        }}
        checkoutAction={mockAction as any}
        removeFromCartAction={mockAction as any}
        setLineQuantityAction={mockAction as any}
      />
    </div>
  ),
};

export const WithItems: Story = {
  render: () => (
    <div className="max-h-[95vh] h-screen w-96 border overflow-auto">
      <CartForm
        cart={mockCart}
        checkoutAction={mockAction as any}
        removeFromCartAction={mockAction as any}
        setLineQuantityAction={mockAction as any}
      />
    </div>
  ),
};
