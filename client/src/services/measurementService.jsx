import api from './api';

export const measurementService = {
  getByCustomer: (customerId) => api.get(`/measurements/customer/${customerId}`),
  getById: (id) => api.get(`/measurements/${id}`),
  create: (data) => api.post('/measurements', data),
  update: (id, data) => api.put(`/measurements/${id}`, data),
  delete: (id) => api.delete(`/measurements/${id}`),
};