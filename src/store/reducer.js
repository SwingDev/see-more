import { LOADED_SET, ERROR_SET } from './actions'

const INITIAL_STATE = {
  loaded: false,
  error: null
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

    default:
      return state
  }
}

export default reducer
