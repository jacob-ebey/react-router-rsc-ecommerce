"use client";

import { useCallback, useDeferredValue, useRef, ViewTransition } from "react";
import { incrementScrollLock } from "./scroll-lock";

export function Sidebar({
  children,
  name,
  open: _open,
  onClose,
  ...props
}: {
  children?: React.ReactNode;
  name: string;
  open: boolean;
  onClose: () => void;
}) {
  const open = useDeferredValue(_open);
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
        { signal: controller.signal },
      );

      return () => {
        controller.abort();
      };
    },
    [open],
  );

  return (
    <ViewTransition name={name}>
      <dialog
        {...props}
        ref={dialogRef}
        className="max-w-none max-h-none h-full w-full bg-backdrop"
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;

          const dialog = event.currentTarget;
          if (dialog.open) {
            dialog.close();
          }
        }}
      >
        <ViewTransition>
          <div className="absolute bg-background paper max-w-96 w-full top-0 right-0 bottom-0 border-2 border-border overflow-y-auto">
            {children}
          </div>
        </ViewTransition>
      </dialog>
    </ViewTransition>
  );
}
