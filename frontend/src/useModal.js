import { useCallback, useState } from 'react'

export default function useModal() {
  const [isOpen, setIsOpen] = useState(false)

  const show = useCallback(() => {
    setIsOpen(true)
  }, [])

  const hide = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback((v) => {
    if (typeof v === 'boolean') {
      setIsOpen(v)
    } else {
      setIsOpen(prev => !prev)
    }
  }, [])

  return { isOpen, show, hide, toggle }
}
