import { render } from 'lit-html'

import store from 'store'
import SplashScreen from './SplashScreen'

const container = document.getElementById('ui')

store.subscribe(() => {
  const { loaded } = store.getState()

  render(SplashScreen(loaded), container)
})

export default function () {
  render(SplashScreen(), container)
}
