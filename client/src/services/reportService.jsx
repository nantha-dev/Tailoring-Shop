import api from './api';

export const reportService = {
  getOrders: (params) => api.get('/reports/orders', { params }),
  getRevenue: (params) => api.get('/reports/revenue', { params }),
  exportOrdersPDF: () => api.get('/reports/export/orders/pdf', { responseType: 'blob' }),
  exportOrdersExcel: () => api.get('/reports/export/orders/excel', { responseType: 'blob' }),
};