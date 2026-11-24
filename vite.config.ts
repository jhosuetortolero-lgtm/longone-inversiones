import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH: "/" for a root domain, "/<repo>/" for a GitHub Pages project site.
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  base: base.endsWith("/") ? base : `${base}/`,
  plugins: [react()],
  build: {
    // Every iPhone browser (Safari, Brave, Chrome…) runs the system WebKit: keep the
    // output parseable by iOS 15+ as well as current Android/desktop browsers.
    target: ["safari15", "ios15", "chrome100", "edge100", "firefox100"],
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
