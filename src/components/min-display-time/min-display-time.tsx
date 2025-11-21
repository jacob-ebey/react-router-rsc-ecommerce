"use client";

import { useState, useEffect, useRef, useTransition } from "react";

export function MinimumLoadingTime({
  isLoading,
  minimumLoadingTime = 500,
  children,
}: {
  isLoading: boolean;
  minimumLoadingTime?: number;
  children?: React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const [_showLoading, setShowLoading] = useState(isLoading);
  const loadingStartTime = useRef<number>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const showLoading = _showLoading || pending;

  if (_showLoading !== isLoading) {
    setShowLoading(isLoading);
  }

  useEffect(() => {
    if (isLoading && !_showLoading) {
      loadingStartTime.current = Date.now();
      // setShowLoading(true);
    }

    if (!isLoading && _showLoading) {
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
  }, [isLoading, minimumLoadingTime]);

  return (
    <div style={{ display: showLoading ? "block" : "none" }}>{children}</div>
  );
  // return showLoading ? children : null;
}
