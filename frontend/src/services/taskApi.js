import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getTasks = async () => {
  const response = await axios.get(`${API_URL}/tasks`);
  return response.data.data;
};

export const createTask = async (taskData) => {
  const response = await axios.post(`${API_URL}/tasks`, taskData);
  return response.data.data;
};

export const updateTask = async (id, taskData) => {
  const response = await axios.put(`${API_URL}/tasks/${id}`, taskData);
  return response.data.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/tasks/${id}`);
  return response.data;
};

export const updateTaskStage = async (id, stage) => {
  const response = await axios.patch(`${API_URL}/tasks/${id}/stage`, { stage });
  return response.data.data;
};