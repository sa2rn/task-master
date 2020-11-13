import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, InputGroup } from 'react-bootstrap'
import isLength from 'validator/lib/isLength'
import api from './api'
import useForm from './useForm'
import { TasksContext } from './Tasks'

function QuickCreateTask({ projectId }) {
  const [, fetchProject] = useContext(TasksContext)
  const { errors, resetForm, getFieldProps, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      title: '',
      ProjectId: projectId
    },
    onSubmit: (values) => api.post('tasks', values),
    onSuccess: () => {
      resetForm()
      fetchProject()
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
    <Form onSubmit={handleSubmit}>
      <InputGroup size="lg">
        <Form.Control {...getFieldProps('title')} type="text" placeholder="Enter title" />
        <InputGroup.Append>
          <Button disabled={isSubmitting} type="submit" variant="primary">Create</Button>
        </InputGroup.Append>
      </InputGroup>
      <Form.Control.Feedback type="invalid" style={{ display: errors.title ? 'block' : 'none' }}>
        {errors.title}
      </Form.Control.Feedback>
    </Form>
  )
}

QuickCreateTask.propTypes = {
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default QuickCreateTask
