import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Sidebar } from "./sidebar";
import { Button } from "./button";

const meta = {
  title: "Components/ui/sidebar",
  component: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          Open Sidebar
        </Button>
        <Sidebar onClose={() => setOpen(false)} open={open}>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Close Sidebar
          </Button>
          <p>Content :D</p>
        </Sidebar>
      </>
    );
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
