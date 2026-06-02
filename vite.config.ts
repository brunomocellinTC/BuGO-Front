import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    base: env.VITE_BASENAME || "/BuGO-Front/",
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": "http://localhost:3000"
      }
    },
    build: {
      outDir: "dist"
    }
  };
});