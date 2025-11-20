import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";

const meta = {
  title: "Components/ui/button",
  component: Button,
  args: {
    children: "Add to Cart",
    isDisabled: false,
    isPending: false,
    isSelected: false,
    onClick: () => alert("Button pressed!"),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const WithLongText: Story = {
  args: {
    children: "Add to Shopping Cart",
  },
};

export const Disabled: Story = {
  args: {
    children: "Out of Stock",
    isDisabled: true,
  },
};

export const Pending: Story = {
  args: {
    children: "Adding to Cart...",
    isPending: true,
  },
};

export const Selected: Story = {
  args: {
    children: "Size: M",
    isSelected: true,
  },
};
