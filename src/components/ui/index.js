import { html, render } from 'lit-html'

import store from 'store'

import './NoScriptMessage/styles.scss'
import updateSplashScreen from './SplashScreen'
import OrientationOverlay from './OrientationOverlay'
import FullscreenButton from './FullscreenButton'

class Root {
  constructor () {
    this.container = document.getElementById('ui')

    this.components = [
      new FullscreenButton(this.container),
      new OrientationOverlay()
    ]

    this.templates = []

    this.subscribeStore()
    this.setComponents()
  }

  setComponents () {
    this.components.forEach((component, index) => {
      component.onUpdate = (template) => {
        this.templates[index] = template
        this.render()
      }

      component.init()
    })
  }

  subscribeStore () {
    store.subscribe(() => {
      const { loaded } = store.getState()

      updateSplashScreen(loaded)
    })
  }

  render () {
    const template = html`
      ${this.templates}
    `
    console.log('render', this.templates)

    render(template, this.container)
  }
}

export default () => new Root()
