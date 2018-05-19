import {
  LOADED_SET,
  ERROR_SET,
  MESSAGE_SET,
  HELPER_VISIBILITY_SET,
  SCREEN_LOCK_SET
} from './actions'

const INITIAL_STATE = {
  loaded: false,
  error: null,
  message: {
    show: false,
    text: '',
    light: false
  },
  showHelper: false,
  lockScreen: false
}

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOADED_SET:
      return {
        ...state,
        loaded: true
      }

    case ERROR_SET:
      return {
        ...state,
        error: action.error
      }

    case MESSAGE_SET:
      return {
        ...state,
        message: {
          ...state.message,
          show: action.show,
          text: action.text,
          light: action.light
        }
      }

    case HELPER_VISIBILITY_SET:
      return {
        ...state,
        showHelper: action.show
      }

    case SCREEN_LOCK_SET:
      return {
        ...state,
        lockScreen: action.lock
      }

    default:
      return state
  }
}

export default reducer
