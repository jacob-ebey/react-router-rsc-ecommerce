import type { Meta, StoryObj } from "@storybook/react-vite";

import { AddToCartForm } from "./add-to-cart-form";

const meta = {
  title: "Components/product-options",
  component: AddToCartForm,
} satisfies Meta<typeof AddToCartForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockData = {
  handle: "product-handle",
  priceRange: {
    maxVariantPrice: {
      amount: "54.99",
      currencyCode: "USD",
    },
    minVariantPrice: {
      amount: "49.99",
      currencyCode: "USD",
    },
  },
  options: [
    {
      id: "gid://shopify/ProductOption/1",
      name: "Size",
      optionValues: [
        { id: "gid://shopify/ProductOptionValue/1", name: "XS" },
        { id: "gid://shopify/ProductOptionValue/2", name: "S" },
        { id: "gid://shopify/ProductOptionValue/3", name: "M" },
        { id: "gid://shopify/ProductOptionValue/4", name: "L" },
        { id: "gid://shopify/ProductOptionValue/5", name: "XL" },
      ],
    },
    {
      id: "gid://shopify/ProductOption/2",
      name: "Color",
      optionValues: [
        { id: "gid://shopify/ProductOptionValue/6", name: "Black" },
        { id: "gid://shopify/ProductOptionValue/7", name: "White" },
        { id: "gid://shopify/ProductOptionValue/8", name: "Navy" },
      ],
    },
  ],
  variants: {
    nodes: [
      {
        id: "gid://shopify/ProductVariant/1",
        title: "Black / XS",
        selectedOptions: [
          { name: "Size", value: "XS" },
          { name: "Color", value: "Black" },
        ],
        price: { amount: "49.99", currencyCode: "USD" },
        availableForSale: true,
      },
      {
        id: "gid://shopify/ProductVariant/2",
        title: "Black / S",
        selectedOptions: [
          { name: "Size", value: "S" },
          { name: "Color", value: "Black" },
        ],
        price: { amount: "49.99", currencyCode: "USD" },
        availableForSale: true,
      },
      {
        id: "gid://shopify/ProductVariant/3",
        title: "Black / M",
        selectedOptions: [
          { name: "Size", value: "M" },
          { name: "Color", value: "Black" },
        ],
        price: { amount: "49.99", currencyCode: "USD" },
        availableForSale: true,
      },
      {
        id: "gid://shopify/ProductVariant/4",
        title: "Black / L",
        selectedOptions: [
          { name: "Size", value: "L" },
          { name: "Color", value: "Black" },
        ],
        price: { amount: "49.99", currencyCode: "USD" },
        availableForSale: true,
      },
      {
        id: "gid://shopify/ProductVariant/5",
        title: "Black / XL",
        selectedOptions: [
          { name: "Size", value: "XL" },
          { name: "Color", value: "Black" },
        ],
        price: { amount: "49.99", currencyCode: "USD" },
        availableForSale: false,
      },
      {
        id: "gid://shopify/ProductVariant/6",
        title: "White / XS",
        selectedOptions: [
          { name: "Size", value: "XS" },
          { name: "Color", value: "White" },
        ],
        price: { amount: "49.99", currencyCode: "USD" },
        availableForSale: true,
      },
      {
        id: "gid://shopify/ProductVariant/7",
        title: "White / S",
        selectedOptions: [
          { name: "Size", value: "S" },
          { name: "Color", value: "White" },
        ],
        price: { amount: "49.99", currencyCode: "USD" },
        availableForSale: true,
      },
      {
        id: "gid://shopify/ProductVariant/8",
        title: "White / M",
        selectedOptions: [
          { name: "Size", value: "M" },
          { name: "Color", value: "White" },
        ],
        price: { amount: "49.99", currencyCode: "USD" },
        availableForSale: true,
      },
      {
        id: "gid://shopify/ProductVariant/9",
        title: "White / L",
        selectedOptions: [
          { name: "Size", value: "L" },
          { name: "Color", value: "White" },
        ],
        price: { amount: "54.99", currencyCode: "USD" },
        availableForSale: true,
      },
      {
        id: "gid://shopify/ProductVariant/10",
        title: "White / XL",
        selectedOptions: [
          { name: "Size", value: "XL" },
          { name: "Color", value: "White" },
        ],
        price: { amount: "54.99", currencyCode: "USD" },
        availableForSale: true,
      },
      {
        id: "gid://shopify/ProductVariant/11",
        title: "Navy / XS",
        selectedOptions: [
          { name: "Size", value: "XS" },
          { name: "Color", value: "Navy" },
        ],
        price: { amount: "49.99", currencyCode: "USD" },
        availableForSale: true,
      },
      {
        id: "gid://shopify/ProductVariant/12",
        title: "Navy / S",
        selectedOptions: [
          { name: "Size", value: "S" },
          { name: "Color", value: "Navy" },
        ],
        price: { amount: "49.99", currencyCode: "USD" },
        availableForSale: true,
      },
      {
        id: "gid://shopify/ProductVariant/13",
        title: "Navy / M",
        selectedOptions: [
          { name: "Size", value: "M" },
          { name: "Color", value: "Navy" },
        ],
        price: { amount: "49.99", currencyCode: "USD" },
        availableForSale: true,
      },
      {
        id: "gid://shopify/ProductVariant/14",
        title: "Navy / L",
        selectedOptions: [
          { name: "Size", value: "L" },
          { name: "Color", value: "Navy" },
        ],
        price: { amount: "49.99", currencyCode: "USD" },
        availableForSale: true,
      },
      {
        id: "gid://shopify/ProductVariant/15",
        title: "Navy / XL",
        selectedOptions: [
          { name: "Size", value: "XL" },
          { name: "Color", value: "Navy" },
        ],
        price: { amount: "54.99", currencyCode: "USD" },
        availableForSale: true,
      },
    ],
  },
} as const satisfies React.ComponentProps<typeof AddToCartForm>["product"];

let i = 0;

async function action(formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (i++ % 2 === 0) {
    return { success: true };
  } else {
    return { success: false, error: "Failed to add to cart." };
  }
}

export const Default: Story = {
  args: {
    action,
    product: mockData,
  },
};

export const SingleOption: Story = {
  args: {
    action,
    product: {
      ...mockData,
      options: [mockData.options[0]],
    },
  },
};
