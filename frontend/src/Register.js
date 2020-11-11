import React from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Button, Container } from 'react-bootstrap'
import useForm from './useForm'
import api from './api'

function Register() {
  const { getFieldProps, isSuccessfullySubmitted, isSubmitting, errors, handleSubmit } = useForm({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: async (values) => {
      const { token } = await api.post('users/register', values)
      api.accessToken = token
    },
  })

  if (api.accessToken) {
    return <Redirect to="/" />
  }

  // if (isSuccessfullySubmitted) {
  //   return <Redirect to="/" />
  // }

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center">
      <Container style={{ maxWidth: '400px' }}>
        <h1 className="text-center mb-3">Sign up</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control {...getFieldProps('username')} size="lg" type="text" placeholder="Enter username" />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control {...getFieldProps('password')} size="lg" type="password" placeholder="Enter Password" />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Button size="lg" block disabled={isSubmitting} variant="primary" type="submit">
            Sign up
          </Button>
        </Form>
      </Container>
    </div>
  )
}

export default Register
