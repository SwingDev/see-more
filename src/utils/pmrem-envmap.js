import * as THREE from 'three'
import { SKYBOX_TILES } from 'root/config'

import 'libs/PMREMGenerator'
import 'libs/PMREMCubeUVPacker'

const handleLoad = (texture, mesh, renderer) => {
  const pmremGenerator = new THREE.PMREMGenerator(texture)
  pmremGenerator.update(renderer)

  const pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods)
  pmremCubeUVPacker.update(renderer)

  mesh.material.envMap = pmremCubeUVPacker.CubeUVRenderTarget.texture
  mesh.material.needsUpdate = true
}

export default function (mesh, renderer) {
  const loader = new THREE.CubeTextureLoader()
  loader.load(SKYBOX_TILES, (map) => handleLoad(map, mesh, renderer))
}
