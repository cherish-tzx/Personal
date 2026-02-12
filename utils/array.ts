/**
 * 数组工具函数
 */

/** 数组去重 — 支持对象数组按指定 key 去重 */
export function unique<T>(arr: T[], key?: keyof T): T[] {
    if (!key) return [...new Set(arr)]
    const map = new Map<unknown, T>()
    arr.forEach(item => {
      const k = item[key]
      if (!map.has(k)) map.set(k, item)
    })
    return [...map.values()]
  }
  
  /** 数组分组 — 按指定 key 分组 */
  export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
    return arr.reduce((acc, item) => {
      const group = String(item[key])
      ;(acc[group] ??= []).push(item)
      return acc
    }, {} as Record<string, T[]>)
  }
  
  /** 数组扁平化（递归展开嵌套数组） */
  export function flatten<T>(arr: (T | T[])[]): T[] {
    return arr.reduce<T[]>(
      (acc, item) => acc.concat(Array.isArray(item) ? flatten(item) : item),
      []
    )
  }
  
  /** 数组随机打乱（Fisher-Yates 洗牌算法） */
  export function shuffle<T>(arr: T[]): T[] {
    const result = [...arr]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }
  