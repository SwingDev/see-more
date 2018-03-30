import 'normalize.css'
import 'styles/main.scss'

import Stats from 'stats.js'

import { MARKER_MODELS } from './config'
import makeLights from './components/Lights'
import loadModel from './utils/model-loader'

const enableDevTools = () => {
  const stats = new Stats()

  stats.showPanel(0)
  stats.dom.style.position = 'absolute'
  stats.dom.style.left = '10px'
  stats.dom.style.top = '10px'
  document.body.appendChild(stats.dom)

  return { stats }
}

class App {
  constructor () {
    this.controls = []

    this.setScene()
    this.setRenderer()
    this.setLights()

    this.setARToolkit()
    this.addMarkers()

    this.stats = enableDevTools().stats

    this.animate()
    window.addEventListener('resize', this.handleSourceResize)
  }

  setScene () {
    this.camera = new THREE.Camera()
    this.scene = new THREE.Scene()
    this.scene.add(this.camera)
  }

  setRenderer () {
    const canvasEl = document.getElementById('scene')

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      alpha: true
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

  setARToolkit () {
    const artoolkitProfile = new THREEx.ArToolkitProfile()
    artoolkitProfile.sourceWebcam()

    this.artoolkitSource = new THREEx.ArToolkitSource(
      artoolkitProfile.sourceParameters
    )
    this.artoolkitSource.init(this.handleSourceResize)

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
    loadModel(`/${modelName}/${modelName}.gltf`)
      .then((object) => {
        object.scale.set(0.05, 0.05, 0.05)
        root.add(object)
      })
  }

  addMarker () {
    this.marker = new THREE.Group()
    this.scene.add(this.marker)

    this.artoolkitMarker = new THREEx.ArMarkerControls(this.artoolkitContext, this.marker, {
      type: 'pattern',
      patternUrl: 'hiro.patt'
    })

    this.smoothedRoot = new THREE.Group()
    this.scene.add(this.smoothedRoot)

    this.smoothedControls = new THREEx.ArSmoothedControls(this.smoothedRoot, {
      lerpPosition: 0.4,
      lerpQuaternion: 0.3,
      lerpScale: 1
    })
  }

  setComponents () {
    const torusGeometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16)
    const torusMaterial = new THREE.MeshNormalMaterial()
    const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial)
    torusMesh.position.y = 0.5
    this.smoothedRoot.add(torusMesh)
  }

  updateControls () {
    for (let i = 0; i < this.controls.length; i += 1) {
      if (this.controls[i] && this.controls[i].control) {
        this.controls[i].control.update(this.controls[i].marker)
      }
    }
  }

  handleSourceResize = () => {
    this.artoolkitSource.onResize()
    this.artoolkitSource.copySizeTo(this.renderer.domElement)

    if (this.artoolkitContext.arController !== null) {
      this.artoolkitSource.copySizeTo(this.artoolkitContext.arController.canvas)
    }
  };

  handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  };

  animate = () => {
    this.render()
    requestAnimationFrame(this.animate)
  };

  render () {
    if (this.artoolkitSource.ready !== false) {
      this.artoolkitContext.update(this.artoolkitSource.domElement)
    }

    this.updateControls()

    this.renderer.render(this.scene, this.camera)
    this.stats.update()
  }
}

// eslint-disable-next-line
new App()
