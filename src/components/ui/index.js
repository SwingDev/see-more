import { render } from 'lit-html'

import store from 'store'

import './NoScriptMessage/styles.scss'
import updateSplashScreen from './SplashScreen'

const container = document.getElementById('ui')

store.subscribe(() => {
  const { loaded } = store.getState()

  updateSplashScreen(loaded)
})

export default function () {
}
