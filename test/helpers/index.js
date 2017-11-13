import { VM } from 'vm2'
import _ from 'lodash'
import { compiler } from '../../src'

export function beforeEach(t) {
  t.context.vm = new VM({
    sandbox: { _ },
    compiler
  })
}

export default { beforeEach }
