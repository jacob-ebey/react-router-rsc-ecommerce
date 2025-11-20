import { createEventType } from "@remix-run/events";

const [onSetOpen, createSetOpen] = createEventType<boolean>("cart:setOpen");

export { onSetOpen, createSetOpen };
