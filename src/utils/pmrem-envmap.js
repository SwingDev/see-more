import * as THREE from 'three'
import { ENV_MAP_TILES } from 'root/config'

import 'libs/PMREMGenerator'
import 'libs/PMREMCubeUVPacker'

const handleLoad = (texture, mesh, renderer) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearMipMapLinearFilter

  const pmremGenerator = new THREE.PMREMGenerator(texture)
  pmremGenerator.update(renderer)

  const pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods)
  pmremCubeUVPacker.update(renderer)

  mesh.material.envMap = pmremCubeUVPacker.CubeUVRenderTarget.texture
  mesh.material.needsUpdate = true
}

export default function (mesh, renderer) {
  const loader = new THREE.CubeTextureLoader()
  loader.load(ENV_MAP_TILES, (map) => handleLoad(map, mesh, renderer))
}
