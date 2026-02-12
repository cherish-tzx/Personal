import { defineConfig } from "vitepress";
import fs from "fs";
import path from "path";

/* ============================================
 * 自然排序：让数字按数值大小排序（ES5 < ES6 < ... < ES10 < ES11）
 * ============================================ */
function naturalSort(a: string, b: string): number {
  const segment = (s: string) =>
    s.split(/(\d+)/).map((part) => (/^\d+$/.test(part) ? parseInt(part, 10) : part));
  const segA = segment(a);
  const segB = segment(b);
  const len = Math.min(segA.length, segB.length);
  for (let i = 0; i < len; i++) {
    const x = segA[i];
    const y = segB[i];
    if (typeof x === "number" && typeof y === "number") {
      if (x !== y) return x - y;
    } else {
      const s = String(x).localeCompare(String(y), "zh-CN");
      if (s !== 0) return s;
    }
  }
  return segA.length - segB.length;
}

/* ============================================
 * 自动生成侧边栏
 * 读取指定目录下的所有 .md 文件，按自然排序后生成侧边栏配置
 * 新增文件后无需手动修改配置，重启 dev 即可生效
 * ============================================ */
function getSidebarItems(dir: string, basePath: string) {
  const fullPath = path.resolve(__dirname, "..", dir);
  // 如果目录不存在，返回空数组
  if (!fs.existsSync(fullPath)) return [];

  const files = fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith(".md") && file !== "index.md")
    .sort(naturalSort);

  return files.map((file) => {
    const name = file.replace(".md", "");
    // 读取文件第一行作为标题
    const content = fs.readFileSync(path.join(fullPath, file), "utf-8");
    const title = content.match(/^#\s+(.+)/m)?.[1] || name;
    return { text: title, link: `${basePath}/${name}` };
  });
}
export default defineConfig({
  // 站点基本信息
  title: "LH-personal blog",
  description: "个人博客 + 组件库 — Vue3 + TypeScript + VitePress",

  // 浏览器标签页图标（favicon）：修改下面路径即可更换
  head: [
    ["link", { rel: "icon", href: "/img/amazing-icon.svg", type: "image/svg+xml" }],
  ],

  // 主题配置
  themeConfig: {
    // 导航栏左侧 Logo：修改路径即可更换（留空则不显示 logo）
    logo: "/img/amazing-logo.svg",
    // 顶部导航栏
    nav: [
      { text: "首页", link: "/" },
      // { text: "指南", link: "/guide/" },
      { text: "组件", link: "/components/MyButton" },
      { text: "工具函数", link: "/utils/" },
      { text: "博客", link: "/blog/" },
    ],

        // lastUpdated: true, // 最后更新时间戳
        lastUpdated: {
          text: '最后更新于', // Last updated
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'medium'
          }
        },

    // 侧边栏 — 使用自动生成
    sidebar: {
      "/components/": [
        {
          text: "组件库",
          items: getSidebarItems("components", "/components"),
        },
      ],
      "/blog/": [
        {
          text: "博客",
          items: [
            { text: "博客首页（完整文章列表）", link: "/blog/" },
            ...getSidebarItems("blog", "/blog/"),
          ],
        },
      ],
      "/utils/": [
        {
          text: "工具函数",
          items: [{ text: "工具函数总览", link: "/utils/" }],
        },
      ],
      // "/guide/": [
      //   {
      //     text: "指南",
      //     items: [
      //       { text: "快速开始", link: "/guide/" },
      //       { text: "部署到 GitHub", link: "/guide/deploy" },
      //     ],
      //   },
      // ],
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    // 社交链接
    socialLinks: [
      { icon: "github", link: "https://github.com/your-username/my-blog" },
    ],

    // 页脚
    footer: {
      message: "VitePress+Vue3+TypeScript+Vite",
      copyright: "© 2026 LH",
    },

    // 搜索
    search: { provider: "local" },
  },
});
