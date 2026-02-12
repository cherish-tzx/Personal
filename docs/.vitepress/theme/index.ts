/* ============================================
 * 自定义主题入口
 *
 * 核心功能：使用 import.meta.glob 自动注册所有组件
 * 新增组件后无需手动 import，直接在 .md 中使用即可
 * ============================================ */
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'
import { h } from 'vue'
// import FloatingButtons from './components/FloatingButtons.vue'

// 关键：import.meta.glob 批量导入所有 .vue 组件
// eager: true 表示立即导入（非懒加载）
const modules = import.meta.glob('../../../package/components/*.vue', {
  eager: true,
})

const MyTheme: Theme = {
  extends: DefaultTheme,
  // 在默认布局的末尾插入悬浮按钮组件
  Layout() {
    return h(DefaultTheme.Layout, null, {
    //   'layout-bottom': () => h(FloatingButtons),
    })
  },
  enhanceApp({ app }) {
    // 遍历所有组件模块，自动注册为全局组件
    for (const path in modules) {
      const mod = modules[path] as any
      // 从文件路径提取组件名，例如 MyButton.vue -> MyButton
      const name = path.split('/').pop()?.replace('.vue', '') || ''
      if (name && mod.default) {
        app.component(name, mod.default)
      }
    }
  },
}

export default MyTheme
