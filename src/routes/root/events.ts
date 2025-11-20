export const cartSetOpenEvent = "cart:setOpen" as const;

export class CartSetOpenEvent extends Event {
  open: boolean;

  constructor(open: boolean) {
    super(cartSetOpenEvent);
    this.open = open;
  }
}

declare global {
  interface WindowEventMap {
    [cartSetOpenEvent]: CartSetOpenEvent;
  }
}
