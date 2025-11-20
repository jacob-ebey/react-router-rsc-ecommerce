import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc/plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { useCachePlugin } from "vite-plugin-react-use-cache";
import tsconfigPaths from "vite-tsconfig-paths";
import "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    react(),
    process.env.NODE_ENV !== "test" &&
      process.env.npm_lifecycle_event !== "storybook" &&
      rsc({
        entries: {
          client: "src/entry.browser.tsx",
          rsc: "src/entry.rsc.tsx",
          ssr: "src/entry.ssr.tsx",
        },
      }),
    useCachePlugin(),
    devtoolsJson(),
  ],
  optimizeDeps: {
    include: [
      "clsx",
      "react-router",
      "react-router/dom",
      "react-router/internal/react-server-client",
      "tailwind-merge",
    ],
  },
  test: {
    projects: [
      {
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
