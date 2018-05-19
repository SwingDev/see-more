import { html } from 'lit-html'

import IconAlert from 'images/icon-alert.svg'

import './styles.scss'

class ErrorOverlay {
  init () {
    this.render()

    if (!this.onUpdate) {
      throw new Error('ErrorOverlay has no "onUpdate" method!')
    }
  }

  render () {
    const template = html`
      <section class="error-overlay">
        <img class="error-overlay__img" src="${IconAlert}" alt="" />
        <p class="error-overlay__message">
          Sorry, but your device doesn't support WebGL
          and Augmented Reality
        </p>
      </section>
    `

    if (this.onUpdate) {
      this.onUpdate(template)
    }
  }
}

export default ErrorOverlay
