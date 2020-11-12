import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case 'setFieldValue':
      return {
        ...state,
        values: {
          ...state.values,
          [action.name]: action.value
        }
      }
    case 'setFieldError':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.name]: action.message
        }
      }
    case 'clearErrors': {
      return {
        ...state,
        errors: {}
      }
    }
    case 'setErrors': {
      return {
        ...state,
        errors: action.errors
      }
    }
    case 'submit': {
      return {
        ...state,
        isSubmitting: true,
      }
    }
    case 'submitSuccessful': {
      return {
        ...state,
        isSubmitting: false,
        isSuccessfullySubmitted: true,
      }
    }
    case 'submitFailure': {
      return {
        ...state,
        isSubmitting: false,
      }
    }
    case 'setState': {
      return action.newState
    }
    default:
      throw new Error();
  }
}

export default function useForm({ initialValues, onSuccess, validate, onSubmit }) {
  const initialState = {
    isSubmitting: false,
    isSuccessfullySubmitted: false,
    values: initialValues,
    initialValues,
    errors: {}
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  function setFieldValue(name, value) {
    dispatch({ type: 'setFieldValue', name, value })
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFieldValue(name, value)
  }

  function setFieldError(name, message) {
    dispatch({ type: 'setFieldError', name, message })
  }

  function setErrors(errors) {
    dispatch({ type: 'setErrors', errors })
  }

  function resetForm() {
    dispatch({ type: 'setState', newState: initialState })
  }

  function isValid() {
    if (!validate) return true

    const errors = validate(state.values) || {}
    const hasErrors = Object.keys(errors).length > 0

    if (hasErrors) {
      setErrors(errors)
    }

    return !hasErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!isValid()) return

    try {
      dispatch({ type: 'submit' })
      const result = await onSubmit(state.values)
      dispatch({ type: 'submitSuccessful' })
      onSuccess && onSuccess(result)
    } catch (err) {
      dispatch({ type: 'submitFailure', error: err })
      if (err.name === 'ValidationError') {
        setErrors(err.errors)
      } else {
        console.error(err)
      }
    }
  }

  function clearErrors() {
    dispatch({ type: 'clearErrors' })
  }

  function getFieldProps(name) {
    return {
      name,
      value: state.values[name],
      isInvalid: !!state.errors[name],
      onChange: handleChange,
    }
  }

  return {
    ...state,
    handleChange,
    resetForm,
    setFieldError,
    setFieldValue,
    handleSubmit,
    clearErrors,
    setErrors,
    getFieldProps
  }
}
