import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH: "/" for a root domain, "/<repo>/" for a GitHub Pages project site.
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  base: base.endsWith("/") ? base : `${base}/`,
  plugins: [react()],
  build: {
    target: "es2022",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/gsap")) return "gsap";
          if (id.includes("node_modules/react")) return "react";
          return undefined;
        },
      },
    },
  },
  ssr: {
    noExternal: ["gsap", "@fontsource-variable/jost", "@fontsource-variable/newsreader"],
  },
});
