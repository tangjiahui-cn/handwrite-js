import { defineConfig } from 'vite'
import { createHtmlPlugin } from "vite-plugin-html";
const dayjs = require("dayjs");

// 是否构建为github部署页面
const isDeployGithub = process.env.deploy === "github";

export default defineConfig ({
  server: {
    port: 9999,
    host: '0.0.0.0'
  },
  base: "./",
  plugins: [
    createHtmlPlugin({
      minify: true,
      pages: [
        {
          entry: "playground/main.tsx",
          filename: "index.html",
          template: "index.html",
          injectOptions: {
            data: {
              injectScript: isDeployGithub
                  ? `<script>console.log('version ${pkg.version}\t(Last build：${dayjs().format(
                      "YYYY-MM-DD HH:mm:ss",
                  )} ${Intl.DateTimeFormat().resolvedOptions().timeZone})')</script>`
                  : "",
            },
          },
        },
      ],
    }),
  ]
})
