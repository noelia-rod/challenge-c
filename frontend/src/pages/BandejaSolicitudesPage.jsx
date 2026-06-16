import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Badge from '../components/ui/Badge';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatusSelect from '../components/ui/StatusSelect';
import { useCatalogo } from '../context/CatalogoContext';
import solicitudesService from '../api/services/solicitudesService';
import DashboardMetrics from '../components/dashboard/DashboardMetrics';

const URGENCIAS = ['Alta', 'Media', 'Baja'];
const ESTADOS = ['Recibida', 'En revisión', 'Resuelta', 'Rechazada', 'Cancelada'];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function isOverdue(fechaVencimiento, estado) {
  if (!fechaVencimiento) return false;
  if (estado === 'Resuelta' || estado === 'Rechazada' || estado === 'Cancelada') return false;
  return new Date(fechaVencimiento) < new Date();
}

export default function BandejaSolicitudesPage() {
  const { tiposSolicitud, loading: loadingCatalogo } = useCatalogo();

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter state
  const [filters, setFilters] = useState({
    tipo_solicitud_id: '',
    urgencia: '',
    estado: '',
  });

  // Inline update feedback per row
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  const fetchSolicitudes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await solicitudesService.getAll(filters);
      setSolicitudes(data);
    } catch (err) {
      setError(err.message || 'Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  }, [filters, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function clearFilters() {
    setFilters({ tipo_solicitud_id: '', urgencia: '', estado: '' });
  }

  async function handleEstadoUpdate(solicitudId, newEstado) {
    setUpdatingId(solicitudId);
    setUpdateError(null);
    try {
      const updated = await solicitudesService.updateEstado(solicitudId, newEstado);
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === solicitudId ? { ...s, ...updated } : s)),
      );
      // Trigger dashboard metrics refresh
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setUpdateError(err.message || 'Error al actualizar el estado');
    } finally {
      setUpdatingId(null);
    }
  }

  const hasActiveFilters =
    filters.tipo_solicitud_id || filters.urgencia || filters.estado;

  return (
    <Layout>
      {/* Dashboard metrics section */}
      <DashboardMetrics refreshKey={refreshKey} />

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bandeja de Solicitudes</h1>
          {!loading && !error && (
            <p className="text-sm text-gray-500 mt-0.5">
              {solicitudes.length} solicitud{solicitudes.length !== 1 ? 'es' : ''}
              {hasActiveFilters ? ' (filtradas)' : ''}
            </p>
          )}
        </div>
        <Link
          to="/solicitudes/nueva"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Solicitud
        </Link>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          {/* Tipo de solicitud filter */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Tipo de solicitud
            </label>
            <select
              name="tipo_solicitud_id"
              value={filters.tipo_solicitud_id}
              onChange={handleFilterChange}
              disabled={loadingCatalogo}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="">Todos los tipos</option>
              {tiposSolicitud.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Urgencia filter */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Urgencia
            </label>
            <select
              name="urgencia"
              value={filters.urgencia}
              onChange={handleFilterChange}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="">Todas</option>
              {URGENCIAS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Estado filter */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={filters.estado}
              onChange={handleFilterChange}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="">Todos</option>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Inline update error */}
      {updateError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {updateError}
          <button
            onClick={() => setUpdateError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Table area */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner message="Cargando solicitudes..." />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchSolicitudes} />
      ) : solicitudes.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <svg
            className="w-12 h-12 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500 text-sm">
            {hasActiveFilters
              ? 'No hay solicitudes que coincidan con los filtros aplicados.'
              : 'No hay solicitudes registradas aún.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    Ticket
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">
                    Título
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    Tipo
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    Urgencia
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    Estado
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    Solicitante
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    Área
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    Creada
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">
                    Vencimiento
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {solicitudes.map((s) => {
                  const overdue = isOverdue(s.fecha_vencimiento, s.estado);
                  const isUpdating = updatingId === s.id;

                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-gray-50 transition-colors ${isUpdating ? 'opacity-60' : ''}`}
                    >
                      {/* Ticket — clickable link to detail */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link
                          to={`/solicitudes/${s.id}`}
                          className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {s.numero_ticket}
                        </Link>
                      </td>

                      {/* Title — truncated with tooltip */}
                      <td className="px-4 py-3 max-w-[220px]">
                        <Link
                          to={`/solicitudes/${s.id}`}
                          className="text-gray-900 hover:text-blue-700 font-medium line-clamp-2 hover:underline"
                          title={s.titulo}
                        >
                          {s.titulo}
                        </Link>
                      </td>

                      {/* Tipo */}
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {s.tipo_solicitud_nombre || s.tipo_solicitud?.nombre || '—'}
                      </td>

                      {/* Urgencia badge */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge type="urgencia" value={s.urgencia} />
                      </td>

                      {/* Estado — inline change */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isUpdating ? (
                          <span className="text-xs text-gray-500 italic">Actualizando...</span>
                        ) : (
                          <StatusSelect
                            currentEstado={s.estado}
                            onUpdate={(newEstado) => handleEstadoUpdate(s.id, newEstado)}
                          />
                        )}
                      </td>

                      {/* Solicitante */}
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                        {s.solicitante}
                      </td>

                      {/* Área solicitante */}
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {s.area_solicitante_nombre || s.area_solicitante?.nombre || '—'}
                      </td>

                      {/* Fecha creación */}
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                        {formatDate(s.fecha_creacion)}
                      </td>

                      {/* Fecha vencimiento with overdue indicator */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {s.fecha_vencimiento ? (
                          <span
                            className={`font-medium ${
                              overdue ? 'text-red-600' : 'text-gray-500'
                            }`}
                          >
                            {overdue && (
                              <span className="mr-1" title="Vencida">
                                ⚠
                              </span>
                            )}
                            {formatDate(s.fecha_vencimiento)}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
