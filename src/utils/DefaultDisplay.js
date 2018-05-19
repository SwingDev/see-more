import store from 'store'
import Spaceship from 'components/Spaceship'
import parallax from 'components/ui/Parallax'

import { getQuaternion } from 'utils/math'

const INITIAL_ROTATION = {
  x: 45,
  y: 30,
  z: 0
}

const quaternion = new THREE.Quaternion()

class DefaultDisplay {
  constructor () {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )

    this.deviceOrientation = null
    this.screenOrientation = 0
    this.shouldUpdate = true
  }

  init (renderer, scene) {
    this.renderer = renderer
    this.scene = scene

    this.handleResize()
    this.addModel()
    this.setSceneBackground()

    this.handleScreenOrientationChange()

    this.handleStoreUpdate()
    store.subscribe(this.handleStoreUpdate)

    window.addEventListener('resize', this.handleResize)

    window.addEventListener(
      'deviceorientation',
      this.handleDeviceOrientationChange
    )

    window.addEventListener(
      'orientationchange',
      this.handleScreenOrientationChange
    )
  }

  setSceneBackground () {
    parallax.show(true)
  }

  addModel () {
    const spaceship = new Spaceship(this.renderer)

    spaceship.load()
      .then(this.handleModelLoad)
  }

  rotateModel () {
    if (!this.deviceOrientation) return

    const { alpha, beta, gamma } = this.deviceOrientation

    if (this.model) {
      const [w, x, y, z] = getQuaternion(alpha, beta, gamma + 90)
      quaternion.set(-y, -z, -x, -w)

      this.model.quaternion.copy(quaternion)
    }
  }

  handleModelLoad = (model) => {
    this.model = model
    this.model.position.set(0, 0, -4)
    this.model.rotation.set(
      THREE.Math.degToRad(INITIAL_ROTATION.x),
      THREE.Math.degToRad(INITIAL_ROTATION.y),
      0
    )

    this.scene.add(this.model)
  };

  handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  };

  handleDeviceOrientationChange = (event) => {
    this.deviceOrientation = {
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma
    }
  };

  handleScreenOrientationChange = () => {
    this.screenOrientation = ('orientation' in window.screen)
      ? window.screen.orientation.angle
      : window.orientation
  };

  handleStoreUpdate = () => {
    const { lockScreen } = store.getState()

    this.shouldUpdate = !lockScreen
  };

  update () {
    if (!this.shouldUpdate) return

    this.rotateModel()
    parallax.update(this.deviceOrientation)
  }
}

export default DefaultDisplay
