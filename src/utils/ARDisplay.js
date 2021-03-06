import debounce from 'lodash/debounce'

import Spaceship from 'components/Spaceship'
import parallax from 'components/ui/Parallax'

import { MARKER_MODELS, message } from 'root/config'
import { getCameraProjectionMatrix } from 'utils/math'

import store from 'store'
import { setHelperVisibility, setMessage } from 'store/actions'

class ARDisplay {
  constructor () {
    this.controls = []
    this.models = []
    this.camera = new THREE.Camera()

    this.disabled = false
    this.shouldUpdate = true
  }

  init (renderer, scene) {
    this.renderer = renderer
    this.scene = scene

    try {
      this.setARToolkit()
    } catch (e) {
      if (this.onError && !this.disabled) {
        this.onError(e)
      }

      this.disabled = true

      /* eslint-disable no-console */
      console.error(e)
      /* eslint-enable no-console */
    }

    if (!this.disabled) {
      this.clearSceneBackground()
      this.handleStoreUpdate()
      store.subscribe(this.handleStoreUpdate)
      window.addEventListener('resize', this.handleResize)
    }
  }

  clear () {
    this.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose()
        object.geometry = null
      }

      if (object.material) {
        object.material.dispose()
        object.material = null
      }
    })

    this.scene.children.forEach((object) => {
      this.scene.remove(object)
    })

    this.models.forEach((model) => {
      if (model.dispose) {
        model.dispose()
      }
    })
  }

  disable () {
    this.clear()

    this.renderer = null
    this.scene = null
    this.disabled = true

    window.removeEventListener('resize', this.handleResize)
  }

  clearSceneBackground () {
    parallax.show(false)
  }

  setARToolkit () {
    const artoolkitProfile = new THREEx.ArToolkitProfile()
    artoolkitProfile.sourceWebcam()

    this.artoolkitSource = new THREEx.ArToolkitSource(
      artoolkitProfile.sourceParameters
    )

    this.artoolkitSource.init(this.handleInit, this.handleError)

    // Fix wrong z-index defined by AR.js
    this.artoolkitSource.domElement.style.zIndex = '1'

    this.artoolkitContext = new THREEx.ArToolkitContext({
      ...artoolkitProfile.contextParameters,
      cameraParametersUrl: 'camera_para.dat',
      maxDetectionRate: 30
    })

    this.artoolkitContext.init(() => {
      const camerProjectionMatrix = getCameraProjectionMatrix(
        this.artoolkitContext._artoolkitProjectionAxisTransformMatrix
      )

      // Use custom camera projection matrix
      // to fix flickering issue
      this.camera.projectionMatrix.copy(
        camerProjectionMatrix
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

      controls.addEventListener('becameVisible', this.handleMarkerVisible)
      controls.addEventListener('becameUnVisible', this.handleMarkerHide)

      this.addModel(modelName, smoothedRoot)

      this.controls.push({
        control: controls,
        marker
      })
    })
  }

  addModel (modelName, root) {
    switch (modelName) {
      case 'spaceship':
        const spaceship = new Spaceship(this.renderer, {
          shadow: true,
          hovering: true
        })

        this.models.push(spaceship)

        spaceship.load()
          .then((model) => this.handleSpaceshipLoad(root, model))
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

  handleSpaceshipLoad = (root, model) => {
    model.position.y = 0.1
    root.add(model)
  };

  handleMarkerVisible = () => {
    store.dispatch(setHelperVisibility(false))
    store.dispatch(setMessage({
      show: false,
      text: ''
    }))
  };

  handleMarkerHide = () => {
    store.dispatch(setHelperVisibility(true))
    store.dispatch(setMessage({
      show: true,
      text: message.FIND_MAKER
    }))
  };

  handleInit = () => {
    if (this.disabled) return

    this.addMarkers()
    this.handleResize()
    this.handleMarkerHide()
  };

  handleResize = debounce(() => {
    if (this.disabled) return

    this.artoolkitSource.onResizeElement()
    this.artoolkitSource.copyElementSizeTo(this.renderer.domElement)

    if (this.artoolkitContext.arController !== null) {
      this.artoolkitSource.copyElementSizeTo(
        this.artoolkitContext.arController.canvas
      )
    }
  }, 100);

  handleError = () => {
    if (this.onError && !this.disabled) {
      this.onError()
    }
  };

  handleStoreUpdate = () => {
    const { lockScreen } = store.getState()

    this.shouldUpdate = !lockScreen
  };

  update () {
    if (this.disabled || !this.shouldUpdate) return

    if (this.artoolkitSource && this.artoolkitSource.ready !== false) {
      this.artoolkitContext.update(this.artoolkitSource.domElement)
    }

    this.updateControls()
  }
}

export default ARDisplay
