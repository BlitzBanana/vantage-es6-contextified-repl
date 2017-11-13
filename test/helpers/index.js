import Script from '../../src'

export function beforeEach(t) {
  const script = new Script({})
  Object.assign(t.context, { script })
}

export function afterEach() {}

export default { beforeEach, afterEach }
