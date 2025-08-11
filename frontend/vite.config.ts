import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  base: "/app/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // Allow external connections for ARM compatibility
    port: 5173,
    proxy: {
      // Proxy API requests to the backend server
      "/api": {
        target: "http://127.0.0.1:8000", // Default backend address
        changeOrigin: true,
        // Optionally rewrite path if needed (e.g., remove /api prefix if backend doesn't expect it)
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext", // Use modern JS features for better ARM performance
    },
  },
  build: {
    target: "esnext", // Target modern browsers for ARM optimization
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          langchain: ["@langchain/core", "@langchain/langgraph-sdk"],
        },
      },
    },
  },
});
