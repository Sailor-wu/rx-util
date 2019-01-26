/**
 * 自行实现 flatMap，将数组压平一层
 * @param {Array} arr 数组
 * @param {Function} fn 映射方法，将一个元素映射为一个数组
 * @returns {Array} 压平一层的数组
 */
function flatMap (arr, fn) {
  return arr.reduce((res, item) => res.concat(fn(item)), [])
}

export default flatMap