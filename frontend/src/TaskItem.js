import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form} from 'react-bootstrap'
import clsx from 'clsx'
import { BsFillTrashFill, BsPencilSquare } from 'react-icons/bs'
import { formatDistanceStrict, parseISO, differenceInHours } from 'date-fns'

function convertToDate(date) {
  if (!date) return null
  return typeof date === 'string' ? parseISO(date) : date
}

function getBadgeColors(deadline) {
  const days = Math.ceil(differenceInHours(deadline, new Date())/24)|0

  return {
    'badge-secondary': days > 3,
    'badge-warning': days >= 1 && days <= 3,
    'badge-danger': days <= 0
  }
}

function TaskItem({ task, onCheck, onEdit, onDelete }) {
  const handleCheckChange = (e) => onCheck(task, e.target.checked ? 'done' : 'new')
  const handleEditClick = () => onEdit(task)
  const handleDeleteClick = () => onDelete(task)
  const deadlineDate = convertToDate(task.deadline)

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
      {deadlineDate && (
        <span
          className={clsx('ml-1 badge', getBadgeColors(deadlineDate))}
        >
          {formatDistanceStrict(deadlineDate, new Date(), { addSuffix: true, unit: 'day', roundingMethod: 'ceil' })}
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
