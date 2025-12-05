import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-htaccess",
      closeBundle() {
        fs.copyFileSync("frontend/public/.htaccess", "dist/.htaccess");
      },
    },
  ],

  publicDir: "public",

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
