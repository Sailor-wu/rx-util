// @ts-check
import puppeteer from 'puppeteer'
import { rollup } from 'rollup'

async function stringfyFn (path) {
  const bundle = await rollup({
    input: path
  })
  const result = await bundle.generate({
    file: './bundle.js',
    format: 'iife',
    name: 'global'
  })
  return result.output[0].code
}

// function parseFn (str, name) {
//   // eslint-disable-next-line no-eval
//   eval(str)
//   // eslint-disable-next-line no-eval
//   this['global'] = eval('global')
//   const arr = Object.values(global)
//   if (global instanceof Object && arr.length === 1) {
//     return arr[0]
//   }
//   return global
// }

/**
 * 参数封装类
 * @property {String} type 参数的类型名
 * @property {any} value 参数的值
 */
export class Arg {
  /**
   * 构造函数
   * @param {Object} option 可选参数
   * @param {Object} option.value 参数值
   * @param {String} [option.type] 参数类型
   */
  constructor ({ value, type = getType(value) }) {
    this.value = value
    this.type = type
  }
}
/**
 * 参数类型封装类
 * @property {String} name 参数类型名称，例如 Function 的即为 {@code Function.name}
 * @property {Function} fn 判断是否为当前类型的函数
 */
class ArgType {
  /**
   * 参数类型
   * @param {String} name 参数的类型名
   * @param {Function} fn 判断的表达式
   */
  constructor (name, fn) {
    this.name = name
    this.fn = fn
  }
}

/**
 * 获取参数类型
 * @param {any} arg 参数值
 * @returns {String} 参数类型名称
 */
function getType (arg) {
  const types = [
    new ArgType(
      Function.name,
      arg => arg instanceof Function && typeof arg === 'function'
    ),
    new ArgType(String.name, arg => typeof arg === 'string'),
    new ArgType(Date.name, arg => arg instanceof Date),
    new ArgType(Array.name, arg => arg instanceof Array),
    new ArgType(Object.name, arg => arg instanceof Object)
  ]
  return (types.find(({ fn }) => fn(arg)) || Object).name
}
/**
 * 序列化
 * @param {Arg} arg 要进行序列化的对象，包含参数值和参数类型名称
 * @returns {Arg} 参数值序列化后的对象
 */
function serializeArg ({ value, type }) {
  let v
  if (type === String.name) {
    v = value.toString()
  } else if (type === Function.name) {
    if (value instanceof Function) {
      v = value.toString()
    } else {
      v = stringfyFn(value)
    }
  } else if (type === Date.name) {
    v = value.toISOString()
  } else if (type === Array.name) {
    v = JSON.stringify(value)
  } else if (type === Object.name) {
    v = JSON.stringify(value)
  }
  return {
    value: v,
    type
  }
}
/**
 * 反序列化
 * @param {Arg} arg 要进行反序列化的对象，包含参数序列化后的值和参数类型名称
 * @returns {Arg} 参数值反序列化后的对象
 */
function deserializeArg ({ value, type }) {
  let v
  if (type === String.name) {
    v = value
  } else if (type === Function.name) {
    // eslint-disable-next-line no-eval
    v = eval(value)
    if (!v) {
      const parseFn = str => {
        // eslint-disable-next-line no-eval
        eval(value)
        // eslint-disable-next-line no-eval
        this['global'] = eval('global')
        if (this['global'] === undefined) {
          return null
        }
        // @ts-ignore
        const arr = Object.values(global)
        if (global instanceof Object && arr.length === 1) {
          return arr[0]
        }
        return global
      }
      v = parseFn(value)
    }
  } else if (type === Date.name) {
    v = new Date(value)
  } else if (type === Array.name) {
    v = JSON.parse(value)
  } else if (type === Object.name) {
    v = JSON.parse(value)
  }
  return {
    value: v,
    type
  }
}

/**
 * 模拟在浏览器中执行函数
 * @param {Function} fn 执行的函数
 * @param  {...any} [args] 参数列表
 * @returns {Promise} 异步返回结果
 */
export async function evalBrowser (fn, ...args) {
  const argArray = args.map(arg =>
    JSON.stringify(serializeArg(new Arg({ value: arg })))
  )
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  // 监听 chromium 的控制台输出并打印到本机命令行
  page.on('console', msg => console.log('PAGE LOG:', msg.text()))
  const result = await page.evaluate(
    (fnStr, deserializeArgStr, ...argArray) => {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`return ${fnStr.trim()}`)()
      // eslint-disable-next-line no-new-func
      const deserializeArg = new Function(
        `return ${deserializeArgStr.trim()}`
      )()
      const args = argArray.map(
        argStr => deserializeArg(JSON.parse(argStr)).value
      )
      return fn(...args)
    },
    fn.toString(),
    deserializeArg.toString(),
    ...argArray
  )
  await browser.close()
  return result
}
