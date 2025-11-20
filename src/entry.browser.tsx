import {
  createFromReadableStream,
  createTemporaryReferenceSet,
  encodeReply,
  setServerCallback,
} from "@vitejs/plugin-rsc/browser";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import type { DataRouter } from "react-router";
import {
  unstable_createCallServer as createCallServer,
  unstable_getRSCStream as getRSCStream,
  unstable_RSCHydratedRouter as RSCHydratedRouter,
  type unstable_RSCPayload as RSCServerPayload,
} from "react-router/dom";

async function clearCache(cache: Cache): Promise<void> {
  const keys = await cache.keys();
  await Promise.all(keys.map((key) => cache.delete(key)));
}

async function openAndClearCache(cacheName: string): Promise<Cache> {
  const cache = await caches.open(cacheName);
  await clearCache(cache);
  return cache;
}

let clearCachePromise: Promise<void> | null = null;
const openDataCachePromise = openAndClearCache("react-router");
function clearDataCache() {
  return (clearCachePromise = Promise.resolve(openDataCachePromise).then(() =>
    openDataCachePromise.then((cache) => clearCache(cache))
  ));
}

async function fetchServer(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    const [response] = await Promise.all([fetch(request), clearDataCache()]);
    return response;
  }

  await clearCachePromise;

  const cache = await openDataCachePromise;
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);
  await cache.put(request, response.clone());

  return response;
}

// Create and set the callServer function to support post-hydration server actions.
setServerCallback(
  createCallServer({
    createFromReadableStream,
    createTemporaryReferenceSet,
    encodeReply,
    fetch: fetchServer,
  })
);

const documentResponseStatus = (
  window.performance.getEntriesByType("navigation")?.[0] as {
    responseStatus?: number;
  }
)?.responseStatus;

let rscStream = getRSCStream();

if (documentResponseStatus) {
  let [stream, cacheStream] = rscStream.tee();
  rscStream = stream;
  openDataCachePromise.then((cache) => {
    const url = new URL(window.location.href);
    if (url.pathname === "/") {
      url.pathname = "/_root.rsc";
    } else {
      url.pathname = `${url.pathname}.rsc`;
    }
    cache.put(
      url,
      new Response(cacheStream, { status: documentResponseStatus })
    );
  });
}

// Get and decode the initial server payload
Promise.resolve(createFromReadableStream<RSCServerPayload>(rscStream))
  .then((payload) => {
    startTransition(async () => {
      const formState =
        payload.type === "render" ? await payload.formState : undefined;

      hydrateRoot(
        document,
        <StrictMode>
          <RSCHydratedRouter
            createFromReadableStream={createFromReadableStream}
            payload={payload}
            routeDiscovery="lazy"
            fetch={fetchServer}
          />
        </StrictMode>,
        {
          // @ts-expect-error - no types for this yet
          formState,
          onUncaughtError(error, errorInfo) {
            console.error("Uncaught React error:", error, errorInfo);
          },
        }
      );
    });
  })
  .catch(console.error);

if (import.meta.hot) {
  import.meta.hot.on("rsc:update", () => {
    clearDataCache();
    const globalVar = window as unknown as {
      __reactRouterDataRouter: DataRouter;
    };
    globalVar.__reactRouterDataRouter.revalidate();
  });
}
