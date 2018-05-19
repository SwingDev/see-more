export const LOADED_SET = 'LOADED_SET'
export const ERROR_SET = 'ERROR_SET'
export const MESSAGE_SET = 'MESSAGE_SET'
export const HELPER_VISIBILITY_SET = 'HELPER_VISIBILITY_SET'
export const SCREEN_LOCK_SET = 'SCREEN_LOCK_SET'

export const setLoaded = () => ({
  type: LOADED_SET
})

export const setError = (error) => ({
  type: ERROR_SET,
  error
})

export const setMessage = ({
  show,
  text = '',
  light
}) => ({
  type: MESSAGE_SET,
  show,
  text,
  light
})

export const setHelperVisibility = (show) => ({
  type: HELPER_VISIBILITY_SET,
  show
})

export const setScreenLock = (lock) => ({
  type: SCREEN_LOCK_SET,
  lock
})
