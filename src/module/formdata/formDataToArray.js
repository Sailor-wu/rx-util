import { asIterator } from './../array/asIterator'

/**
 * FormData 转换为包含所有键值数组的二维数组函数
 *
 * @param {FormData} fd 需要转换的 FormData 对象
 * @returns {Array} 转换后的数组
 * @deprecated 已被原生函数 Array.from 取代
 */
export function formDataToArray (fd) {
  // @ts-ignore
  return asIterator(fd.entries())
}
