import 'normalize.css'
import 'styles/main.scss'

import Stats from 'stats.js'

const ASPECT_RATIO = window.innerWidth / window.innerHeight

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
    this.setScene()
    this.setRenderer()

    this.setARToolkit()
    this.addMarker()
    this.setComponents()

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

  setARToolkit () {
    const artoolkitProfile = new THREEx.ArToolkitProfile()
    artoolkitProfile.sourceWebcam()

    this.artoolkitSource = new THREEx.ArToolkitSource(artoolkitProfile.sourceParameters)
    this.artoolkitSource.init(this.handleSourceResize)

    this.artoolkitContext = new THREEx.ArToolkitContext({
      ...artoolkitProfile.contextParameters,
      cameraParametersUrl: 'camera_para.dat',
      detectionMode: 'mono',
      maxDetectionRate: 30,
      canvasWidth: 80 * 3,
      canvasHeight: 60 * 3
    })

    this.artoolkitContext.init(() => {
      this.camera.projectionMatrix.copy(this.artoolkitContext.getProjectionMatrix())
    })
  }

  addMarker () {
    this.marker = new THREE.Group()
    this.scene.add(this.marker)

    this.artoolkitMarker = new THREEx.ArMarkerControls(this.artoolkitContext, this.marker, {
      type: 'pattern',
      patternUrl: 'patt.hiro'
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
    this.smoothedControls.update(this.marker)
    this.renderer.render(this.scene, this.camera)
    this.stats.update()
  }
}

// eslint-disable-next-line
new App()
