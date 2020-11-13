import React, { createContext, useEffect, useState } from 'react'
import { Spinner, Table } from 'react-bootstrap'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import api from './api'
import QuickCreateTask from './QuickCreateTask'
import useFetch from './useFetch'
import useModal from './useModal'
import TaskEdit from './TaskEdit'
import TaskItem from './TaskItem'

export const TasksContext = createContext()

function Tasks() {
  const { projectId } = useParams()
  const modalEditTask = useModal()
  const [state, fetchProject] = useFetch(async() => {
    const project = await api.get(`projects/${projectId}`)
    const tasks = await api.get(`tasks?ProjectId=${projectId}&orderBy=priority&orderDir=DESC`)
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

  async function changeTaskStatus(data, status) {
    try {
      await api.put(`tasks/${data.id}`, { ...data, status })
      await fetchProject()
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteTask(data) {
    try {
      await api.delete(`tasks/${data.id}`)
      await fetchProject()
    } catch (err) {
      console.error(err)
    }
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

  return (
    <TasksContext.Provider value={[state, fetchProject]}>
      <div>
        <p><Link to="/projects">&lt; Go back to project list</Link></p>
        <h2 className="mb-4">Tasks for project <b>{state.result.project.title}</b></h2>
        <p>
          Fill the form to create new task
        </p>
        <Table hover responsive>
          <thead className="thead-light">
            <tr>
              <th scope="col" colSpan="4">
                <QuickCreateTask projectId={projectId} />
              </th>
            </tr>
          </thead>
          <tbody>
            {state.result?.tasks && state.result.tasks.map(item =>
              <TaskItem key={item.id} task={item} onCheck={changeTaskStatus} onEdit={editTask} onDelete={deleteTask} />
            )}
          </tbody>
        </Table>
        {editedTask && (
          <TaskEdit key={modalEditTask.opens} task={editedTask} show={modalEditTask.isOpen} onHide={modalEditTask.hide} />
        )}
      </div>
    </TasksContext.Provider>
  )
}

export default Tasks
