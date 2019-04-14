// // import { rollup } from 'rollup'
// const path = require('path')
// const rollup = require('rollup').rollup

// // import puppeteer from 'puppeteer'

// // const fn = () => {
// //   console.log('hello')
// // }

// // const str = fn.toString()

// // ;(function () {
// //   // eslint-disable-next-line no-new-func
// //   const fn = new Function(`return ${str.trim()}`)

// //   // eval(str)

// //   // console.log(fn)
// //   // console.log(fn.toString())
// //   // console.log(typeof fn)
// //   console.log(fn()())
// // })()

// // console.log(
// //   `

// // `.trim()
// // )
// // ;(async () => {
// //   const browser = await puppeteer.launch()
// //   const page = await browser.newPage()
// //   page.on('console', msg => console.log('PAGE LOG:', msg.text()))

// //   await page.evaluate(function (user) {
// //     console.log(user)
// //   })
// // })()

// // const user = {
// //   name: 'rx',
// //   age: 17,
// //   toJSON () {
// //     return this
// //   }
// // }
// // console.log(JSON.stringify(user))
// // console.log(typeof JSON.stringify(user))
// // describe('test rollup.js api', () => {
// //   it('test rollup', async () => {
// //     const bundle = await rollup({
// //       input: path.resolve(__dirname, './index.js')
// //     })

// //     const { code } = await bundle.generate({
// //       file: path.resolve(__dirname, './bundle.js'),
// //       name: 'add',
// //       globals: 'add',
// //       format: 'umd'
// //     })
// //     console.log(code)
// //   })
// // })

// async function stringfyFn (path) {
//   const bundle = await rollup({
//     input: path.resolve(path)
//   })
//   const result = await bundle.generate({
//     file: './bundle.js',
//     format: 'iife',
//     name: 'global'
//   })
//   return result.output[0].code
// }

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

// ;(async () => {
//   const file = path.resolve(__dirname, './stringfy.js')
//   const str = await stringfyFn(file)
//   ;(function (global) {
//     const add = parseFn(str)
//     console.log(add(1, 2))
//   })()
// })()
const rollup = require('rollup').rollup
const resolve = require('path').resolve

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

function parseFn (str, name) {
  // eslint-disable-next-line no-eval
  eval(str)
  // eslint-disable-next-line no-eval
  const globalTemp = eval('global')
  const arr = Object.values(globalTemp)
  if (globalTemp instanceof Object && arr.length === 1) {
    return arr[0]
  }
  return globalTemp
}

(async () => {
  const code = await stringfyFn(resolve(__dirname, './add.js'))
  const add = parseFn(code)
  console.log(add)
  console.log(add(1, 2))
})()
