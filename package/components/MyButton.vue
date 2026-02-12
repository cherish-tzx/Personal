<!-- MyButton 按钮组件 — 支持 type/size/disabled -->
<template>
    <button
      class="my-btn"
      :class="[`my-btn--${type}`, `my-btn--${size}`, { 'my-btn--disabled': disabled }]"
      :disabled="disabled"
      @click="handleClick"
    >
      <slot />
    </button>
  </template>
  
  <script setup lang="ts">
  /* ---- Props 定义 ---- */
  const props = withDefaults(
    defineProps<{
      type?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
      size?: 'small' | 'medium' | 'large'
      disabled?: boolean
    }>(),
    { type: 'default', size: 'medium', disabled: false }
  )
  
  /* ---- 事件 ---- */
  const emit = defineEmits<{ click: [e: MouseEvent] }>()
  
  function handleClick(e: MouseEvent) {
    if (!props.disabled) emit('click', e)
  }
  </script>
  
  <style scoped>
  .my-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.25s;
    background: #fff;
    color: #333;
    line-height: 1;
  }
  
  /* --- 尺寸 --- */
  .my-btn--small  { padding: 6px 12px; font-size: 12px; }
  .my-btn--medium { padding: 8px 16px; font-size: 14px; }
  .my-btn--large  { padding: 12px 24px; font-size: 16px; }
  
  /* --- 类型 --- */
  .my-btn--primary { background: #4f46e5; color: #fff; border-color: #4f46e5; }
  .my-btn--primary:hover { background: #6366f1; }
  .my-btn--success { background: #10b981; color: #fff; border-color: #10b981; }
  .my-btn--success:hover { background: #34d399; }
  .my-btn--warning { background: #f59e0b; color: #fff; border-color: #f59e0b; }
  .my-btn--warning:hover { background: #fbbf24; }
  .my-btn--danger  { background: #ef4444; color: #fff; border-color: #ef4444; }
  .my-btn--danger:hover  { background: #f87171; }
  .my-btn--default:hover { border-color: #4f46e5; color: #4f46e5; }
  
  /* --- 禁用 --- */
  .my-btn--disabled { opacity: 0.5; cursor: not-allowed; }
  </style>
  