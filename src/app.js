import 'normalize.css'
import 'styles/main.scss'

import store from 'store'
import {
  setLoaded,
  setMessage,
  setError
} from 'store/actions'

import { message } from 'root/config'

import { enableDevTools } from 'utils/dev-tools'
import ARDisplay from 'utils/ARDisplay'
import DefaultDisplay from 'utils/DefaultDisplay'
import { register } from 'utils/sw'

import makeLights from 'components/Lights'
import renderComponents from 'components/ui'

class App {
  constructor () {
    this.disabled = false

    this.checkWebGLSupport()
    renderComponents()

    window.addEventListener('error', this.handleLoadError)

    if (this.disabled) return

    this.display = new ARDisplay()

    if (process.env.NODE_ENV === 'development') {
      this.stats = enableDevTools().stats
    }

    this.setRenderer()
    this.setScene()
    this.setLights()
    this.setDisplay()

    this.animate()
  }

  checkWebGLSupport () {
    if (!Modernizr.webgl) {
      this.disabled = true

      store.dispatch(setLoaded())
      store.dispatch(setError({
        message: message.NO_WEBGL_SUPPORT
      }))
    }
  }

  setDisplay () {
    this.display.onError = this.handleARDisplayError
    this.display.init(this.renderer, this.scene)
  }

  setScene () {
    this.camera = this.display.camera
    this.scene = new THREE.Scene()
    this.scene.add(this.camera)
  }

  setRenderer () {
    const canvasEl = document.getElementById('scene')

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      alpha: true,
      antialias: true
    })

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.gammaInput = true
    this.renderer.gammaOutput = true
    this.renderer.setClearColor(new THREE.Color('lightgrey'), 0)
  }

  setLights () {
    const { hemiLight } = makeLights()
    this.scene.add(hemiLight)
  }

  handleLoadError = (e) => {
    store.dispatch(setLoaded())
    store.dispatch(setError({
      message: message.ERROR
    }))

    /* eslint-disable no-console */
    console.error(e)
    /* eslint-enable no-console */
  };

  handleARDisplayError = () => {
    this.display.disable()

    this.disabled = true
    cancelAnimationFrame(this.rafId)
    this.display = new DefaultDisplay()

    this.setScene()
    this.setLights()
    this.display.init(this.renderer, this.scene)

    this.disabled = false

    store.dispatch(setMessage({
      show: true,
      text: message.NO_CAMERA,
      light: true
    }))

    this.animate()
  }

  animate = () => {
    if (this.disabled) return

    this.render()
    this.rafId = requestAnimationFrame(this.animate)
  };

  render () {
    this.renderer.render(this.scene, this.camera)

    if (this.display && this.display.update) {
      this.display.update()
    }

    if (process.env.NODE_ENV === 'development') {
      this.stats.update()
    }
  }
}

// eslint-disable-next-line
new App()

if (process.env.NODE_ENV === 'production') {
  register()
}
