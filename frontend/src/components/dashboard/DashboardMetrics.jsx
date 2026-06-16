import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import dashboardService from '../../api/services/dashboardService';

const ESTADO_COLORS = {
  Recibida: '#3b82f6',
  'En revisión': '#f59e0b',
  Resuelta: '#10b981',
  Rechazada: '#ef4444',
  Cancelada: '#6b7280',
};

const URGENCIA_COLORS = {
  Alta: '#ef4444',
  Media: '#f59e0b',
  Baja: '#10b981',
};

const ESTADO_ORDER = ['Recibida', 'En revisión', 'Resuelta', 'Rechazada', 'Cancelada'];
const URGENCIA_ORDER = ['Alta', 'Media', 'Baja'];

function StatCard({ label, value, color, icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-gray-600">
          {payload[0].value} solicitud{payload[0].value !== 1 ? 'es' : ''}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardMetrics({ refreshKey }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    dashboardService
      .getMetrics()
      .then((data) => {
        if (!cancelled) {
          setMetrics(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Error al cargar métricas');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
        No se pudieron cargar las métricas: {error}
      </div>
    );
  }

  if (!metrics) return null;

  // Convert API arrays [{estado, count}] / [{urgencia, count}] to lookup maps
  const estadoMap = {};
  (metrics.por_estado ?? []).forEach((d) => {
    estadoMap[d.estado] = d.count;
  });

  const urgenciaMap = {};
  (metrics.por_urgencia ?? []).forEach((d) => {
    urgenciaMap[d.urgencia] = d.count;
  });

  // Build chart data maintaining consistent display order
  const estadoData = ESTADO_ORDER.map((estado) => ({
    name: estado,
    value: estadoMap[estado] ?? 0,
    color: ESTADO_COLORS[estado] ?? '#94a3b8',
  }));

  const urgenciaData = URGENCIA_ORDER.map((urgencia) => ({
    name: urgencia,
    value: urgenciaMap[urgencia] ?? 0,
    color: URGENCIA_COLORS[urgencia] ?? '#94a3b8',
  }));

  const totalAbiertas =
    (estadoMap['Recibida'] ?? 0) + (estadoMap['En revisión'] ?? 0);

  const totalResueltas = estadoMap['Resuelta'] ?? 0;

  return (
    <div className="mb-8">
      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total de solicitudes"
          value={metrics.total ?? 0}
          color="#3b82f6"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
        />
        <StatCard
          label="Abiertas"
          value={totalAbiertas}
          color="#f59e0b"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          label="Resueltas"
          value={totalResueltas}
          color="#10b981"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          label="Alta urgencia"
          value={urgenciaMap['Alta'] ?? 0}
          color="#ef4444"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Por estado */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Solicitudes por Estado
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={estadoData}
              margin={{ top: 4, right: 8, left: -20, bottom: 4 }}
              barSize={28}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {estadoData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Por urgencia */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Solicitudes por Urgencia
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={urgenciaData}
              margin={{ top: 4, right: 8, left: -20, bottom: 4 }}
              barSize={48}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {urgenciaData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Urgencia legend pills */}
          <div className="flex gap-3 mt-3 justify-center">
            {urgenciaData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: d.color }}
                />
                {d.name}
                <span className="font-semibold text-gray-800">({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
