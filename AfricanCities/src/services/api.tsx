import axios from "axios";

const API_URL = "http://localhost:5000"; // Flask backend

export const uploadDocument = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_URL}/upload`, formData);
};

export const sendMessage = (message: string) => {
  return axios.post(`${API_URL}/chat`, { message });
};

export const fetchDiagnosticData = () => {
  return axios.get(`${API_URL}/diagnostic`);
};
