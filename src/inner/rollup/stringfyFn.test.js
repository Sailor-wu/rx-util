import { stringfyFn } from './stringfyFn'
import { resolve } from 'path'

describe('test stringfyFn', () => {
  it('test function', async () => {
    const code = await stringfyFn(resolve(__dirname, './add.js'))
    expect(code.length).toBeGreaterThan(0)
  })
})
