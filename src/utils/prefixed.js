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
