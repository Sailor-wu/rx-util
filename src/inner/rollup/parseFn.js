export function parseFn (str) {
  // eslint-disable-next-line no-eval
  eval(str)
  // eslint-disable-next-line no-eval
  const temp = eval('GLOBAL_VARIAINT')
  const arr = Object.values(temp)
  if (temp instanceof Object && arr.length === 1) {
    return arr[0]
  }
  return temp
}
