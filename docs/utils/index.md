# 工具函数

项目内置了 6 大类实用工具函数，涵盖日常开发中最常见的场景。

## 格式化工具（format.ts）

```ts
import { formatDate, formatMoney, formatFileSize } from '@utils'

// 格式化日期
formatDate(new Date(), 'YYYY-MM-DD')        // '2026-02-06'
formatDate('2026-01-01', 'YYYY年MM月DD日')   // '2026年01月01日'

// 格式化金额（千分位）
formatMoney(1234567.89)       // '1,234,567.89'
formatMoney(1234567.89, 0)    // '1,234,568'

// 格式化文件大小
formatFileSize(1024)          // '1.00 KB'
formatFileSize(1073741824)    // '1.00 GB'
```

## 存储工具（storage.ts）

```ts
import { setStorage, getStorage, removeStorage } from '@utils'

// 设置存储（可选过期时间，单位：秒）
setStorage('token', 'abc123', 3600) // 1小时后过期
setStorage('user', { name: '张三' })  // 永不过期

// 获取存储（过期自动返回 null）
getStorage<string>('token')     // 'abc123' 或 null
getStorage<object>('user')      // { name: '张三' }

// 删除存储
removeStorage('token')
```

## DOM 工具（dom.ts）

```ts
import { copyToClipboard, scrollToTop } from '@utils'

// 复制文本到剪贴板
await copyToClipboard('Hello World') // 返回 true/false

// 平滑滚动到顶部
scrollToTop()
scrollToTop(false) // 不要动画
```

### 图片悬浮放大 / 移出恢复（纯 CSS）

鼠标悬浮时图片放大，移开鼠标后恢复原样，用 CSS 即可实现，无需 JS：

```css
.image-wrap {
  display: inline-block;
  overflow: hidden;
}
.image-wrap img {
  display: block;
  transition: transform 0.35s ease;
}
/* 悬浮 → 放大 */
.image-wrap:hover img {
  transform: scale(1.1);
}
/* 移出 → 恢复（不写也可，默认即 scale(1)） */
.image-wrap:not(:hover) img {
  transform: scale(1);
}
```

```html
<div class="image-wrap">
  <img src="your-image.png" alt="图片" />
</div>
```

要点：给**容器**加 `overflow: hidden` 避免放大时溢出；给 **img** 加 `transition`，悬浮时 `transform: scale(...)`，移出后自动恢复。

## 校验工具（validate.ts）

```ts
import { isPhone, isEmail, isURL, isEmpty } from '@utils'

isPhone('13800138000')   // true
isEmail('test@test.com') // true
isURL('https://vue.org') // true

isEmpty(null)       // true
isEmpty('')         // true
isEmpty([])         // true
isEmpty({})         // true
isEmpty('hello')    // false
```

## 数组工具（array.ts）

```ts
import { unique, groupBy, shuffle } from '@utils'

// 数组去重
unique([1, 2, 2, 3])  // [1, 2, 3]

// 对象数组按 key 去重
unique([{ id: 1 }, { id: 1 }, { id: 2 }], 'id')
// [{ id: 1 }, { id: 2 }]

// 数组分组
groupBy(
  [{ type: 'A', name: '1' }, { type: 'B', name: '2' }, { type: 'A', name: '3' }],
  'type'
)
// { A: [{...}, {...}], B: [{...}] }

// 数组随机打乱
shuffle([1, 2, 3, 4, 5])  // [3, 1, 5, 2, 4]（随机）
```

## 字符串工具（string.ts）

```ts
import { kebabCase, camelCase, capitalize, truncate, randomString } from '@utils'

kebabCase('MyButton')      // 'my-button'
camelCase('my-button')     // 'myButton'
capitalize('hello')        // 'Hello'
truncate('Hello World!', 8) // 'Hello...'
randomString(12)           // 'aB3xKp9mLq2w'（随机）
```

## 源码位置

所有工具函数的源码位于 `packages/utils/` 目录下，每个文件对应一个分类，通过 `index.ts` 统一导出。
