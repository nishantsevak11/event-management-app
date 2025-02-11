import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // ✅ Ensure correct base path
  server: {
    port: 3000, // ✅ Ensure correct local port
  },
  build: {
    outDir: "dist", // ✅ Ensure Vercel recognizes the build folder
  },
});
