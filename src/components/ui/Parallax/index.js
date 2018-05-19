import { getQuaternion, sign } from 'utils/math'
import { transformProp } from 'utils/prefixed'

import './styles.scss'

const element = document.querySelector('.js-parallax')
const quaternion = new THREE.Quaternion()
const euler = new THREE.Euler()

const TRANSLATE_INIT = 50
const MAX_TRANSLATE = 10
const MAX_ANGLE = 90

const clamp = (value) => (
  (Math.abs(value) < MAX_ANGLE) ? value : sign(value) * MAX_ANGLE
)

const show = (visible) => {
  element.classList.toggle('visible', visible)
}

const update = (deviceOrientation) => {
  if (!deviceOrientation) return

  const { alpha, beta, gamma } = deviceOrientation
  const [w, x, y, z] = getQuaternion(alpha, beta, gamma)

  quaternion.set(x, y, z, w)
  euler.setFromQuaternion(quaternion)

  const { y: x1, x: y1 } = euler

  const xDeg = THREE.Math.radToDeg(x1)
  const xOffset = (clamp(xDeg) / MAX_ANGLE) * MAX_TRANSLATE

  const yDeg = THREE.Math.radToDeg(y1)
  const yOffset = (clamp(yDeg) / MAX_ANGLE) * MAX_TRANSLATE

  element.style[transformProp] = `
    translate(-${TRANSLATE_INIT + xOffset}%, -${TRANSLATE_INIT + yOffset}%)
  `
}

export default {
  show,
  update
}
