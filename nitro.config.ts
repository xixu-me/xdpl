//https://nitro.unjs.io/config
export default defineNitroConfig({
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
