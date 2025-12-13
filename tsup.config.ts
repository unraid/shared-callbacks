import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    client: "src/client.ts",
    server: "src/server.ts",
  },
  format: ["esm"],
  target: "es2020",
  platform: "neutral",
  splitting: false,
  sourcemap: false,
  clean: false,
  dts: false,
  treeshake: true,
  noExternal: ["crypto-js"],
});
