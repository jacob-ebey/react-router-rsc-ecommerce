import { cache } from "react";

import { cacheExchange, createClient, fetchExchange } from "@urql/core";

export const getClient = cache(() => {
  const PUBLIC_STORE_URL = process.env.PUBLIC_STORE_URL;
  if (!PUBLIC_STORE_URL) {
    throw new Error("Missing PUBLIC_STORE_DOMAIN env variable");
  }

  const PUBLIC_STOREFRONT_API_TOKEN = process.env.PUBLIC_STOREFRONT_API_TOKEN;

  const client = createClient({
    exchanges: [cacheExchange, fetchExchange],
    url: PUBLIC_STORE_URL,
    preferGetMethod: false,
    fetchOptions: {
      headers: PUBLIC_STOREFRONT_API_TOKEN
        ? {
            "X-Shopify-Storefront-Access-Token": PUBLIC_STOREFRONT_API_TOKEN,
          }
        : undefined,
    },
  });

  return client;
});
