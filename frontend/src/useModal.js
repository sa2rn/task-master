import { useCallback, useReducer } from 'react'

const initialState = { isOpen: false, opens: 0 }

function reducer(state, action) {
  switch (action.type) {
    case 'openModal':
      return { ...state, isOpen: true, opens: state.opens + 1 }
    case 'closeModal':
      return { ...state, isOpen: false }
    case 'toggleModal':
      return { ...state, isOpen: !state.isOpen, opens: state.opens + (state.isOpen ? 0 : 1) }
    default:
      throw new Error();
  }
}

export default function useModal(isOpen = false) {
  const [state, dispatch] = useReducer(reducer, { ...initialState, isOpen })

  const show = useCallback(() => {
    dispatch({ type: 'openModal' })
  }, [])

  const hide = useCallback(() => {
    dispatch({ type: 'closeModal' })
  }, [])

  const toggle = useCallback(() => {
    dispatch({ type: 'toggleModal' })
  }, [])

  return { ...state, show, hide, toggle }
}
