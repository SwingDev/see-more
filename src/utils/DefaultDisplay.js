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

    this.addModel()

    window.addEventListener('resize', this.handleResize)
  }

  addModel () {
    const spaceship = new Spaceship(this.renderer)

    spaceship.load()
      .then((model) => this.scene.add(model))
  }

  handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  };
}

export default DefaultDisplay
