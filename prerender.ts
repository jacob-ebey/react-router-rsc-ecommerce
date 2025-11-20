import { mkdir, writeFile } from "node:fs/promises";

// @ts-expect-error - no types for the build
import handler, { fetchServer } from "./dist/rsc/index.js";
// @ts-expect-error - no types for the build
import { generateHTML } from "./dist/ssr/index.js";

const prerender = ["/", "/c/apparel", "/c/home-office"];

for (const path of prerender) {
  const request = new Request(`http://localhost:3000${path}`);
  const rscResponsePromise: Promise<Response> = fetchServer(request);
  const manifestResponse: null | Promise<Response> =
    path !== "/"
      ? handler(new Request(`http://localhost:3000${path}.manifest`))
      : null;
  const rscResponseClonePromise = rscResponsePromise.then((response) =>
    response.clone()
  );

  const htmlResponse: Response = await generateHTML(
    request,
    async () => rscResponsePromise
  );

  if (htmlResponse.status !== 200) {
    throw new Error(`Failed to prerender ${path}`);
  }

  await mkdir("dist/client" + path, { recursive: true });

  await Promise.all([
    manifestResponse
      ?.then((response) => response.text())
      .then((manifest) =>
        writeFile(
          "dist/client" + path + (path === "/" ? "_root.rsc" : ".manifest"),
          manifest,
          "utf-8"
        )
      ),
    rscResponseClonePromise
      .then((response) => response.text())
      .then((rsc) =>
        writeFile(
          "dist/client" + path + (path === "/" ? "_root.rsc" : ".rsc"),
          rsc,
          "utf-8"
        )
      ),
    htmlResponse
      .text()
      .then((html) =>
        writeFile(
          "dist/client" + path + (path === "/" ? path : "/") + "index.html",
          html,
          "utf-8"
        )
      ),
  ]);
}
