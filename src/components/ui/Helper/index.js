import { html } from 'lit-html'
import classNames from 'classnames'

import store from 'store'

import CrosshairImg from 'images/crosshair.svg'
import './styles.scss'

class Helper {
  init () {
    this.handleStoreUpdate()
    store.subscribe(this.handleStoreUpdate)

    if (!this.onUpdate) {
      throw new Error('Helper has no "onUpdate" method!')
    }
  }

  handleStoreUpdate = () => {
    const { showHelper } = store.getState()

    this.render({ show: showHelper })
  };

  render (props = {}) {
    const classes = classNames('helper', {
      'show': props.show
    })

    const template = html`
      <div class="${classes}">
        <img class="helper__img" src="${CrosshairImg}" alt="" />
      </div>
    `

    if (this.onUpdate) {
      this.onUpdate(template)
    }
  }
}

export default Helper
