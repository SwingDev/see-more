import { html } from 'lit-html'
import classNames from 'classnames'

import store from 'store'
import { transitionEndEvent } from 'utils/prefixed'

import './styles.scss'

class Toast {
  prevText = ''
  prevLight = false

  constructor (container) {
    this.container = container
  }

  init () {
    this.handleStoreUpdate()
    store.subscribe(this.handleStoreUpdate)

    if (!this.onUpdate) {
      throw new Error('Toast has no "onUpdate" method!')
    }
  }

  handleStoreUpdate = () => {
    const { message } = store.getState()
    const { show, text, light } = message

    if (show && text !== this.prevText) {
      this.render({
        show: false,
        text: this.prevText,
        light: this.prevLight
      })

      this.container.addEventListener(
        transitionEndEvent,
        this.handleTransitionEnd
      )
    } else {
      this.render({ show, text, light })
    }

    this.prevText = text
    this.prevLight = light
  };

  handleTransitionEnd = (event) => {
    const { target } = event

    if (
      target.classList.contains('toast') &&
      !target.classList.contains('show')
    ) {
      this.render({
        show: true,
        text: this.prevText,
        light: this.prevLight
      })

      this.container.removeEventListener(
        transitionEndEvent,
        this.handleTransitionEnd
      )
    }
  }

  render (props = {}) {
    const classes = classNames('toast', {
      'show': props.show && props.text,
      'light': props.light
    })

    const template = html`
      <p class="${classes}">${props.text}</p>
    `

    if (this.onUpdate) {
      this.onUpdate(template)
    }
  }
}

export default Toast
