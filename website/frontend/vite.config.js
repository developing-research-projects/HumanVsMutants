import path from "path"
import envcompatible from 'vite-plugin-env-compatible'
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  envPrefix: "VITE_",
  plugins: [
    react(),
    envcompatible(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
