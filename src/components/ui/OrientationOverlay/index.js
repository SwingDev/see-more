import { html } from 'lit-html'
import classNames from 'classnames'

import store from 'store'
import { setScreenLock } from 'store/actions'
import { BREAKPOINTS } from 'root/config'
import { pageVisibility } from 'utils/prefixed'

import Logo from 'images/logo.svg'
import Banner from 'images/banner.svg'
import RotateIllustration from 'images/rotate.svg'

import './styles.scss'

class OrientationOverlay {
  init () {
    this.handleOrientationChange()
    window.addEventListener(
      'orientationchange',
      this.handleOrientationChange
    )

    document.addEventListener(
      pageVisibility.visibilityChange,
      this.handleOrientationChange
    )

    if (!this.onUpdate) {
      throw new Error('OrientationOverlay has no "onUpdate" method!')
    }
  }

  handleOrientationChange = () => {
    const screenSize = Math.max(window.screen.width, window.screen.height)
    const screenOrientation = ('orientation' in window.screen)
      ? window.screen.orientation.angle
      : window.orientation

    const isLandscape = Math.abs(screenOrientation) !== 90

    const isSmallDevice = (screenSize <= BREAKPOINTS.large)
    const isOverlayActive = isLandscape && isSmallDevice

    store.dispatch(setScreenLock(isOverlayActive))

    this.render({ isActive: isOverlayActive })
  }

  render (props) {
    const classes = classNames('orientation-overlay', {
      'is-active': props.isActive
    })

    const template = html`
      <section class="${classes}">
        <div class="orientation-overlay__content">
          <img
            class="orientation-overlay__logo"
            src="${Logo}"
            alt="SwingDev"
          />

          <img
            class="orientation-overlay__banner"
            src="${Banner}"
            alt="See more"
          />

          <p class="orientation-overlay__message">
            Rotate your device to horizontal position
          </p>

          <img
            class="orientation-overlay__img"
            src="${RotateIllustration}"
            alt=""
          />
        </div>
      </section>
    `

    if (this.onUpdate) {
      this.onUpdate(template)
    }
  }
}

export default OrientationOverlay
