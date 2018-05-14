import { html } from 'lit-html'
import classNames from 'classnames'

import { BREAKPOINTS } from 'root/config'
import { pageVisibility } from 'utils/prefixed'

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

    this.render({ isActive: isOverlayActive })
  }

  render (props) {
    const classes = classNames('orientation-overlay', {
      'is-active': props.isActive
    })

    const template = html`
      <div class="${classes}">
        Please rotate your device to landscape mode
      </div>
    `

    if (this.onUpdate) {
      this.onUpdate(template)
    }
  }
}

export default OrientationOverlay
