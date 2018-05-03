import './styles.scss'

const splashScreen = document.querySelector('.js-splash-screen')

export default function (loaded = false) {
  splashScreen.classList.toggle('is-hidden', loaded)
}
