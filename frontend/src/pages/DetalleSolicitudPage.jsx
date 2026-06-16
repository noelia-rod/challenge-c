import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Badge from '../components/ui/Badge';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import solicitudesService from '../api/services/solicitudesService';

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

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

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldRow({ label, children }) {
  return (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 sm:mt-0 sm:col-span-2 text-sm text-gray-900">{children}</dd>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-base font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">
      {children}
    </h2>
  );
}

function HistorialTimeline({ historial }) {
  if (!historial || historial.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic py-4 text-center">
        Sin cambios de estado registrados.
      </p>
    );
  }

  const ESTADO_COLORS = {
    Recibida: 'bg-blue-100 text-blue-700 border-blue-200',
    'En revisión': 'bg-amber-100 text-amber-700 border-amber-200',
    Resuelta: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Rechazada: 'bg-red-100 text-red-700 border-red-200',
    Cancelada: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <ol className="relative border-l border-gray-200 ml-3 space-y-6">
      {historial.map((entry, idx) => (
        <li key={entry.id ?? idx} className="ml-6">
          {/* Timeline dot */}
          <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-white border-2 border-blue-400 rounded-full">
            <svg
              className="w-3 h-3 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
            {/* State transition */}
            <div className="flex items-center flex-wrap gap-2 mb-1">
              {entry.estado_anterior ? (
                <>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                      ESTADO_COLORS[entry.estado_anterior] ?? 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    {entry.estado_anterior}
                  </span>
                  <svg
                    className="w-3 h-3 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              ) : (
                <span className="text-xs text-gray-400 italic">Creación →</span>
              )}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                  ESTADO_COLORS[entry.estado_nuevo] ?? 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                {entry.estado_nuevo}
              </span>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-4 text-xs text-gray-500">
              <span>
                <span className="font-medium text-gray-700">Por:</span> {entry.usuario}
              </span>
              <span>
                <span className="font-medium text-gray-700">Fecha:</span>{' '}
                {formatDateTime(entry.fecha_cambio)}
              </span>
            </div>

            {/* Optional comment */}
            {entry.comentario && (
              <p className="mt-2 text-xs text-gray-600 bg-white border border-gray-100 rounded px-2 py-1 italic">
                "{entry.comentario}"
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DetalleSolicitudPage() {
  const { id } = useParams();
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchSolicitud() {
    setLoading(true);
    setError(null);
    try {
      const data = await solicitudesService.getById(id);
      setSolicitud(data);
    } catch (err) {
      setError(err.message || 'Error al cargar la solicitud');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSolicitud();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Layout>
      {/* Back button */}
      <div className="mb-5">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a la bandeja
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <LoadingSpinner message="Cargando solicitud..." />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchSolicitud} />
      ) : !solicitud ? null : (
        <div className="space-y-6">
          {/* ── Header card ─────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-blue-600 font-semibold mb-1">
                  {solicitud.numero_ticket}
                </p>
                <h1 className="text-xl font-bold text-gray-900">{solicitud.titulo}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Creada el {formatDateTime(solicitud.fecha_creacion)}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge type="urgencia" value={solicitud.urgencia} />
                <Badge type="estado" value={solicitud.estado} />
              </div>
            </div>

            {/* Overdue banner */}
            {isOverdue(solicitud.fecha_vencimiento, solicitud.estado) && (
              <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  <strong>Solicitud vencida.</strong> La fecha límite era{' '}
                  {formatDate(solicitud.fecha_vencimiento)}.
                </span>
              </div>
            )}
          </div>

          {/* ── Main grid: details + historial ──────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: detail fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información general */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <SectionTitle>Información general</SectionTitle>
                <dl className="divide-y divide-gray-100">
                  <FieldRow label="Tipo de solicitud">
                    {solicitud.tipo_solicitud?.nombre ??
                      solicitud.tipo_solicitud_nombre ??
                      '—'}
                  </FieldRow>
                  <FieldRow label="Descripción">
                    <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                      {solicitud.descripcion}
                    </p>
                  </FieldRow>
                  <FieldRow label="Urgencia">
                    <Badge type="urgencia" value={solicitud.urgencia} />
                  </FieldRow>
                  <FieldRow label="Estado actual">
                    <Badge type="estado" value={solicitud.estado} />
                  </FieldRow>
                </dl>
              </div>

              {/* Solicitante */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <SectionTitle>Solicitante</SectionTitle>
                <dl className="divide-y divide-gray-100">
                  <FieldRow label="Nombre">{solicitud.solicitante}</FieldRow>
                  <FieldRow label="Email">
                    <a
                      href={`mailto:${solicitud.email_solicitante}`}
                      className="text-blue-600 hover:underline"
                    >
                      {solicitud.email_solicitante}
                    </a>
                  </FieldRow>
                  <FieldRow label="Área solicitante">
                    {solicitud.area_solicitante?.nombre ??
                      solicitud.area_solicitante_nombre ??
                      '—'}
                  </FieldRow>
                </dl>
              </div>

              {/* Gestión */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <SectionTitle>Gestión</SectionTitle>
                <dl className="divide-y divide-gray-100">
                  <FieldRow label="Área asignada">
                    {solicitud.area_asignada?.nombre ??
                      solicitud.area_asignada_nombre ??
                      '—'}
                  </FieldRow>
                  <FieldRow label="Asignado a">
                    {solicitud.asignado_a || '—'}
                  </FieldRow>
                  <FieldRow label="Fecha de creación">
                    {formatDateTime(solicitud.fecha_creacion)}
                  </FieldRow>
                  <FieldRow label="Fecha de vencimiento (SLA)">
                    {solicitud.fecha_vencimiento ? (
                      <span
                        className={
                          isOverdue(solicitud.fecha_vencimiento, solicitud.estado)
                            ? 'text-red-600 font-semibold'
                            : 'text-gray-900'
                        }
                      >
                        {isOverdue(solicitud.fecha_vencimiento, solicitud.estado) && (
                          <span className="mr-1">⚠</span>
                        )}
                        {formatDateTime(solicitud.fecha_vencimiento)}
                      </span>
                    ) : (
                      '—'
                    )}
                  </FieldRow>
                  {solicitud.fecha_resolucion && (
                    <FieldRow label="Fecha de resolución">
                      {formatDateTime(solicitud.fecha_resolucion)}
                    </FieldRow>
                  )}
                </dl>
              </div>

              {/* Resolution section — only when resolved */}
              {solicitud.solucion && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <SectionTitle>Resolución</SectionTitle>
                  <p className="text-sm text-emerald-800 whitespace-pre-wrap leading-relaxed">
                    {solicitud.solucion}
                  </p>
                </div>
              )}

              {/* Rating section — only when present */}
              {solicitud.calificacion != null && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                  <SectionTitle>Calificación</SectionTitle>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${
                            star <= solicitud.calificacion
                              ? 'text-amber-400'
                              : 'text-gray-200'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {solicitud.calificacion}/5
                    </span>
                  </div>
                  {solicitud.comentario_calificacion && (
                    <p className="mt-3 text-sm text-gray-600 italic">
                      "{solicitud.comentario_calificacion}"
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right column: historial timeline */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-4">
                <SectionTitle>Historial de cambios</SectionTitle>
                <HistorialTimeline historial={solicitud.historial} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
