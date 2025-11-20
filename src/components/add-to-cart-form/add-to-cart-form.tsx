"use client";

import { startTransition, useActionState, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";

import { Button, buttonStyles } from "@/components/ui/button";
import { useHydrated } from "@/components/ui/use-hydrated";
import { formatPrice } from "@/lib/utils";

import type {
  addToCartAction,
  AddToCartResult,
} from "./add-to-cart-form.actions";
import type { ProductOptionsFragment } from "./add-to-cart-form.fragment";

function encodeSelectedOptions(options: Record<string, string>) {
  const toEncode = Object.fromEntries(
    Object.entries(options).sort(
      ([keyA], [keyB]) => keyA.charCodeAt(0) - keyB.charCodeAt(0)
    )
  );
  return JSON.stringify(toEncode);
}

function decodeSelectedOptions(options: string | null): Record<string, string> {
  if (!options) return {};
  try {
    const parsed = JSON.parse(options);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch {}

  return {};
}

export function AddToCartForm({
  action,
  product,
  onAddToCart,
}: {
  action: typeof addToCartAction;
  product: ProductOptionsFragment;
  onAddToCart?: () => void;
}) {
  const location = useLocation();
  const hydrated = useHydrated();

  const [selectedOptions, setSelectedOptions] = useState(() =>
    decodeSelectedOptions(new URLSearchParams(location.search).get("options"))
  );

  const [lastLocation, setLastLocation] = useState(location);
  if (location.search !== lastLocation.search) {
    setLastLocation(location);
    setSelectedOptions(
      decodeSelectedOptions(new URLSearchParams(location.search).get("options"))
    );
  }

  const { options, priceRange, variants } = product;

  const hasSingleVariant = variants.nodes.length < 2;

  // Find the matching variant based on selected options
  const selectedVariant = useMemo(() => {
    if (hasSingleVariant) return variants.nodes[0];

    return variants.nodes.find((variant) => {
      return variant.selectedOptions.every((option) => {
        return selectedOptions[option.name] === option.value;
      });
    });
  }, [selectedOptions, variants.nodes, hasSingleVariant]);

  const getNewSelectedOptions = (
    selectedOptions: Record<string, string>,
    name: string,
    value: string
  ) => {
    const newOptions = {
      ...selectedOptions,
      [name]: value,
    };

    const searchParams = new URLSearchParams(location.search);
    if (Object.keys(newOptions).length) {
      searchParams.set("options", encodeSelectedOptions(newOptions));
    } else {
      searchParams.delete("options");
    }

    const newLocation =
      searchParams.size > 0
        ? `${location.pathname}?${searchParams.toString()}`
        : location.pathname;

    return {
      location: newLocation,
      options: newOptions,
    };
  };

  const handleOptionSelect = (name: string, value: string) => {
    startTransition(() => {
      setSelectedOptions((prev) => {
        const newSelectedOptions = getNewSelectedOptions(
          selectedOptions,
          name,
          value
        );
        history.replaceState(null, "", newSelectedOptions.location);

        return newSelectedOptions.options;
      });
    });
  };

  const [result, formAction, pending] = useActionState<
    AddToCartResult | undefined,
    FormData
  >(async (_, formData) => {
    const addToCartPromise = action(formData);

    const result = await addToCartPromise;

    if (result.success) {
      onAddToCart?.();
    }

    return result;
  }, undefined);

  return (
    <form action={hydrated ? formAction : action} className="space-y-6">
      <input type="hidden" name="variantId" value={selectedVariant?.id ?? ""} />

      {/* Options Section */}
      {hasSingleVariant ? null : (
        <div className="space-y-4">
          {options.map((option) => (
            <div key={option.id} className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide">
                {option.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {option.optionValues.map((optionValue) => (
                  <Link
                    key={optionValue.id}
                    to={
                      getNewSelectedOptions(
                        selectedOptions,
                        option.name,
                        optionValue.name
                      ).location
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      handleOptionSelect(option.name, optionValue.name);
                    }}
                    data-selected={
                      selectedOptions[option.name] === optionValue.name
                        ? "true"
                        : undefined
                    }
                    className={buttonStyles()}
                  >
                    {optionValue.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Variant Info */}
      <div className="border-t pt-4">
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Price:</span>{" "}
            <span>
              {selectedVariant ? (
                formatPrice(selectedVariant.price)
              ) : (
                <span>
                  {formatPrice(priceRange.minVariantPrice)}
                  {priceRange.minVariantPrice.amount !==
                  priceRange.maxVariantPrice.amount ? (
                    <>
                      &nbsp;&ndash;&nbsp;
                      {formatPrice(priceRange.maxVariantPrice)}
                    </>
                  ) : null}
                </span>
              )}
            </span>
          </p>
          <p>
            <span className="font-semibold">Availability:</span>{" "}
            {selectedVariant ? (
              selectedVariant.availableForSale ? (
                "In Stock"
              ) : (
                "Out of Stock"
              )
            ) : (
              <>&#11834;</>
            )}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          className="block w-full"
          type="submit"
          isDisabled={!selectedVariant?.availableForSale}
          isPending={pending}
        >
          {pending ? "Adding..." : "Add to Cart"}
        </Button>
        {result?.error && <p className="text-error">{result.error}</p>}
      </div>
    </form>
  );
}
