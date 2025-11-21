"use client";

import { Fragment, useEffect, useRef, ViewTransition } from "react";
import { Link } from "react-router";

import { DotMatrix } from "@/components/dot-matrix/dot-matrix";
import { cn, formatPrice } from "@/lib/utils";

import "./product-card.css";

function calcRevealPercent(cardElement: HTMLElement) {
  // set the --reveal-percent CSS variable based on the position of the element in the viewport. When it's in the middle vertically, set it to 1.
  const rect = cardElement.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const elementCenterY = rect.top + rect.height / 2;
  const distanceFromCenter = Math.abs(windowHeight / 2 - elementCenterY);
  const maxDistance = windowHeight / 2 + rect.height / 2;
  let revealPercent = 1 - distanceFromCenter / maxDistance;
  return Math.max(0, Math.min(1, revealPercent));
}

export function ProductCardFallback() {
  return (
    <div
      data-testid="product-card-fallback"
      className="animate-pulse flex flex-col gap-4 p-4"
    >
      <DotMatrix reveal={false}>
        <div className="aspect-square w-full" />
      </DotMatrix>
      <div className="flex flex-col gap-2 items-center">
        <div className="w-7/8">
          <DotMatrix className="h-7" reveal={false} />
        </div>

        <div className="w-32">
          <DotMatrix className="h-6" reveal={false} />
        </div>
      </div>
    </div>
  );
}

export function ProductCard({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const lastAnimationFrameIdRef = useRef<number | null>(null);
  function updateRevealPercent() {
    if (lastAnimationFrameIdRef.current !== null) return;
    lastAnimationFrameIdRef.current = requestAnimationFrame(() => {
      lastAnimationFrameIdRef.current = null;
      if (ref.current) {
        const percent = calcRevealPercent(ref.current);
        ref.current.style.setProperty("--reveal-percent", percent.toString());
      }
    });
  }

  useEffect(() => {
    const controller = new AbortController();
    ref.current?.style.setProperty("--reveal-speed", "0.5s");
    updateRevealPercent();
    setTimeout(() => {
      if (controller.signal.aborted) return;
      ref.current?.style.removeProperty("--reveal-speed");
      addEventListener(
        "scroll",
        () => {
          ref.current?.style.setProperty("--reveal-speed", "0s");
          updateRevealPercent();
          ref.current?.style.removeProperty("--reveal-speed");
        },
        {
          signal: controller.signal,
        },
      );
      addEventListener(
        "resize",
        () => {
          ref.current?.style.setProperty("--reveal-speed", "0s");
          updateRevealPercent();
          ref.current?.style.removeProperty("--reveal-speed");
        },
        {
          signal: controller.signal,
        },
      );
    }, 500);

    return () => {
      ref.current?.style.removeProperty("--reveal-speed");
      controller.abort();
    };
  });

  return (
    <Link
      ref={ref}
      data-testid="product-card"
      className={cn(
        "relative flex flex-col gap-4 dot-matrix-trigger hover:text-primary-blue focus-visible:text-primary-blue",
        className,
      )}
      style={
        {
          "--reveal-percent": 0,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </Link>
  );
}

export function ProductCardImages({
  images,
  loading,
  viewTransitionName,
}: {
  images: string[];
  loading?: React.ComponentProps<"img">["loading"];
  viewTransitionName?: string;
}) {
  if (!images.length) return null;

  let Wrapper: any = viewTransitionName ? ViewTransition : Fragment;
  let props: any =
    Wrapper === ViewTransition
      ? {
          name: viewTransitionName,
        }
      : {};

  if (images.length === 1) {
    return (
      <Wrapper {...props}>
        <DotMatrix>
          <picture className="block w-full aspect-square relative">
            <img
              className="absolute inset-0 object-cover"
              alt=""
              src={images[0]}
              loading={loading}
            />
          </picture>
        </DotMatrix>
      </Wrapper>
    );
  }

  return (
    <>
      <div className="crossfade-container-trigger" />
      <div className="crossfade-container">
        <DotMatrix>
          <Wrapper {...props}>
            {images.map((image, index) => {
              return (
                <picture key={`${index}|${image}`}>
                  <img
                    className="object-cover w-full aspect-square"
                    alt=""
                    src={image}
                    loading={index === 0 ? loading : "lazy"}
                  />
                </picture>
              );
            })}
          </Wrapper>
        </DotMatrix>
      </div>
    </>
  );
}

export function ProductCardBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-center flex-1 flex flex-col px-4 gap-2", className)}
      {...props}
    />
  );
}

export function ProductCardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("text-xl font-semibold", className)} {...props} />;
}

export function ProductCardPrice({
  currency,
  amount,
}: {
  amount: string | number;
  currency: string;
}) {
  return (
    <div className="text-lg mt-auto">
      {formatPrice({ amount, currencyCode: currency })}
    </div>
  );
}
