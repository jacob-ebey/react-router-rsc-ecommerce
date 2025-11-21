import { graphql, readFragment } from "gql.tada";
import { Fragment, Suspense, ViewTransition } from "react";
import type { Register } from "react-router";

import { AddToCartForm } from "@/components/add-to-cart-form/add-to-cart-form";
import { addToCartAction } from "@/components/add-to-cart-form/add-to-cart-form.actions";
import { productOptionsFragment } from "@/components/add-to-cart-form/add-to-cart-form.fragment";
import { FillRow, Grid, GridCol, GridRow } from "@/components/grid/grid";
import {
  ProductCard,
  ProductCardBody,
  ProductCardFallback,
  ProductCardImages,
  ProductCardPrice,
  ProductCardTitle,
} from "@/components/product-card/product-card";
import { cacheLife } from "@/lib/cache";
import { NotFoundError } from "@/lib/errors";
import { getClient } from "@/lib/gql";
import { setCartOpen } from "@/routes/root/client";

import { ProductRouteTransition } from "./client";

export default async function ProductRoute({
  params: { productHandle },
}: Register["pages"]["/p/:productHandle"]) {
  const product = await getProduct(productHandle);

  return (
    <>
      <title>{`${product.title} | Remix Store`}</title>
      <meta name="description" content={product.description || product.title} />

      <ProductRouteTransition handle={product.handle}>
        <Grid nested>
          <GridRow className="grid-cols-1 lg:grid-cols-[3fr_2fr]">
            {/* Product Images */}
            <GridCol>
              {product.images.nodes.map((image, index) => (
                <div
                  key={image.url as string}
                  className="relative aspect-square overflow-hidden"
                >
                  {(() => {
                    const Wrapper = index === 0 ? ViewTransition : Fragment;
                    const props =
                      Wrapper === ViewTransition
                        ? {
                            name: `product-image--${product.handle}`,
                          }
                        : {};
                    return (
                      <Wrapper {...props}>
                        <img
                          src={image.url as string}
                          alt={
                            image.altText ||
                            `${product.title} - Image ${index + 1}`
                          }
                          className="h-full w-full object-cover"
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      </Wrapper>
                    );
                  })()}
                </div>
              ))}
            </GridCol>

            {/* Product Details */}
            <GridCol>
              <div className="sticky top-0 paper border-y-2 -mt-0.5 -mb-0.5">
                <ViewTransition name={`product-card-body--${product.handle}`}>
                  <div className="space-y-6 p-4 md:p-6 ">
                    <div>
                      <ViewTransition name={`product-title--${product.handle}`}>
                        <h1 className="text-3xl font-bold tracking-tight">
                          {product.title}
                        </h1>
                      </ViewTransition>
                    </div>

                    {product.description && (
                      <div className="prose text-text-dimmed max-w-none">
                        <p>{product.description}</p>
                      </div>
                    )}

                    <AddToCartForm
                      action={addToCartAction}
                      product={readFragment(productOptionsFragment, product)}
                      onAddToCart={setCartOpen}
                    />

                    {/* Product Meta */}
                    {product.vendor && (
                      <div className="text-sm text-text-dimmed-600">
                        <p>
                          <span className="font-medium">Vendor:</span>{" "}
                          {product.vendor}
                        </p>
                      </div>
                    )}
                  </div>
                </ViewTransition>
              </div>
            </GridCol>
          </GridRow>

          <GridRow>
            <Suspense
              fallback={
                <GridRow>
                  <Grid nested>
                    <GridRow className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <GridCol key={index}>
                          <ProductCardFallback />
                        </GridCol>
                      ))}
                    </GridRow>
                  </Grid>
                </GridRow>
              }
            >
              <RecommendedProducts productId={product.id} />
            </Suspense>
          </GridRow>
        </Grid>
      </ProductRouteTransition>
    </>
  );
}

async function RecommendedProducts({ productId }: { productId: string }) {
  const recommendedProducts = await getRecommendedProducts(productId).then(
    (all) => all?.filter((r) => r.id !== productId).slice(0, 8),
  );

  if (!recommendedProducts?.length) return null;

  return (
    <Grid nested>
      <GridRow className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {recommendedProducts.map((recommendedProduct) => (
          <GridCol key={recommendedProduct.handle}>
            <ProductCard
              to={`/p/${recommendedProduct.handle}`}
              className="h-full p-4 -outline-offset-2"
            >
              <ProductCardImages
                loading="lazy"
                viewTransitionName={`product-image--${recommendedProduct.handle}`}
                images={recommendedProduct.images.nodes.map(
                  (img) => img.url as string,
                )}
              />
              <ViewTransition
                name={`product-card-body--${recommendedProduct.handle}`}
              >
                <ProductCardBody>
                  <ViewTransition
                    name={`product-title--${recommendedProduct.handle}`}
                  >
                    <ProductCardTitle>
                      {recommendedProduct.title}
                    </ProductCardTitle>
                  </ViewTransition>
                  <ViewTransition
                    name={`product-price--${recommendedProduct.handle}`}
                  >
                    <ProductCardPrice
                      currency={
                        recommendedProduct.priceRange.minVariantPrice
                          .currencyCode
                      }
                      amount={
                        recommendedProduct.priceRange.minVariantPrice
                          .amount as string
                      }
                    />
                  </ViewTransition>
                </ProductCardBody>
              </ViewTransition>
            </ProductCard>
          </GridCol>
        ))}
        <FillRow
          cols={[
            ["default", 1],
            ["sm", 2],
            ["xl", 4],
          ]}
          count={recommendedProducts.length}
        />
      </GridRow>
    </Grid>
  );
}

async function getProduct(handle: string) {
  "use cache";
  cacheLife("hours");

  const client = getClient();
  const result = await client.query(
    graphql(
      `
        query ProductRoute($handle: String!) {
          product(handle: $handle) {
            ...ProductOptions
            id
            title
            description
            vendor
            handle
            images(first: 2) {
              nodes {
                url(transform: { maxWidth: 1000, preferredContentType: WEBP })
                altText
              }
            }
          }
        }
      `,
      [productOptionsFragment],
    ),
    { handle },
  );

  if (!result.data?.product) {
    throw new NotFoundError(`Could not find ${handle}.`);
  }

  return result.data?.product;
}

async function getRecommendedProducts(productId: string) {
  "use cache";
  cacheLife("hours");

  const client = getClient();
  const result = await client.query(
    graphql(`
      query RecommendedProducts($productId: ID!) {
        productRecommendations(productId: $productId, intent: RELATED) {
          id
          handle
          title
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 2) {
            nodes {
              url(transform: { maxWidth: 800, preferredContentType: WEBP })
            }
          }
        }
      }
    `),
    { productId },
  );

  return result.data?.productRecommendations;
}
