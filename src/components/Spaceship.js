import anime from 'animejs'

import store from 'store'
import { SPACESHIP_FILE_NAME } from 'root/config'
import { setLoaded } from 'store/actions'
import loadModel from 'utils/model-loader'

import shadowImage from 'images/ship-shadow.png'

const HOVER_RATE = 0.3

const defaults = {
  shadow: false,
  hovering: false
}

const textureLoader = new THREE.TextureLoader()

const getShadowMesh = () => {
  const texture = textureLoader.load(shadowImage)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  })

  const geometry = new THREE.PlaneGeometry(500, 500)
  const mesh = new THREE.Mesh(geometry, material)

  mesh.rotation.x = THREE.Math.degToRad(-90)

  return mesh
}

class Spaceship {
  constructor (renderer, options) {
    this.renderer = renderer

    this.settings = {
      ...defaults,
      ...options
    }

    this.animations = []
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

        this.animations.push(
          anime({
            targets: texture.offset,
            x: -1,
            loop: true,
            easing: 'linear',
            duration: 3000
          })
        )
      }
    })
  }

  animateGlow () {
    this.object.traverse((child) => {
      if (child.isMesh && child.name === 'spaceship_body_low_0') {
        const { material } = child

        material.emissiveIntensity = 0

        this.animations.push(
          anime({
            targets: material,
            emissiveIntensity: 1,
            loop: true,
            easing: 'linear',
            direction: 'alternate',
            duration: 3000
          })
        )
      }
    })
  }

  animateHover () {
    this.object.traverse((child) => {
      if (child.name === 'root') {
        const posY = child.position.y

        this.animations.push(
          anime({
            targets: child.position,
            y: posY + (posY * HOVER_RATE),
            loop: true,
            easing: 'easeInOutQuad',
            direction: 'alternate',
            duration: 2500
          })
        )
      }
    })

    if (this.settings.shadow && this.shadowMesh) {
      const { x, y, z } = this.shadowMesh.scale

      this.animations.push(
        anime({
          targets: this.shadowMesh.scale,
          x: x - (x * HOVER_RATE),
          y: y - (y * HOVER_RATE),
          z: z - (z * HOVER_RATE),
          loop: true,
          easing: 'easeInOutQuad',
          direction: 'alternate',
          duration: 2500
        })
      )
    }
  }

  addShadow () {
    this.shadowMesh = getShadowMesh()
    this.shadowMesh.position.y = -10

    this.object.add(this.shadowMesh)
  }

  dispose () {
    this.animations.forEach((animation) => {
      animation.pause()
    })
  }

  handleLoad = (object) => {
    this.object = object
    this.object.scale.set(0.007, 0.007, 0.007)

    this.animateThruster()
    this.animateGlow()

    if (this.settings.shadow) {
      this.addShadow()
    }

    if (this.settings.hovering) {
      this.animateHover()
    }

    store.dispatch(setLoaded())

    return this.object
  };
}

export default Spaceship
