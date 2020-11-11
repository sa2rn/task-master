import React, { useEffect } from 'react'
import { ListGroup, Spinner } from 'react-bootstrap'
import { useParams } from 'react-router'
import api from './api'
import useFetch from './useFetch'

function Tasks() {
  const { projectId } = useParams()
  const [state, fetchProject] = useFetch(async () => {
    const project = await api.get(`projects/${projectId}`)
    const tasks = await api.get(`tasks?ProjectId=${projectId}&status=new`)
    return { project, tasks }
  })

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  if (state.status === 'pending') {
    return (
      <div className="text-center mb-4">
        <Spinner animation="border" />
      </div>
    )
  }
  if (state.status === 'rejected') {
    return (
      <div>
        <h1 className="mb-4 text-center">Project not found</h1>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4 text-center">{state.result.project.title}</h2>
      <ListGroup variant="flush">
        {state.result.tasks.map(item => (
          <ListGroup.Item key={item.id}>
              {item.title}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default Tasks
