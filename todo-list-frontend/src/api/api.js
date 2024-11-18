import axios from 'axios';

const API_URL = 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true,
});

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post(`/users/register`, userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getTasks = () => axiosInstance.get('/tasks');

export const logout = () => axiosInstance.post('users/logout');

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? { Authorization: `Bearer ${user.token}` } : {};
};

export const loginUser = (user) => {
  return axiosInstance.post(`/users/login`, user);
};


export const createTask = (task) => {
  return axiosInstance.post(`/tasks`, task, {
    headers: getAuthHeaders()
  });
};

export const updateTask = (id, task) => {
  return axiosInstance.put(`/tasks/${id}`, task, {
    headers: getAuthHeaders()
  });
};

export const deleteTask = (id) => {
  return axiosInstance.delete(`/tasks/${id}`, {
    headers: getAuthHeaders()
  });
};

export const getTaskById = (id) => {
  return axiosInstance.get(`/tasks/${id}`, {
    headers: getAuthHeaders()
  });
};