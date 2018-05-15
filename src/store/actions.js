export const LOADED_SET = 'LOADED_SET'
export const ERROR_SET = 'ERROR_SET'

export const setLoaded = () => ({
  type: LOADED_SET
})

export const setError = (error) => ({
  type: ERROR_SET,
  error
})
