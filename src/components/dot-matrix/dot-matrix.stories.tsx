import type { Meta, StoryObj } from "@storybook/react-vite";

import { DotMatrix } from "./dot-matrix";

const meta = {
  title: "Components/dot-matrix",
  component: DotMatrix,
  argTypes: {
    children: {
      control: "select",
      options: ["Hoodie", "T-Shirt", "Hat", "Picture"],
      mapping: {
        Hoodie: (
          <img
            alt=""
            src="https://cdn.shopify.com/s/files/1/0655/4127/5819/files/Hoodie_-_Remix_Engineering_-_Front_3a813553-57d6-4274-80fe-c8b5cd42183d.png?v=1751042807&width=800&height=800&crop=center"
          />
        ),
        "T-Shirt": (
          <img
            alt=""
            src="https://cdn.shopify.com/s/files/1/0655/4127/5819/files/T-Shirt_-_Load_in_Parallel_-_Black_f3d771f2-b46e-46cc-8965-3fe72b8f17c5.png?v=1747673615&width=800&height=800&crop=center"
          />
        ),
        Hat: (
          <img
            alt=""
            src="https://cdn.shopify.com/s/files/1/0655/4127/5819/files/Hat_-_Better_Web_-_Front_ddf006a7-2ef4-418e-a61d-49bd59599224.png?v=1747670036&width=800&height=800&crop=center"
          />
        ),
        Picture: (
          <picture>
            <img
              alt=""
              src="https://cdn.shopify.com/s/files/1/0655/4127/5819/files/Hoodie_-_Remix_Engineering_-_Front_3a813553-57d6-4274-80fe-c8b5cd42183d.png?v=1751042807&width=800&height=800&crop=center"
            />
          </picture>
        ),
      },
    },
  },
  args: {
    children: "Hoodie",
    className: "w-96 h-96 aspect-square",
    reveal: true,
  },
} satisfies Meta<typeof DotMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Trigger: Story = {
  render: (props) => (
    <div className="p-8 bg-green-200 dot-matrix-trigger">
      <DotMatrix {...props} />
    </div>
  ),
};
