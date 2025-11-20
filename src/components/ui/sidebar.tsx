"use client";

import { useCallback, useRef, ViewTransition } from "react";
import { incrementScrollLock } from "./scroll-lock";

export function Sidebar({
  children,
  open,
  onClose,
  ...props
}: {
  children?: React.ReactNode;
  id?: string;
  open: boolean;
  onClose: () => void;
}) {
  const lockedRef = useRef(false);

  const dialogRef = useCallback(
    (ref: HTMLDialogElement | null) => {
      if (!ref) return;

      if (open && !ref.open) {
        ref.showModal();
        incrementScrollLock(1);
        lockedRef.current = true;
      } else if (!open && ref.open) {
        ref.close();
        if (lockedRef.current) {
          incrementScrollLock(-1);
          lockedRef.current = false;
        }
      }

      const controller = new AbortController();
      ref.addEventListener(
        "close",
        () => {
          if (lockedRef.current) {
            incrementScrollLock(-1);
            lockedRef.current = false;
          }

          onClose();
        },
        { signal: controller.signal }
      );

      return () => {
        controller.abort();
      };
    },
    [open]
  );

  return (
    <dialog
      {...props}
      ref={dialogRef}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;

        const dialog = event.currentTarget;
        const rect = dialog.getBoundingClientRect();
        const isInDialog =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!isInDialog && dialog.open) {
          dialog.close();
        }
      }}
    >
      <ViewTransition>
        <div className="fixed bg-background paper max-w-96 w-full top-0 right-0 bottom-0 border-2 border-border overflow-y-auto">
          {children}
        </div>
      </ViewTransition>
    </dialog>
  );
}
