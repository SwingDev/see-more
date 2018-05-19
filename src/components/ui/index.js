import { html, render } from 'lit-html'

import store from 'store'

import './NoScriptMessage/styles.scss'
import updateSplashScreen from './SplashScreen'
import OrientationOverlay from './OrientationOverlay'
import FullscreenButton from './FullscreenButton'
import ErrorOverlay from './ErrorOverlay'
import Toast from './Toast'
import Helper from './Helper'

class Root {
  constructor () {
    this.container = document.getElementById('ui')

    this.templates = []

    this.components = [
      new FullscreenButton(this.container),
      new OrientationOverlay(),
      new Toast(this.container),
      new Helper(),
      new ErrorOverlay()
    ]

    this.handleStoreUpdate()
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
    store.subscribe(this.handleStoreUpdate)
  }

  handleStoreUpdate = () => {
    const { loaded } = store.getState()

    updateSplashScreen(loaded)
  };

  render () {
    const template = html`
      ${this.templates}
    `

    render(template, this.container)
  }
}

export default () => new Root()
