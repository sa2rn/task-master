import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import api from './api'

function Logout() {
  useEffect(() => {
    api.accessToken = null
  }, [])

  return <Redirect to="/" />
}

export default Logout
