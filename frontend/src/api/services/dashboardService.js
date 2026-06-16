import apiClient from '../apiClient';

const dashboardService = {
  getMetrics: async () => {
    const response = await apiClient.get('/dashboard/metrics');
    return response.data.data;
  },
};

export default dashboardService;
