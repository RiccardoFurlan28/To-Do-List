import React, { useState, useEffect, useMemo } from 'react';
import { createTask, updateTask, getTaskById } from '../api/api';

const TaskForm = ({ taskId, onTaskUpdated }) => {
  const initialTaskState = useMemo(() => ({
    title: '',
    description: '',
    dueDate: '',
    priority: 'LOW',
    category: '',
    completed: false,
  }), []);

  const [task, setTask] = useState(initialTaskState);

  useEffect(() => {
    if (taskId) {
      getTaskById(taskId)
        .then(response => setTask(response.data))
        .catch(error => console.error('Error fetching task:', error));
    } else {
      setTask(initialTaskState);
    }
  }, [taskId, initialTaskState]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (taskId) {
     
      updateTask(taskId, task)
        .then(response => {
          onTaskUpdated(response.data);
          setTask(initialTaskState); 
        })
        .catch(error => console.error('Error updating task:', error));
    } else {
     
      createTask(task)
        .then(response => {
          onTaskUpdated(response.data); 
          setTask(initialTaskState);
        })
        .catch(error => console.error('Error creating task:', error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={task.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <textarea
        name="description"
        value={task.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <input
        type="date"
        name="dueDate"
        value={task.dueDate}
        onChange={handleChange}
        required
      />
      <select
        name="priority"
        value={task.priority}
        onChange={handleChange}
        required
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
      <input
        type="text"
        name="category"
        value={task.category}
        onChange={handleChange}
        placeholder="Category"
        required
      />
      <button type="submit">{taskId ? 'Update Task' : 'Create Task'}</button>
    </form>
  );
};

export default TaskForm;