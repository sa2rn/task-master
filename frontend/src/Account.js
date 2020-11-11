import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'
import api from './api'

function Account({ children }) {
  if (!api.accessToken) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <header>
        <Navbar fixed="top" bg="light" variant="light" expand={false}>
          <Container>
            <Navbar.Brand as={Link} to="/">TaskMaster</Navbar.Brand>
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
