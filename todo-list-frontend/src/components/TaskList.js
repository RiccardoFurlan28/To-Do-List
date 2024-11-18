import React, { useEffect, useState } from 'react';
import { deleteTask, updateTask } from '../api/api';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, setTasks, onEdit, onTaskUpdated }) => {
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    priority: '',
    category: '',
    completed: '',
  });

  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  
  useEffect(() => {
    let filtered = [...tasks];

    if (filters.title) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.category) {
      filtered = filtered.filter(task => 
        task.category.toLowerCase().includes(filters.category.toLowerCase()));
    }

    if (filters.completed) {
      filtered = filtered.filter(
        task =>
          (filters.completed === 'true' && task.completed) ||
          (filters.completed === 'false' && !task.completed)
      );
    }

    
    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      if (sortOrder === 'asc') {
        return dateA - dateB; 
      } else {
        return dateB - dateA; 
      }
    });

    setFilteredTasks(filtered);
  }, [filters, tasks, sortOrder]);

 
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  
  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

 
  const handleDelete = (id) => {
    deleteTask(id)
      .then(() => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  
  const handleToggleComplete = (task) => {
    const updatedTask = { ...task, completed: !task.completed };

    updateTask(task.id, updatedTask)
      .then(response => {
        onTaskUpdated(response.data); // Notify parent of task update
      })
      .catch(error => console.error('Error updating task:', error));
  };

  return (
    <div>
      <h2>Task List</h2>

      <div>
        <input
          type="text"
          name="title"
          placeholder="Search by Title"
          value={filters.title}
          onChange={handleFilterChange}
        />
        <select name="priority" value={filters.priority} onChange={handleFilterChange}>
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <input
          type="text"
          name="category"
          placeholder="Search by Category"
          value={filters.category}
          onChange={handleFilterChange}
        />
        <select name="completed" value={filters.completed} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="true">Completed</option>
          <option value="false">Incomplete</option>
        </select>
        <select name="sortOrder" value={sortOrder} onChange={handleSortOrderChange}>
          <option value="asc">Due Date Ascending</option>
          <option value="desc">Due Date Descending</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Category</th>
            <th>Completion Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;