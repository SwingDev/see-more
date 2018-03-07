import * as THREE from 'three'
import GLTF2Loader from 'three-gltf2-loader'
import isEmpty from 'lodash/isEmpty'

import { MODEL_NAMES } from 'root/config'

GLTF2Loader(THREE)

const handleLoad = (object, resolve, reject) => {
  const models = {}

  object.scene.traverse((child) => {
    if (child.isMesh) {
      Object.keys(MODEL_NAMES).forEach((key) => {
        if (child.name.includes(MODEL_NAMES[key])) {
          models[key] = child
        }
      })
    }
  })

  if (!isEmpty(models)) {
    resolve(models)
  } else {
    reject(new Error('No models were found!'))
  }
}

export default function (url) {
  const loader = new THREE.GLTFLoader()

  return new Promise((resolve, reject) => {
    loader.load(url, (object) => handleLoad(object, resolve, reject))
  })
}
