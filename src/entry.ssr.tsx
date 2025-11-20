import { createFromReadableStream } from "@vitejs/plugin-rsc/ssr";
import { renderToReadableStream as renderHTMLToReadableStream } from "react-dom/server.edge";
import {
  unstable_routeRSCServerRequest as routeRSCServerRequest,
  unstable_RSCStaticRouter as RSCStaticRouter,
} from "react-router";
import { decodeError, StatusCodeError } from "./lib/errors";

export async function generateHTML(
  request: Request,
  fetchServer: (request: Request) => Promise<Response>
): Promise<Response> {
  let headers: Headers | undefined;
  let overrideStatus: number | undefined;

  const response = await routeRSCServerRequest({
    // The incoming request.
    request,
    // How to call the React Server.
    fetchServer,
    // Provide the React Server touchpoints.
    createFromReadableStream,
    // Render the router to HTML.
    async renderHTML(getPayload) {
      const payload = await getPayload();
      const formState =
        payload.type === "render" ? await payload.formState : undefined;

      const bootstrapScriptContent =
        await import.meta.viteRsc.loadBootstrapScriptContent("index");

      return await renderHTMLToReadableStream(
        <RSCStaticRouter getPayload={getPayload} />,
        {
          bootstrapScriptContent,
          // @ts-expect-error - no types for this yet
          formState,
          signal: request.signal,
          onHeaders(_headers) {
            headers = _headers;
          },
          onError(error) {
            const decoded = decodeError(error);
            if (decoded.success) {
              if (decoded.error instanceof StatusCodeError) {
                overrideStatus = decoded.error.status;
              }

              return decoded.digest;
            }

            if (!request.signal.aborted) {
              console.error(error);
            }
          },
        }
      );
    },
  });

  const allHeaders = new Headers(headers);
  response.headers.forEach((value, key) => {
    allHeaders.append(key, value);
  });

  return new Response(response.body, {
    headers: allHeaders,
    status:
      typeof overrideStatus === "number" ? overrideStatus : response.status,
    statusText: response.statusText,
  });
}
