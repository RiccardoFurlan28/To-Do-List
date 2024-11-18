import React, { useEffect, useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Login from './components/Login';
import Register from './components/Register';
import { getTasks, logout } from './api/api';
import './styles.css'; // Import the CSS file

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      if (response.status === 200) {
        setTasks(response.data); // Populate tasks if successful
        setIsLoggedIn(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setIsLoggedIn(false); // Unauthenticated, show login/register
      } else {
        //console.error('Error fetching tasks:', error);
      }
    }
  };

  useEffect(() => {
    fetchTasks(); // Check authentication and fetch tasks
  }, []);

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prevTasks) => {
      const taskIndex = prevTasks.findIndex((task) => task.id === updatedTask.id);
      if (taskIndex > -1) {
        const newTasks = [...prevTasks];
        newTasks[taskIndex] = updatedTask;
        return newTasks;
      } else {
        return [...prevTasks, updatedTask];
      }
    });
    setEditingTask(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleLogout = () => {
    // Clear local session and reset state
    logout();
    setTasks([]);
    setIsLoggedIn(false);
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      {isLoggedIn ? (
        <div>
          <button className="logout" onClick={handleLogout}>Logout</button>
          <TaskForm taskId={editingTask?.id} onTaskUpdated={handleTaskUpdated} />
          <TaskList tasks={tasks} setTasks={setTasks} onEdit={handleEdit} onTaskUpdated={handleTaskUpdated} />
        </div>
      ) : (
        <div>
          <Login onLogin={fetchTasks} />
          <Register onRegister={fetchTasks} />
        </div>
      )}
    </div>
  );
}

export default App;