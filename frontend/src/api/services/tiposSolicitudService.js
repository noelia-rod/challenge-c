import apiClient from '../apiClient';

const tiposSolicitudService = {
  getAll: async () => {
    const response = await apiClient.get('/tipos-solicitud');
    return response.data.data;
  },
};

export default tiposSolicitudService;
