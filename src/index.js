import autoBind from 'auto-bind'

export default class Script {
  constructor(config) {
    config = Object.assign({}, config)
    this._name = config.name || 'script'

    autoBind(this)
  }
  renderName() {
    return this._name
  }
}
