import axios from 'axios';

// Create Axios instance. In development, Vite proxy redirects /api to http://localhost:5000
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 30000,
});

// Interceptor to attach JWT token to authorized requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tenkasi_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const adminLogin = async (username, password) => {
  const response = await API.post('/api/admin/login', { username, password });
  return response.data;
};

// Dashboard Stats
export const getDashboardStats = async () => {
  const response = await API.get('/api/admin/dashboard');
  return response.data;
};

// Job Openings APIs
export const getPublicJobs = async () => {
  const response = await API.get('/api/jobs');
  return response.data;
};

export const getAllJobs = async () => {
  const response = await API.get('/api/jobs/all');
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await API.post('/api/jobs', jobData);
  return response.data;
};

export const updateJob = async (id, jobData) => {
  const response = await API.put(`/api/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await API.delete(`/api/jobs/${id}`);
  return response.data;
};

// Job Applications APIs
export const submitApplication = async (formData) => {
  // Requires multipart/form-data for PDF uploads
  const response = await API.post('/api/applications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getApplications = async (filters = {}) => {
  const response = await API.get('/api/applications', { params: filters });
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await API.delete(`/api/applications/${id}`);
  return response.data;
};

// Placements APIs
export const getPublicPlacements = async () => {
  const response = await API.get('/api/placements');
  return response.data;
};

export const getAllPlacements = async () => {
  const response = await API.get('/api/placements/all');
  return response.data;
};

export const createPlacement = async (formData) => {
  const response = await API.post('/api/placements', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePlacement = async (id, formData) => {
  const response = await API.put(`/api/placements/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletePlacement = async (id) => {
  const response = await API.delete(`/api/placements/${id}`);
  return response.data;
};

// Contact Message APIs
export const submitContact = async (contactData) => {
  const response = await API.post('/api/contact', contactData);
  return response.data;
};

export const getContacts = async (search = '') => {
  const response = await API.get('/api/contact', { params: { search } });
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await API.delete(`/api/contact/${id}`);
  return response.data;
};

export default API;
