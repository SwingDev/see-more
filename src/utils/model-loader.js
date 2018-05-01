import GLTF2Loader from 'three-gltf2-loader'

import addPmremEnvMap from 'utils/pmrem-envmap'

GLTF2Loader(THREE)

const MODEL_CACHE = {}

const handleLoad = ({ object, resolve, renderer, url }) => {
  MODEL_CACHE[url] = object

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
    if (MODEL_CACHE[url]) {
      handleLoad({
        object: MODEL_CACHE[url],
        resolve,
        renderer,
        url
      })
    } else {
      loader.load(url, (object) => handleLoad({
        object,
        resolve,
        renderer,
        url
      }))
    }
  })
}
