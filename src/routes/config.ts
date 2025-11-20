import type { unstable_RSCRouteConfig as RSCRouteConfig } from "react-router";

declare module "react-router" {
  interface Register {
    pages: {
      "/": {
        params: {};
      };
      "/cart": {
        params: {};
      };
      "/c/:collectionHandle": {
        params: {
          collectionHandle: string;
        };
      };
      "/p/:productHandle": {
        params: {
          productHandle: string;
        };
      };
      "/about": {
        params: {};
      };
    };
  }
}

export const routes = [
  {
    id: "root",
    path: "",
    lazy: () => import("./root/route"),
    children: [
      {
        id: "home",
        index: true,
        lazy: () => import("./category/route"),
      },
      {
        id: "cart",
        path: "cart",
        lazy: () => import("./cart/route"),
      },
      {
        id: "cdp",
        path: "c/:collectionHandle",
        lazy: () => import("./category/route"),
      },
      {
        id: "pdp",
        path: "p/:productHandle",
        lazy: () => import("./product/route"),
      },
      {
        id: "about",
        path: "about",
        lazy: () => import("./about/route"),
      },
    ],
  },
] satisfies RSCRouteConfig;
