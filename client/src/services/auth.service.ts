import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Backend runs on port 3000

export const login = async (email: string, password: string): Promise<{ token: string }> => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (email: string, password: string): Promise<{ id: number, token: string }> => {
  try {
    const response = await axios.post(`${API_URL}/register`, { 
      email, 
      password 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
