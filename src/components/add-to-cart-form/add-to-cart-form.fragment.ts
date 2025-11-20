import { graphql } from "gql.tada";

import type { ResultOf } from "gql.tada";

export const productOptionsFragment = graphql(`
  fragment ProductOptions on Product {
    handle
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      id
      name
      optionValues {
        id
        name
      }
    }
    variants(first: 100) {
      nodes {
        id
        title
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        availableForSale
      }
    }
  }
`);

export type ProductOptionsFragment = ResultOf<typeof productOptionsFragment>;
