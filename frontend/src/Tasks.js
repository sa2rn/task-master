import React, { createContext, useEffect, useState } from 'react'
import { Button, Form, Spinner, Table } from 'react-bootstrap'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { BsFillTrashFill, BsPencilSquare } from 'react-icons/bs'
import api from './api'
import QuickCreateTask from './QuickCreateTask'
import useFetch from './useFetch'
import useModal from './useModal'
import TaskEdit from './TaskEdit'

export const TasksContext = createContext()

function Tasks() {
  const { projectId } = useParams()
  const modalEditTask = useModal()
  const [state, fetchProject] = useFetch(async () => {
    const project = await api.get(`projects/${projectId}`)
    const tasks = await api.get(`tasks?ProjectId=${projectId}&status=new&orderBy=priority&orderDir=DESC`)
    return { project, tasks }
  })
  const [editedTask, setEditedTask] = useState(null)

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  function editTask(data) {
    setEditedTask(data)
    modalEditTask.show()
  }

  async function doneTask(data) {
    await api.put(`tasks/${data.id}`, {
      ...data,
      status: 'done'
    })
    await fetchProject()
  }

  if (!state.result && state.status === 'pending') {
    return (
      <div className="text-center mb-4">
        <Spinner animation="border" />
      </div>
    )
  }
  if (state.status === 'rejected') {
    return (
      <h1 className="mb-4 text-center">Project not found</h1>
    )
  }

  function renderTasks() {
    return state.result.tasks.map(item => (
      <tr key={item.id}>
        <th scope="row">
          <Form.Check onChange={() => doneTask(item)} aria-label="Done" />
        </th>
        <td width="100%">
          {item.title}
        </td>
        <td>
          <div className="d-flex">
            <Button onClick={() => editTask(item)} variant="link" size="sm">
              <BsPencilSquare />
            </Button>
            <Button variant="link" size="sm">
              <BsFillTrashFill />
            </Button>
          </div>
        </td>
      </tr>
    ))
  }

  return (
    <TasksContext.Provider value={[state, fetchProject]}>
      <div>
        <p><Link to="/projects">&lt; Go back to project list</Link></p>
        <h2 className="mb-4">Tasks for project <b>{state.result.project.title}</b></h2>
        <p>
          Fill the form to create new task
        </p>
        <QuickCreateTask projectId={projectId} />
        <Table hover responsive>
          <tbody>
            {state.result?.tasks && renderTasks()}
          </tbody>
        </Table>
        {editedTask && (
          <TaskEdit key={editedTask} task={editedTask} show={modalEditTask.isOpen} onHide={modalEditTask.hide} />
        )}
      </div>
    </TasksContext.Provider>
  )
}

export default Tasks
