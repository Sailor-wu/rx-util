import { resolve } from 'path'
import { stringfyFn } from './stringfyFn'
import { parseFn } from './parseFn'

describe('test parseFn', () => {
  it('test normal function', async () => {
    const code = await stringfyFn(resolve(__dirname, './add.js'))
    console.log(code)
    const add = parseFn(code)
    console.log(Object.keys(add).length)
  })
})
