---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "LH-personal blog"
  text: "个人博客 + 组件库"
  tagline: Vue3 + TypeScript + VitePress 驱动
  image:
    src: img/amazing-logo.svg
    alt: LH-IMG
  actions:
    - theme: brand
      text: 快速开始
      link: /markdown-examples
    - theme: alt
      text: 个人博客
      link: /blog/
    - theme: alt 
      text: 组件库  
      link: /components/MyButton

features:
  - icon: "🧩"
    title: 组件库
    details: 常用的 Vue3 组件，支持 TypeScript，代码简洁易懂。
    link: /components/MyButton
  - icon: "🛠️"
    title: 工具函数
    details: 常用的实用工具函数，涵盖常见场景。
    link: /utils/
  - icon: "📝"
    title: 博客文章
    details: 日常积累总结的前端核心知识点。
    link: /blog/
  - icon: "🚀"
    title: 自动路由
    details: 新增 .md 文件即自动生成路由和导航，无需手动配置。
  - icon: "📦"
    title: import.meta.glob
    details: 使用 Vite 的 glob 导入自动注册组件，零配置扩展。
  - icon: "🌐"
    title: GitHub Pages
    details: 一键部署到 GitHub Pages，免费托管你的个人站点。
    link: /blog/发布到GitHub步骤
---

