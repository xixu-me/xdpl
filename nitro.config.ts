import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: ".",
  compatibilityDate: "2026-03-17",
  routeRules: {
    "/google/**": {
      proxy: "https://translate.googleapis.com/**",
    },
    "/**": {
      proxy: "https://www2.deepl.com/**",
    },
  },
});
