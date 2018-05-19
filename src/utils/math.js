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
