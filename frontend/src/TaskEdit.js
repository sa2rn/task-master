import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Modal } from 'react-bootstrap'
import useForm from './useForm'
import api from './api'
import { TasksContext } from './Tasks'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// only for update
function TaskEdit({ task, show, onHide }) {
  const [,fetchProject] = useContext(TasksContext)
  const { errors, values, setFieldValue, resetForm, getFieldProps, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      ProjectId: task.ProjectId,
      title: task.title ?? '',
      description: task.description ?? '',
      status: task.status,
      priority: task.priority ?? '',
      deadline: task.deadline ? new Date(task.deadline) : ''
    },
    onSubmit: (values) => api.put(`tasks/${task.id}`, values),
    onSuccess: () => {
      onHide()
      resetForm()
      fetchProject()
    }
  })

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{`Edit task ${task.title}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="task.username">
            <Form.Label>Title</Form.Label>
            <Form.Control {...getFieldProps('title')} type="text" placeholder="Enter title" />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="task.description">
            <Form.Label>Description</Form.Label>
            <Form.Control {...getFieldProps('description')} as="textarea" rows={3} placeholder="Enter description" />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="task.priority">
            <Form.Label>Priority</Form.Label>
            <Form.Control {...getFieldProps('priority')} type="range" min="0" max="10" />
            <Form.Control.Feedback type="invalid">
              {errors.priority}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="task.deadline">
            <Form.Label>Deadline</Form.Label>
            <div>
              <Form.Control isInvalid={!!errors.deadline} as={DatePicker} selected={values.deadline} onChange={(date) => setFieldValue('deadline', date)} />
              <Form.Control.Feedback type="invalid" style={{display: errors.deadline ? 'block' : 'none'}}>
                {errors.deadline}
              </Form.Control.Feedback>
            </div>
            {/* <Form.Control {...getFieldProps('deadline')} type="text" min="0" max="10" /> */}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>Cancel</Button>
          <Button disabled={isSubmitting} type="submit" variant="primary">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

TaskEdit.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired
}

export default TaskEdit
