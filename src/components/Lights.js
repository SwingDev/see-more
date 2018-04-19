import * as THREE from 'three'

export default function () {
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xc7cbd6, 0.6)
  hemiLight.position.set(0, 50, 0)

  return {
    hemiLight
  }
}
