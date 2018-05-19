import { html } from 'lit-html'

import store from 'store'

import IconAlert from 'images/icon-alert.svg'

import './styles.scss'

class ErrorOverlay {
  init () {
    this.handleStoreUpdate()
    store.subscribe(this.handleStoreUpdate)

    if (!this.onUpdate) {
      throw new Error('ErrorOverlay has no "onUpdate" method!')
    }
  }

  handleStoreUpdate = () => {
    const { error } = store.getState()

    if (error) {
      this.render({ message: error.message })
    }
  };

  render ({ message }) {
    const template = html`
      <section class="error-overlay">
        <img class="error-overlay__img" src="${IconAlert}" alt="" />
        <p class="error-overlay__message">
          ${message}
        </p>
      </section>
    `

    if (this.onUpdate) {
      this.onUpdate(template)
    }
  }
}

export default ErrorOverlay
