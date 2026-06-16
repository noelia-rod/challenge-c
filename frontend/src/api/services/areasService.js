import apiClient from '../apiClient';

const areasService = {
  getAll: async () => {
    const response = await apiClient.get('/areas');
    return response.data.data;
  },
};

export default areasService;
