import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    // legacy({
    //   targets: ["defaults", "not IE 11"],
    //   // This will ensure the legacy helper is properly applied
    //   polyfills: true,
    //   // Make a more efficient modern bundle
    //   modernPolyfills: true
    // })
  ],
  build: {
    outDir: "assets",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        "serinity": resolve(__dirname, "src/js/index.js")
      },
      output: {
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name][extname]';
          }
          return '[name][extname]';
        }
      }
    }
  }
});