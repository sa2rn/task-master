import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'
import api from './api'
import logo from './logo.png'

function Account({ children }) {
  if (!api.accessToken) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <header>
        <Navbar fixed="top" bg="light" variant="light" expand={false}>
          <Container>
            <Navbar.Brand as={Link} to="/">
            <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{' '}
              TaskMaster
            </Navbar.Brand>
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </header>
      <main style={{marginTop: '5rem', marginBottom: '2rem'}}>
        <Container>
          {children}
        </Container>
      </main>
    </>
  )
}

export default Account
