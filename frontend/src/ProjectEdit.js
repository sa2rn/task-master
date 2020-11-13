import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Modal } from 'react-bootstrap'
import isLength from 'validator/lib/isLength'
import useForm from './useForm'
import api from './api'
import { ProjectsContext } from './Projects'

// for update and create
function ProjectEdit({ project, show, onHide }) {
  const [, fetchProjects] = useContext(ProjectsContext)
  const { errors, resetForm, getFieldProps, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      title: project?.title ?? '',
      description: project?.description ?? ''
    },
    onSubmit: async(values) => {
      if (project) {
        await api.put(`projects/${project.id}`, values)
      } else {
        await api.post('projects', values)
      }
    },
    onSuccess: () => {
      fetchProjects()
      onHide()
      resetForm()
    },
    validate: (values) => {
      const errors = {}
      if (!isLength(values.title, { min: 3, max: 100 })) {
        errors.title = 'Allow value with length between 3 and 100'
      }
      return errors
    }
  })

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{project ? `Edit project ${project?.title}` : 'Create new project'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="project.title">
            <Form.Label>Title</Form.Label>
            <Form.Control {...getFieldProps('title')} type="text" placeholder="Enter title" />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="project.description">
            <Form.Label>Description</Form.Label>
            <Form.Control {...getFieldProps('description')} as="textarea" rows={3} placeholder="Enter description" />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
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

ProjectEdit.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  project: PropTypes.object
}

export default ProjectEdit
