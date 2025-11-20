import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ProductCard,
  ProductCardBody,
  ProductCardFallback,
  ProductCardImages,
  ProductCardPrice,
  ProductCardTitle,
} from "./product-card";
import { cn } from "@/lib/utils";

function ProductCardPreview({
  amount,
  currency,
  fullscreen,
  images,
  title,
  scroll,
}: {
  amount: string | number;
  currency: string;
  fullscreen?: boolean;
  images: string[];
  title: string;
  scroll?: boolean;
}) {
  return (
    <div className={scroll ? "h-[300vh] overflow-y-scroll" : ""}>
      <div
        className={cn(
          fullscreen ? "w-full" : "w-96",
          scroll ? "mt-[100vh]" : ""
        )}
      >
        <ProductCard to="#">
          <ProductCardImages images={images} />
          <ProductCardBody>
            <ProductCardTitle>{title}</ProductCardTitle>
            <ProductCardPrice amount={amount} currency={currency} />
          </ProductCardBody>
        </ProductCard>
      </div>
    </div>
  );
}

function ProductCardFallbackPreview({ fullscreen }: { fullscreen?: boolean }) {
  return (
    <div className={fullscreen ? "w-full" : "w-96"}>
      <ProductCardFallback />
    </div>
  );
}

const meta = {
  title: "Components/product-card",
  component: ProductCardPreview,
  args: {
    title: "Remix Engineering Hoodie - Black",
    amount: 62.0,
    currency: "USD",
    fullscreen: false,
    images: [
      "https://cdn.shopify.com/s/files/1/0655/4127/5819/files/Hoodie_-_Remix_Engineering_-_Front_3a813553-57d6-4274-80fe-c8b5cd42183d.png?v=1751042807&width=800&height=800&crop=center",
      "https://cdn.shopify.com/s/files/1/0655/4127/5819/files/Hoodie_-_Remix_Engineering_-_Back_b2b5ac1d-c4f8-4455-b7b9-167f5879bb89.png?v=1751042807&width=800&height=800&crop=center",
    ],
  },
} satisfies Meta<typeof ProductCardPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const SingleImage: Story = {
  args: {
    images: [
      "https://cdn.shopify.com/s/files/1/0655/4127/5819/files/Hoodie_-_Remix_Engineering_-_Front_3a813553-57d6-4274-80fe-c8b5cd42183d.png?v=1751042807&width=800&height=800&crop=center",
    ],
  },
};

export const Fallback: Story = {
  render: ProductCardFallbackPreview,
  args: {
    fullscreen: false,
  },
};

export const ScrollReveal: Story = {
  args: {
    scroll: true,
  },
};
