import apiClient from '../apiClient';

const solicitudesService = {
  getAll: async (filters = {}, pagination = {}) => {
    const params = {};
    if (filters.tipo_solicitud_id) params.tipo = filters.tipo_solicitud_id;
    if (filters.urgencia) params.urgencia = filters.urgencia;
    if (filters.estado) params.estado = filters.estado;
    if (pagination.page) params.page = pagination.page;
    if (pagination.limit) params.limit = pagination.limit;
    const response = await apiClient.get('/solicitudes', { params });
    // API returns { data: { data: [...], pagination: {...} } }
    return response.data.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/solicitudes/${id}`);
    return response.data.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/solicitudes', data);
    return response.data.data;
  },

  updateEstado: async (id, estado, usuario = 'Operador', comentario = '') => {
    const response = await apiClient.patch(`/solicitudes/${id}/estado`, {
      estado,
      usuario,
      comentario,
    });
    return response.data.data;
  },
};

export default solicitudesService;
