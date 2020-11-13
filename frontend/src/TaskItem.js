import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form} from 'react-bootstrap'
import clsx from 'clsx'
import { BsFillTrashFill, BsPencilSquare } from 'react-icons/bs'
import { formatDistanceStrict } from 'date-fns'

function TaskItem({ task, onCheck, onEdit, onDelete }) {
  const handleCheckChange = (e) => onCheck(task, e.target.checked ? 'done' : 'new')
  const handleEditClick = () => onEdit(task)
  const handleDeleteClick = () => onDelete(task)

  return (
    <tr key={task.id}>
    <th scope="row">
      <Form.Check checked={task.status === 'done'}
        onChange={handleCheckChange}
        aria-label="Done"
      />
    </th>
    <td width="100%">
      {task.title}
      {task.deadline && (
        <span
          className={clsx('ml-1 badge', {
            'badge-secondary': task.daysLeft > 3,
            'badge-warning': task.daysLeft >= 1 && task.daysLeft <= 3,
            'badge-danger': task.daysLeft <= 0
          })}
        >
          {formatDistanceStrict(new Date(), task.deadline, { addSuffix: true, unit: 'd', partialMethod: 'ceil' })}
        </span>
      )}
    </td>
    <td>
      {task.priority}
    </td>
    <td>
      <div className="d-flex">
        <Button onClick={handleEditClick} variant="link" size="sm">
          <BsPencilSquare />
        </Button>
        <Button onClick={handleDeleteClick} variant="link" size="sm">
          <BsFillTrashFill />
        </Button>
      </div>
    </td>
  </tr>
  )
}

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  onCheck: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default TaskItem
