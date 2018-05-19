// @see: https://davidwalsh.name/page-visibility
export const pageVisibility = (() => {
  let hidden
  let state
  let visibilityChange

  if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden'
    visibilityChange = 'visibilitychange'
    state = 'visibilityState'
  } else if (typeof document.mozHidden !== 'undefined') {
    hidden = 'mozHidden'
    visibilityChange = 'mozvisibilitychange'
    state = 'mozVisibilityState'
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden'
    visibilityChange = 'msvisibilitychange'
    state = 'msVisibilityState'
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden'
    visibilityChange = 'webkitvisibilitychange'
    state = 'webkitVisibilityState'
  }

  return { hidden, state, visibilityChange }
})()

// @see: https://modernizr.com/docs#modernizr-prefixed
export const transitionEndEvent = (() => {
  const transEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'transition': 'transitionend'
  }

  return transEndEventNames[Modernizr.prefixed('transition')]
})()

export const transformProp = Modernizr.prefixed('transform')

export const getScreenOrientation = () => (
  ('orientation' in window.screen)
    ? window.screen.orientation.angle
    : window.orientation
)
