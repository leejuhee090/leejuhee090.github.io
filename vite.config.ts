import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 소스는 portfolio-src/에 두고, 결과물은 루트의 portfolio-dist/에 만듭니다.
// 루트 index.html(기존 사이트)은 건드리지 않습니다.
export default defineConfig({
  root: "portfolio-src",
  base: "./",
  plugins: [react()],
  build: {
    outDir: "../portfolio-dist",
    emptyOutDir: true,
  },
});
