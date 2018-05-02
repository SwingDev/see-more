import { html } from 'lit-html'
import classNames from 'classnames'

import LogoImg from 'images/logo.svg'
import BannerImg from 'images/banner.svg'

import styles from './styles.scss'

const SplashScreen = (isHidden = false) => {
  const classes = classNames(styles.root, {
    [styles.hidden]: isHidden
  })

  return html`
    <div class="${classes}">
      <img class="${styles.logo}" src="${LogoImg}" alt="SwingDev" />
      <img class="${styles.banner}" src="${BannerImg}" alt="See more" />
    </div>
  `
}

export default SplashScreen
