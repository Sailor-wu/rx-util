import { evalBrowser, Arg } from './evalBrowser'

/**
 * @test {evalBrowser}
 */
describe('test evalBrowser', () => {
  // it('test an simple string', async () => {
  //   const str = 'str'
  //   const result = await evalBrowser(function fn (str) {
  //     return str
  //   }, str)
  //   expect(result).toEqual(str)
  // })
  // it('test multiple simple number', async () => {
  //   const i = 1
  //   const k = 2
  //   const result = await evalBrowser((i, k) => i + k, i, k)
  //   expect(result).toBe(i + k)
  // })
  // it('test date type', async () => {
  //   const now = new Date()
  //   const result = await evalBrowser(date => date.toISOString(), now)
  //   expect(result).toEqual(now.toISOString())
  // })
  // it('test Object type', async () => {
  //   const user = {
  //     name: 'rx',
  //     age: 17
  //   }
  //   const result = await evalBrowser(user => user, user)
  //   expect(result).toEqual(user)
  // })
  // it('test function type', async () => {
  //   const i = 1
  //   const k = 2
  //   const add = (i, k) => i + k
  //   const result = await evalBrowser((i, k, add) => add(i, k), i, k, add)
  //   expect(result).toBe(add(i, k))
  // })
  // it('test dom api', async () => {
  //   const result = await evalBrowser(() => window.innerHeight)
  //   expect(result).toBeGreaterThan(0)
  // })
  it('test complex function type', async () => {
    const result = await evalBrowser(
      (i, k, add) => add(i, k),
      1,
      2,
      new Arg({
        value: './../rollup/index',
        type: Function.name
      })
    )
    console.log(result)
  })
})
