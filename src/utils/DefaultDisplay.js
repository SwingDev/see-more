import Spaceship from 'components/Spaceship'

class DefaultDisplay {
  constructor () {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
  }

  init (renderer, scene) {
    this.renderer = renderer
    this.scene = scene

    this.handleResize()
    this.addModel()
    this.setSceneBackground()

    window.addEventListener('resize', this.handleResize)
  }

  setSceneBackground () {
    this.renderer.domElement.classList.add('has-background')
  }

  addModel () {
    const spaceship = new Spaceship(this.renderer)

    spaceship.load()
      .then(this.handleModelLoad)
  }

  handleModelLoad = (model) => {
    model.position.set(0, 0, -5)
    model.rotation.set(THREE.Math.degToRad(45), THREE.Math.degToRad(0), 0)

    this.scene.add(model)
  };

  handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  };
}

export default DefaultDisplay
