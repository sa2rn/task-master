import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Form, Button, Container } from 'react-bootstrap'
import isLength from 'validator/lib/isLength'
import useForm from './useForm'
import api from './api'

function Register() {
  const { getFieldProps, isSuccessfullySubmitted, isSubmitting, errors, handleSubmit } = useForm({
    initialValues: {
      username: '',
      password: '',
      repeatPassword: ''
    },
    onSubmit: async (values) => {
      const { token } = await api.post('users/register', { username: values.username, password: values.password })
      api.accessToken = token
    },
    validate: (values) => {
      const errors = {}
      if (!isLength(values.username, { min: 3, max: 100 })) {
        errors.username = 'Allow value with length between 3 and 100'
      }
      if (!isLength(values.password, { min: 5, max: 100 })) {
        errors.password = 'Allow value with length between 5 and 100'
      }
      if (!errors.password && values.password !== values.repeatPassword) {
        errors.password = 'Passwords Must be identical'
      }
      return errors
    }
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
            <Form.Control {...getFieldProps('password')} size="lg" type="password" placeholder="Enter password" />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="repeatPassword">
            <Form.Label>Repeat password</Form.Label>
            <Form.Control {...getFieldProps('repeatPassword')} size="lg" type="password" placeholder="Repeat password" />
            <Form.Control.Feedback type="invalid">
              {errors.repeatPassword}
            </Form.Control.Feedback>
          </Form.Group>
          <Button className="mb-4" size="lg" block disabled={isSubmitting} variant="primary" type="submit">
            Sign up
          </Button>
          <p className="text-center">If you are registered <Link to="/login">Sign in</Link></p>
        </Form>
      </Container>
    </div>
  )
}

export default Register
