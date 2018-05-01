import Spaceship from 'components/Spaceship'

import { MARKER_MODELS } from 'config'

class ARDisplay {
  constructor (renderer) {
    this.controls = []
    this.camera = new THREE.Camera()
  }

  init (renderer, scene) {
    this.renderer = renderer
    this.scene = scene

    this.setARToolkit()
    this.addMarkers()

    window.addEventListener('resize', this.handleResize)
  }

  setARToolkit () {
    const artoolkitProfile = new THREEx.ArToolkitProfile()
    artoolkitProfile.sourceWebcam()

    this.artoolkitSource = new THREEx.ArToolkitSource(
      artoolkitProfile.sourceParameters
    )
    this.artoolkitSource.init(this.handleResize)

    this.artoolkitContext = new THREEx.ArToolkitContext({
      ...artoolkitProfile.contextParameters,
      cameraParametersUrl: 'camera_para.dat',
      maxDetectionRate: 30
    })

    this.artoolkitContext.init(() => {
      this.camera.projectionMatrix.copy(
        this.artoolkitContext.getProjectionMatrix()
      )
    })
  }

  addMarkers () {
    MARKER_MODELS.forEach(({ file, modelName }) => {
      const marker = new THREE.Group()
      this.scene.add(marker)

      this.artoolkitMarker = new THREEx.ArMarkerControls(
        this.artoolkitContext,
        marker,
        {
          type: 'pattern',
          patternUrl: file
        }
      )

      const smoothedRoot = new THREE.Group()
      this.scene.add(smoothedRoot)

      const controls = new THREEx.ArSmoothedControls(smoothedRoot, {
        lerpPosition: 0.4,
        lerpQuaternion: 0.3,
        lerpScale: 1
      })

      this.addModel(modelName, smoothedRoot)

      this.controls.push({
        control: controls,
        marker
      })
    })
  }

  addModel (modelName, root) {
    switch (modelName) {
      case 'spaceship_complete':
        const spaceship = new Spaceship(this.renderer)

        spaceship.load()
          .then((model) => root.add(model))
        break

      default:
        throw new Error(`No model found for "${modelName}"`)
    }
  }

  updateControls () {
    for (let i = 0; i < this.controls.length; i += 1) {
      if (this.controls[i] && this.controls[i].control) {
        this.controls[i].control.update(this.controls[i].marker)
      }
    }
  }

  handleResize = () => {
    this.artoolkitSource.onResize()
    this.artoolkitSource.copySizeTo(this.renderer.domElement)

    if (this.artoolkitContext.arController !== null) {
      this.artoolkitSource.copySizeTo(this.artoolkitContext.arController.canvas)
    }
  };

  update () {
    if (this.artoolkitSource && this.artoolkitSource.ready !== false) {
      this.artoolkitContext.update(this.artoolkitSource.domElement)
    }

    this.updateControls()
  }
}

export default ARDisplay