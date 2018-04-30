import anime from 'animejs'

import loadModel from '../utils/model-loader'

class Spaceship {
  fileName = 'spaceship_complete'

  constructor (renderer) {
    this.renderer = renderer
  }

  load () {
    return loadModel(`/${this.fileName}/${this.fileName}.gltf`, this.renderer)
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
    this.object.position.set(0, 0, -5)
    this.object.rotation.set(THREE.Math.degToRad(45), THREE.Math.degToRad(0), 0)
    console.log(this.object)

    this.animateThruster()
    this.animateGlow()

    return this.object
  };
}

export default Spaceship
