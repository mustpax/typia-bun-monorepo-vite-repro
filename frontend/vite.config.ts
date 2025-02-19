import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import UnpluginTypia from "@ryoppippi/unplugin-typia/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [UnpluginTypia({}), react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/ws": {
        target: "ws://localhost:3000",
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
});
