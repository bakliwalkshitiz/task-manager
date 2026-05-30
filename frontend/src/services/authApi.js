import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const register = async (formData) => {
  const response = await axios.post(`${API_URL}/auth/register`, formData);
  return response.data.data;
};

export const login = async (formData) => {
  const response = await axios.post(`${API_URL}/auth/login`, formData);
  return response.data.data;
};

export const getMe = async () => {
  const response = await axios.get(`${API_URL}/auth/me`);
  return response.data.data;
};