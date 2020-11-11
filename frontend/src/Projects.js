import React, { createContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Spinner, Card, Button, Jumbotron } from 'react-bootstrap'
import { FaChevronRight } from 'react-icons/fa'
import useFetch from './useFetch'
import api from './api'
import ProjectEdit from './ProjectEdit'
import useModal from './useModal'
import './Projects.css'

export const ProjectsContext = createContext()

function Projects() {
  const [projectsState, fetchProjects] = useFetch(() => api.get('projects'))
  const modalNewProject = useModal()
  const modalEditProject = useModal()
  const [editedProject, setEditedProject] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  function editProject(data) {
    setEditedProject(data)
    modalEditProject.show()
  }

  async function deleteProject(data) {
    try {
      await api.delete(`projects/${data.id}`)
      await fetchProjects()
    } catch (err) {
      console.error(err)
    }
  }

  const user = api.accessTokenPayload

  function renderProjects() {
    return projectsState.result.map(item => (
      <div key={item.id}>
        <Card>
          <Card.Body className="Projects-cardBody">
            <Card.Title>{item.title}</Card.Title>
            <Card.Text>{item.description || 'Empty description...'}</Card.Text>
            <Link to={`/projects/${item.id}/tasks`}>
              <FaChevronRight />
            </Link>
          </Card.Body>
          <Card.Footer>
            <Button variant="outline-primary" onClick={() => editProject(item)}>Edit</Button>{' '}
            <Button onClick={() => deleteProject(item)} variant="outline-danger">Delete</Button>
          </Card.Footer>
        </Card>
      </div>
    ))
  }

  return (
    <ProjectsContext.Provider value={[projectsState, fetchProjects]}>
      <div>
        <Jumbotron>
          <h1>Hello, {user.username}!</h1>
          <p>
            This is a simple task manager.
            Developed by <a href="mailto:sa2rn.set@gmail.com">sa2rn.set@gmail.com</a>
          </p>
          <p>
            <a href="#">Source code &gt;</a>
          </p>
          <p>
            <Button size="lg" variant="primary" onClick={modalNewProject.show}>Create new project</Button>
          </p>
        </Jumbotron>
        <h2 className="mb-5 text-center">Project list</h2>
        {projectsState.pending && (
          <div className="text-center mb-4">
            <Spinner animation="border" />
          </div>
        )}
        {projectsState.result && (
          <div className="Projects-cards">
            {renderProjects()}
          </div>
        )}
        <ProjectEdit show={modalNewProject.isOpen} onHide={modalNewProject.hide} />
        {editedProject && (
          <ProjectEdit key={modalEditProject.opens} project={editedProject} show={modalEditProject.isOpen} onHide={modalEditProject.hide} />
        )}
      </div>
    </ProjectsContext.Provider>
  )
}

export default Projects
