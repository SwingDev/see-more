/* eslint-disable max-len */
// @see: https://www.w3.org/TR/2016/CR-orientation-event-20160818/#worked-example-2
/* eslint-enable max-len */

export const getQuaternion = (alpha, beta, gamma) => {
  const _x = beta ? THREE.Math.degToRad(beta) : 0 // beta value
  const _y = gamma ? THREE.Math.degToRad(gamma) : 0 // gamma value
  const _z = alpha ? THREE.Math.degToRad(alpha) : 0 // alpha value

  const cX = Math.cos(_x / 2)
  const cY = Math.cos(_y / 2)
  const cZ = Math.cos(_z / 2)
  const sX = Math.sin(_x / 2)
  const sY = Math.sin(_y / 2)
  const sZ = Math.sin(_z / 2)

  //
  // ZXY quaternion construction.
  //
  const w = cX * cY * cZ - sX * sY * sZ
  const x = sX * cY * cZ - cX * sY * sZ
  const y = cX * sY * cZ + sX * cY * sZ
  const z = cX * cY * sZ + sX * sY * cZ

  return [w, x, y, z]
}

export const sign = (x) => (
  typeof x === 'number' ? x ? x < 0 ? -1 : 1 : (x === x) ? 0 : NaN : NaN
)

/* eslint-disable max-len */
// @see: https://github.com/artoolkit/jsartoolkit5/issues/2#issuecomment-367611628
/* eslint-enable max-len */
export const projectionMatrixCalc = (
  fieldOfViewYInRadians,
  aspect,
  zNear,
  zFar,
  dst
) => {
  dst = dst || new Float64Array(16)

  var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians)
  var rangeInv = 1.0 / (zNear - zFar)

  dst[0] = f / aspect
  dst[1] = 0
  dst[2] = 0
  dst[3] = 0

  dst[4] = 0
  dst[5] = -f
  dst[6] = 0
  dst[7] = 0

  dst[8] = 0
  dst[9] = 0
  dst[10] = -(zNear + zFar) * rangeInv
  dst[11] = 1

  dst[12] = 0
  dst[13] = 0
  dst[14] = zNear * zFar * rangeInv * 2
  dst[15] = 0

  return dst
}

/* eslint-disable max-len */
// This solves problem with flickering overlapping meshes, due
// to wrong `near` parameter provided by jsartoolkit5
// see: https://github.com/artoolkit/jsartoolkit5/issues/2#issuecomment-367611628
/* eslint-enable max-len */
export const getCameraProjectionMatrix = (matrixTransform) => {
  const martixArray = projectionMatrixCalc(0.750492, 640 / 480, 1, 1000)
  const projectionMatrix = new THREE.Matrix4().fromArray(martixArray)

  projectionMatrix.multiply(matrixTransform)

  return projectionMatrix
}
