import { rollup } from 'rollup'

export async function stringfyFn (path) {
  const bundle = await rollup({
    input: path
  })
  const result = await bundle.generate({
    file: './bundle.js',
    format: 'iife',
    name: 'GLOBAL_VARIAINT'
  })
  return result.output[0].code
}
