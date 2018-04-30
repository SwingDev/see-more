import * as THREE from 'three'
import GLTF2Loader from 'three-gltf2-loader'

import addPmremEnvMap from 'utils/pmrem-envmap'

GLTF2Loader(THREE)

const handleLoad = (object, resolve, renderer) => {
  object.scene.traverse((child) => {
    if (
      child.isMesh &&
      child.material.isMeshStandardMaterial &&
      child.name !== 'spaceship_outline_0'
    ) {
      addPmremEnvMap(child, renderer)
      child.material.emissiveIntensity = 1
    }
  })

  resolve(object.scene)
}

export default function (url, renderer) {
  const loader = new THREE.GLTFLoader()

  return new Promise((resolve) => {
    loader.load(url, (object) => handleLoad(object, resolve, renderer))
  })
}
