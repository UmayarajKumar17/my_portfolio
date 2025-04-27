import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: true,
    },
  },
  plugins: [
    react(),
    // mode === 'development' &&
    // componentTagger(),
  ].filter(Boolean),
  base: '/my_portfolio/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react-ga4'],
    force: true
  },
  build: {
    rollupOptions: {
      external: [],
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
  }
}));
