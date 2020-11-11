import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, InputGroup } from 'react-bootstrap'
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
    onSubmit: (values) => api.post(`tasks`, values),
    onSuccess: () => {
      resetForm()
      fetchProject()
    }
  })

  return (
    <Form className="mb-4" onSubmit={handleSubmit}>
      <InputGroup size="lg">
        <Form.Control {...getFieldProps('title')} type="text" placeholder="Enter title" />
        <InputGroup.Append>
          <Button disabled={isSubmitting} type="submit" variant="primary">Create</Button>
        </InputGroup.Append>
      </InputGroup>
      <Form.Control.Feedback type="invalid">
        {errors.title}
      </Form.Control.Feedback>
    </Form>
  )
}

QuickCreateTask.propTypes = {
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default QuickCreateTask
