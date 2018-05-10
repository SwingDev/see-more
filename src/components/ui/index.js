import store from 'store'

import './NoScriptMessage/styles.scss'
import updateSplashScreen from './SplashScreen'
import OrientationOverlay from './OrientationOverlay'

const container = document.getElementById('ui')

store.subscribe(() => {
  const { loaded } = store.getState()

  updateSplashScreen(loaded)
})

export default function () {
  const overlay = new OrientationOverlay(container)

  overlay.init()
}
