import { html } from 'lit-html'
import screenfull from 'screenfull'

import IconExpand from 'images/icon-expand.svg'
import IconShrink from 'images/icon-shrink.svg'
import './styles.scss'

class FullscreenButton {
  constructor (container) {
    this.container = container
    this.icon = IconExpand
  }

  init () {
    if (screenfull.enabled) {
      this.render()
      this.container.addEventListener('click', this.handleClick)
      screenfull.on('change', this.handleFullscreenChange)
    }

    if (!this.onUpdate) {
      throw new Error('FullscreenButton has no "onUpdate" method!')
    }
  }

  handleClick = (event) => {
    if (event.target.classList.contains('fullscreen-button')) {
      if (screenfull.enabled) {
        screenfull.toggle()
      }
    }
  };

  handleFullscreenChange = () => {
    const { isFullscreen } = screenfull

    this.icon = (isFullscreen) ? IconShrink : IconExpand
    this.render()
  };

  render () {
    const template = html`
      <button class="fullscreen-button">
        <img src="${this.icon}" class="fullscreen-button__icon" alt="" />
      </button>
    `

    if (this.onUpdate) {
      this.onUpdate(template)
    }
  }
}

export default FullscreenButton
