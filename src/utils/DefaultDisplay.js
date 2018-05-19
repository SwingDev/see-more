import store from 'store'
import Spaceship from 'components/Spaceship'

const INITIAL_ROTATION = {
  x: 45,
  y: 0,
  z: 0
}

const MAX_ROTATION_X = 15
const MAX_ROTATION_Y = 15
const MAX_ROTATION_Z = 15

const getDumped = (value, min, max) => (
  (value > max)
    ? max
    : (value < min)
      ? min
      : value
)

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
    this.renderer.domElement.classList.add('has-background')
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
      const rotationX = INITIAL_ROTATION.x + (
        ((this.screenOrientation) ? gamma / this.screenOrientation : 0)
      ) * MAX_ROTATION_X

      const rotationY = getDumped(
        alpha - this.screenOrientation,
        -MAX_ROTATION_Y,
        MAX_ROTATION_Y
      )

      const rotationZ = getDumped(beta, -MAX_ROTATION_Z, MAX_ROTATION_Z)

      this.model.rotation.x = THREE.Math.degToRad(rotationX)
      this.model.rotation.y = THREE.Math.degToRad(rotationY)
      this.model.rotation.z = THREE.Math.degToRad(rotationZ)
    }
  }

  handleModelLoad = (model) => {
    this.model = model
    this.model.position.set(0, 0, -5)
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
  }
}

export default DefaultDisplay
