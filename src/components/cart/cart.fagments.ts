import { graphql } from "gql.tada";

import type { ResultOf, FragmentOf } from "gql.tada";

export const cartFragment = graphql(`
  fragment CartFragment on Cart {
    id
    checkoutUrl
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              url(transform: { maxWidth: 256 })
            }
            product {
              title
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
    }
  }
`);

export type CartFragment = ResultOf<typeof cartFragment>;
