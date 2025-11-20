import type { Meta, StoryObj } from "@storybook/react-vite";

import { FillRow, Grid, GridCol, GridRow } from "./grid";

const meta = {
  title: "Components/grid",
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultiRow: Story = {
  render: () => (
    <Grid>
      <GridRow className="grid-cols-3">
        <GridCol>Col 1</GridCol>
        <GridCol>Col 2</GridCol>
        <GridCol>Col 3</GridCol>
      </GridRow>
      <GridRow className="grid-cols-3">
        <GridCol>Col 1</GridCol>
        <GridCol>Col 2</GridCol>
        <GridCol>Col 3</GridCol>
      </GridRow>
    </Grid>
  ),
};

export const MissingCol: Story = {
  render: () => (
    <Grid>
      <GridRow className="grid-cols-3">
        <GridCol>Col 1</GridCol>
        <GridCol>Col 2</GridCol>
        <FillRow cols={3} count={2} />
      </GridRow>
    </Grid>
  ),
};

export const MissingColResponsive: Story = {
  render: () => (
    <Grid>
      <GridRow className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <GridCol>Col 1</GridCol>
        <GridCol>Col 2</GridCol>
        <FillRow
          cols={[
            ["default", 1],
            ["md", 2],
            ["lg", 3],
          ]}
          count={2}
        />
      </GridRow>
    </Grid>
  ),
};

export const Nested: Story = {
  render: () => (
    <Grid>
      <GridRow className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <GridCol>Col 1</GridCol>
        <GridCol>Col 2</GridCol>
        <GridCol>
          <Grid nested>
            <GridRow className="grid-cols-3">
              <GridCol>Col 3.1.1</GridCol>
              <GridCol>Col 3.1.2</GridCol>
              <GridCol>Col 3.1.3</GridCol>
            </GridRow>
            <GridRow className="grid-cols-3">
              <GridCol>Col 3.2.1</GridCol>
              <GridCol>Col 3.2.2</GridCol>
              <FillRow cols={3} count={2} />
            </GridRow>
          </Grid>
        </GridCol>
        <FillRow
          cols={[
            ["default", 1],
            ["md", 2],
            ["lg", 3],
          ]}
          count={3}
        />
      </GridRow>
    </Grid>
  ),
};
