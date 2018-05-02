import { applyMiddleware, compose, createStore } from 'redux'
import reducer from './reducer'

const middlewares = []

const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
      : compose

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger')

  middlewares.push(logger)
}

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares)
)

const store = createStore(
  reducer,
  enhancer
)

export default store
