import { useReducer, useEffect, useCallback, useRef } from 'react'

const initialState = {
  status: 'pending',
  result: null,
  error: null,
  runs: 0
}

function reducer(state, action) {
  switch (action.type) {
    case 'reset':
      return { ...initialState }
    case 'fetchStart':
      return {
        ...state,
        status: 'pending',
        runs: state.runs + 1
      }
    case 'fetchSuccess':
      return {
        ...state,
        status: 'fulfilled',
        result: action.result
      }
    case 'fetchFailure':
      return {
        ...state,
        status: 'rejected',
        error: action.error
      }
    default:
      throw new Error()
  }
}

export default function useFetch(asyncFunc, deps = []) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  })

  const run = useCallback(async(...args) => {
    try {
      dispatch({ type: 'fetchStart' })
      const result = await asyncFunc(...args)
      if (mountedRef.current) {
        dispatch({ type: 'fetchSuccess', result })
      }
      return result
    } catch (error) {
      if (mountedRef.current) {
        dispatch({ type: 'fetchFailure', error })
      }
      console.error(error)
    }
  }, deps)

  return [state, run]
}
