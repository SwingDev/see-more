import anime from 'animejs'

import store from 'store'
import { SPACESHIP_FILE_NAME } from 'root/config'
import { setLoaded } from 'store/actions'
import loadModel from 'utils/model-loader'

class Spaceship {
  constructor (renderer) {
    this.renderer = renderer
  }

  load () {
    return loadModel(
      `/${SPACESHIP_FILE_NAME}/${SPACESHIP_FILE_NAME}.gltf`,
      this.renderer
    )
      .then(this.handleLoad)
  }

  animateThruster () {
    this.object.traverse((child) => {
      if (child.isMesh && child.name === 'spaceship_exhaust_glow_0') {
        const texture = child.material.map

        this.thrusterAnimation = anime({
          targets: texture.offset,
          x: -1,
          loop: true,
          easing: 'linear',
          duration: 3000
        })
      }
    })
  }

  animateGlow () {
    this.object.traverse((child) => {
      if (child.isMesh && child.name === 'spaceship_body_low_0') {
        const { material } = child

        material.emissiveIntensity = 0

        this.glowAnimation = anime({
          targets: material,
          emissiveIntensity: 1,
          loop: true,
          easing: 'linear',
          direction: 'alternate',
          duration: 3000
        })
      }
    })
  }

  dispose () {
    if (this.glowAnimation) {
      this.glowAnimation.pause()
    }

    if (this.thrusterAnimation) {
      this.thrusterAnimation.pause()
    }
  }

  handleLoad = (object) => {
    this.object = object
    this.object.scale.set(0.007, 0.007, 0.007)

    this.animateThruster()
    this.animateGlow()

    store.dispatch(setLoaded())

    return this.object
  };
}

export default Spaceship
