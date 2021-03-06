import { groupBy } from './groupBy'
import { returnItself } from '../function/returnItself'

/**
 * 快速根据指定函数对数组进行排序
 * 注: 使用递归实现，对于超大数组（其实前端的数组不可能特别大吧？#笑）可能造成堆栈溢出
 * @param {Array} arr 需要排序的数组
 * @param {Function} [kFn=returnItself] 对数组中每个元素都产生可比较的值的函数，默认返回自身进行比较
 * @returns {Array} 排序后的新数组
 */
export function sortBy (arr, kFn = returnItself) {
  // 边界条件，如果传入数组的值
  if (arr.length <= 1) {
    return arr
  }
  // 根据中间值对数组分治为两个数组
  const medianIndex = Math.floor(arr.length / 2)
  const newArr = arr.slice()
  const median = newArr.splice(medianIndex, 1)[0]
  const medianValue = kFn(median)
  const map = groupBy(newArr, item => kFn(item) < medianValue)
  // 对两个数组分别进行排序
  return [
    ...sortBy(map.get(true) || [], kFn),
    median,
    ...sortBy(map.get(false) || [], kFn),
  ]
}
