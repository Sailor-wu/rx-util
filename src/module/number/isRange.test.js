import { isRange } from './isRange'
/**
 * @test {isRange}
 */
describe('test isRange', () => {
  it('test normal situation', () => {
    expect(isRange(1, 0, 2)).toBeTrue()
    expect(isRange(3, 0, 2)).toBeFalse()
    expect(isRange(0, 1, -1)).toBeTrue()
  })
})
