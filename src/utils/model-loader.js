import * as THREE from 'three'
import GLTF2Loader from 'three-gltf2-loader'

GLTF2Loader(THREE)

const handleLoad = (object, resolve) => {
  object.scene.traverse((child) => {
    if (child.isMesh) {
      console.log(child)
      // Object.keys(MODEL_NAMES).forEach((key) => {
      //   if (child.name.includes(MODEL_NAMES[key])) {
      //     models[key] = child
      //   }
      // })
    }
  })

  resolve(object.scene)
}

export default function (url) {
  const loader = new THREE.GLTFLoader()

  return new Promise((resolve, reject) => {
    loader.load(url, (object) => handleLoad(object, resolve, reject))
  })
}
