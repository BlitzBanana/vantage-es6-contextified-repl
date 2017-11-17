import { highlightAuto } from 'emphasize'
import stringify from 'json-stringify-safe'

export default input => {
  switch (typeof input) {
    case 'function':
      return highlightAuto(input.toString()).value
    case 'object':
      return highlightAuto(stringify(input, null, 2)).value
    default:
      return highlightAuto(String(input)).value
  }
}
