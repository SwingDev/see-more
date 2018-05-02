import { LOADED_SET } from './actions'

const INITIAL_STATE = {
  loaded: false
}

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOADED_SET:
      return {
        ...state,
        loaded: true
      }

    default:
      return state
  }
}

export default reducer
