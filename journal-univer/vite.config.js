// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 6173,
    proxy: {
      // 代理所有以 /api 开头的请求
      "/api/happyq": {
        target: "http://localhost:3000/api/happyq", // 目标服务器
        changeOrigin: true, // 修改请求头中的 Origin
        rewrite: (path) => path.replace(/^\/api\/happyq/, ""), // 重写路径
      },
    },
  },
});
