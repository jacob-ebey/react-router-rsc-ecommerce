"use client";

import { useState, useEffect, useRef, startTransition } from "react";

export function MinimumLoadingTime({
  isLoading,
  minimumLoadingTime = 500,
  children,
}: {
  isLoading: boolean;
  minimumLoadingTime?: number;
  children?: React.ReactNode;
}) {
  const [showLoading, setShowLoading] = useState(isLoading);
  const loadingStartTime = useRef<number>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (isLoading && !showLoading) {
      loadingStartTime.current = Date.now();
      startTransition(() => {
        setShowLoading(true);
      });
    }

    if (!isLoading && showLoading) {
      const elapsedTime = Date.now() - (loadingStartTime.current || 0);
      const remainingTime = minimumLoadingTime - elapsedTime;

      if (remainingTime > 0) {
        timeoutRef.current = setTimeout(() => {
          startTransition(() => {
            setShowLoading(false);
          });
          loadingStartTime.current = null;
        }, remainingTime);
      } else {
        startTransition(() => {
          setShowLoading(false);
        });
        loadingStartTime.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, showLoading, minimumLoadingTime]);

  return showLoading ? children : null;
}
