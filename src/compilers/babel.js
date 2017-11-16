import { transform } from 'babel-core'
import trim from 'trim'

export default code =>
  transform(trim(code), {
    babelrc: false,
    presets: ['env']
  }).code
