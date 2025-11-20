import { graphql } from "gql.tada";

import { FillRow, Grid, GridCol, GridRow } from "@/components/grid/grid";
import {
  ProductCard,
  ProductCardBody,
  ProductCardImages,
  ProductCardPrice,
  ProductCardTitle,
} from "@/components/product-card/product-card";
import { cacheLife } from "@/lib/cache";
import { getClient } from "@/lib/gql";
import type { Register } from "react-router";

export default async function CategoryRoute({
  params: { collectionHandle = "all" },
}: Register["pages"]["/"] & Register["pages"]["/c/:collectionHandle"]) {
  const { title, description, products } = await getCollection(
    collectionHandle
  );

  return (
    <>
      <title>{`${title} | Remix Store`}</title>
      <meta
        name="description"
        content={`Browse the ${title} collection. ${description || ""}`}
      />

      {(products?.length ?? 0) > 0 ? (
        <Grid nested>
          <GridRow className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {products!.map((product, index) => (
              <GridCol key={product.handle}>
                <ProductCard
                  to={`/p/${product.handle}`}
                  className="h-full p-4 -outline-offset-2"
                >
                  <ProductCardImages
                    loading={index < 4 ? "eager" : "lazy"}
                    images={product.images.nodes.map(
                      (img) => img.url as string
                    )}
                  />

                  <ProductCardBody>
                    <ProductCardTitle>{product.title}</ProductCardTitle>

                    <ProductCardPrice
                      currency={product.priceRange.minVariantPrice.currencyCode}
                      amount={
                        product.priceRange.minVariantPrice.amount as string
                      }
                    />
                  </ProductCardBody>
                </ProductCard>
              </GridCol>
            ))}
            <FillRow
              cols={[
                ["default", 1],
                ["sm", 2],
                ["xl", 4],
              ]}
              count={products!.length}
            />
          </GridRow>
        </Grid>
      ) : (
        <article className="prose max-w-none p-8 md:p-12">
          <h1>No Products Found</h1>
          <p>
            There are no products available at this time in the "
            {collectionHandle}" collection.
          </p>
        </article>
      )}
    </>
  );
}

const CollectionQuery = graphql(`
  query Collection($handle: String!) {
    collection(handle: $handle) {
      title
      description
      products(first: 100, sortKey: BEST_SELLING) {
        nodes {
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
    }
  }
`);

async function getCollection(handle: string) {
  "use cache";
  cacheLife("hours");

  const client = getClient();
  const result = await client.query(CollectionQuery, { handle });

  return {
    title: result.data?.collection?.title || handle,
    description: result.data?.collection?.description,
    products: result.data?.collection?.products.nodes,
  };
}
