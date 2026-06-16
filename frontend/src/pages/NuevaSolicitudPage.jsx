import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useCatalogo } from '../context/CatalogoContext';
import solicitudesService from '../api/services/solicitudesService';

const URGENCIAS = ['Alta', 'Media', 'Baja'];

const INITIAL_FORM = {
  tipo_solicitud_id: '',
  urgencia: '',
  titulo: '',
  descripcion: '',
  solicitante: '',
  email_solicitante: '',
  area_solicitante_id: '',
};

function validate(form) {
  const errors = {};
  if (!form.tipo_solicitud_id) errors.tipo_solicitud_id = 'Selecciona un tipo de solicitud.';
  if (!form.urgencia) errors.urgencia = 'Selecciona la urgencia.';
  if (!form.titulo.trim()) errors.titulo = 'El título es requerido.';
  else if (form.titulo.trim().length < 5) errors.titulo = 'El título debe tener al menos 5 caracteres.';
  if (!form.descripcion.trim()) errors.descripcion = 'La descripción es requerida.';
  else if (form.descripcion.trim().length < 10) errors.descripcion = 'La descripción debe tener al menos 10 caracteres.';
  if (!form.solicitante.trim()) errors.solicitante = 'El nombre del solicitante es requerido.';
  if (!form.email_solicitante.trim()) {
    errors.email_solicitante = 'El email es requerido.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_solicitante)) {
    errors.email_solicitante = 'Ingresa un email válido.';
  }
  if (!form.area_solicitante_id) errors.area_solicitante_id = 'Selecciona un área.';
  return errors;
}

export default function NuevaSolicitudPage() {
  const navigate = useNavigate();
  const { areas, tiposSolicitud, loading: catalogoLoading, error: catalogoError } = useCatalogo();

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successTicket, setSuccessTicket] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        ...form,
        tipo_solicitud_id: Number(form.tipo_solicitud_id),
        area_solicitante_id: Number(form.area_solicitante_id),
      };
      const created = await solicitudesService.create(payload);
      setSuccessTicket(created.numero_ticket);
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (catalogoLoading) return <Layout><LoadingSpinner text="Cargando catálogos..." /></Layout>;
  if (catalogoError) return <Layout><ErrorMessage message={catalogoError} /></Layout>;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Nueva Solicitud</h1>
          <p className="text-sm text-gray-500 mt-1">
            Completa el formulario para registrar una nueva solicitud interna.
          </p>
        </div>

        {/* Success alert */}
        {successTicket && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-5 py-4">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-green-800">¡Solicitud creada correctamente!</p>
              <p className="text-sm text-green-700">Ticket: <strong>{successTicket}</strong>. Redirigiendo...</p>
            </div>
          </div>
        )}

        {/* Error alert */}
        {submitError && (
          <div className="mb-6">
            <ErrorMessage message={submitError} />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">

          {/* Tipo de solicitud */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tipo_solicitud_id">
              Tipo de solicitud <span className="text-red-500">*</span>
            </label>
            <select
              id="tipo_solicitud_id"
              name="tipo_solicitud_id"
              value={form.tipo_solicitud_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.tipo_solicitud_id ? 'border-red-400' : 'border-gray-300'}`}
            >
              <option value="">Seleccionar tipo...</option>
              {tiposSolicitud.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} (SLA: {t.sla_horas}h)
                </option>
              ))}
            </select>
            {fieldErrors.tipo_solicitud_id && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.tipo_solicitud_id}</p>
            )}
          </div>

          {/* Urgencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgencia <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {URGENCIAS.map((u) => {
                const colors = {
                  Alta: 'border-red-400 bg-red-50 text-red-700',
                  Media: 'border-yellow-400 bg-yellow-50 text-yellow-700',
                  Baja: 'border-green-400 bg-green-50 text-green-700',
                };
                const selected = form.urgencia === u;
                return (
                  <label key={u} className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="urgencia"
                      value={u}
                      checked={selected}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`text-center py-2 rounded-lg border-2 text-sm font-medium transition-all ${selected ? colors[u] : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {u}
                    </div>
                  </label>
                );
              })}
            </div>
            {fieldErrors.urgencia && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.urgencia}</p>
            )}
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="titulo">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Resumen breve de la solicitud"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.titulo ? 'border-red-400' : 'border-gray-300'}`}
            />
            {fieldErrors.titulo && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.titulo}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="descripcion">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={4}
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe detalladamente la solicitud..."
              className={`w-full px-3 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.descripcion ? 'border-red-400' : 'border-gray-300'}`}
            />
            {fieldErrors.descripcion && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.descripcion}</p>
            )}
          </div>

          {/* Solicitante */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="solicitante">
                Nombre del solicitante <span className="text-red-500">*</span>
              </label>
              <input
                id="solicitante"
                name="solicitante"
                type="text"
                value={form.solicitante}
                onChange={handleChange}
                placeholder="Nombre completo"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.solicitante ? 'border-red-400' : 'border-gray-300'}`}
              />
              {fieldErrors.solicitante && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.solicitante}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email_solicitante">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email_solicitante"
                name="email_solicitante"
                type="email"
                value={form.email_solicitante}
                onChange={handleChange}
                placeholder="correo@empresa.com"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.email_solicitante ? 'border-red-400' : 'border-gray-300'}`}
              />
              {fieldErrors.email_solicitante && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.email_solicitante}</p>
              )}
            </div>
          </div>

          {/* Área solicitante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="area_solicitante_id">
              Área <span className="text-red-500">*</span>
            </label>
            <select
              id="area_solicitante_id"
              name="area_solicitante_id"
              value={form.area_solicitante_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors.area_solicitante_id ? 'border-red-400' : 'border-gray-300'}`}
            >
              <option value="">Seleccionar área...</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
            {fieldErrors.area_solicitante_id && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.area_solicitante_id}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-2"
            >
              {submitting && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {submitting ? 'Enviando...' : 'Crear solicitud'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
