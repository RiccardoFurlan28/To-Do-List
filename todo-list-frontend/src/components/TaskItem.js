import React from 'react';

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  return (
    <tr>
      <td>{task.title}</td>
      <td>{task.description}</td>
      <td>{task.dueDate || 'N/A'}</td>
      <td>{task.priority}</td>
      <td>{task.category || 'N/A'}</td>
      <td>{task.completed ? 'Completed' : 'Incomplete'}</td>
      <td>
        <button onClick={() => onEdit(task)}>Edit</button>
        <button onClick={() => onDelete(task.id)}>Delete</button>
        <button onClick={() => onToggleComplete(task)}>
          {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
      </td>
    </tr>
  );
};

export default TaskItem;