import {
  createTemporaryReferenceSet,
  decodeAction,
  decodeFormState,
  decodeReply,
  loadServerAction,
  renderToReadableStream,
} from "@vitejs/plugin-rsc/rsc";
import { unstable_matchRSCServerRequest as matchRSCServerRequest } from "react-router";
import { provideCache } from "vite-plugin-react-use-cache/runtime";
import { createUnstorageCache } from "vite-plugin-react-use-cache/unstorage";
import { createStorage } from "unstorage";
import createFsDriver from "unstorage/drivers/fs";

import { encodeError } from "@/lib/errors";
import { provideSession } from "@/lib/session";
import { routes } from "@/routes/config";

export function fetchServer(request: Request) {
  let waitUntilPromise: Promise<void>;

  return provideCache(
    createUnstorageCache(
      createStorage({
        driver: createFsDriver({
          base: "./node_modules/.cache/rsc",
        }),
      })
    ),
    () =>
      provideSession(request, () => {
        const responsesPromise = matchRSCServerRequest({
          // Provide the React Server touchpoints.
          createTemporaryReferenceSet,
          decodeAction,
          decodeFormState,
          decodeReply,
          loadServerAction,
          // The incoming request.
          request,
          // The app routes.
          routes,
          // Encode the match with the React Server implementation.
          generateResponse(match, options) {
            return new Response(
              renderToReadableStream(match.payload, {
                ...options,
                onError(error: unknown) {
                  const encoded = encodeError(error);
                  if (encoded.success) {
                    return encoded.digest;
                  }
                },
              }),
              {
                status: match.statusCode,
                headers: match.headers,
              }
            );
          },
        }).then((response) => [response, response.clone()]);

        waitUntilPromise = responsesPromise.then(([, clone]) =>
          clone.body?.pipeTo(new WritableStream())
        );

        return responsesPromise.then(([response]) => response);
      }),
    () => waitUntilPromise
  );
}

export default {
  async fetch(request: Request) {
    // Import the generateHTML function from the client environment
    const ssr = await import.meta.viteRsc.loadModule<
      typeof import("./entry.ssr")
    >("ssr", "index");

    return ssr.generateHTML(request, fetchServer);
  },
};

if (import.meta.hot) {
  import.meta.hot.accept();
}
