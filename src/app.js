import 'normalize.css'
import 'styles/main.scss'

import { enableDevTools } from 'utils/dev-tools'
import ARDisplay from 'utils/ARDisplay'
import DefaultDisplay from 'utils/DefaultDisplay'

import makeLights from 'components/Lights'

class App {
  constructor () {
    this.disabled = false
    this.display = new ARDisplay()
    this.stats = enableDevTools().stats

    this.setRenderer()
    this.setScene()
    this.setLights()
    this.setDisplay()

    this.animate()
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

  handleARDisplayError = () => {
    this.display.disable()

    this.disabled = true
    cancelAnimationFrame(this.rafId)
    this.display = new DefaultDisplay()

    this.setScene()
    this.setLights()
    this.display.init(this.renderer, this.scene)

    this.disabled = false

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

    this.stats.update()
  }
}

// eslint-disable-next-line
new App()
