# MyButton 按钮

通用按钮组件，支持多种类型、尺寸和禁用状态。

## 基础用法

按钮有 5 种类型：`default` `primary` `success` `warning` `danger`。

<div class="demo-block">
  <MyButton>默认按钮</MyButton>
  <MyButton type="primary">主要按钮</MyButton>
  <MyButton type="success">成功按钮</MyButton>
  <MyButton type="warning">警告按钮</MyButton>
  <MyButton type="danger">危险按钮</MyButton>
</div>

```vue
<MyButton>默认按钮</MyButton>
<MyButton type="primary">主要按钮</MyButton>
<MyButton type="success">成功按钮</MyButton>
<MyButton type="warning">警告按钮</MyButton>
<MyButton type="danger">危险按钮</MyButton>
```

## 不同尺寸

通过 `size` 属性设置按钮尺寸。

<div class="demo-block">
  <MyButton type="primary" size="small">小按钮</MyButton>
  <MyButton type="primary" size="medium">中按钮</MyButton>
  <MyButton type="primary" size="large">大按钮</MyButton>
</div>

```vue
<MyButton type="primary" size="small">小按钮</MyButton>
<MyButton type="primary" size="medium">中按钮</MyButton>
<MyButton type="primary" size="large">大按钮</MyButton>
```

## 禁用状态

设置 `disabled` 属性禁用按钮。

<div class="demo-block">
  <MyButton disabled>禁用按钮</MyButton>
  <MyButton type="primary" disabled>禁用主要</MyButton>
</div>

```vue
<MyButton disabled>禁用按钮</MyButton>
<MyButton type="primary" disabled>禁用主要</MyButton>
```

## API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| type | 按钮类型 | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'default'` | `'default'` |
| size | 按钮尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled | 是否禁用 | `boolean` | `false` |

| 事件 | 说明 | 参数 |
|------|------|------|
| click | 点击事件 | `(e: MouseEvent)` |
