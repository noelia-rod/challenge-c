const URGENCIA_STYLES = {
  Alta: 'bg-red-100 text-red-700 border-red-200',
  Media: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Baja: 'bg-green-100 text-green-700 border-green-200',
};

const ESTADO_STYLES = {
  Recibida: 'bg-blue-100 text-blue-700 border-blue-200',
  'En revisión': 'bg-orange-100 text-orange-700 border-orange-200',
  Resuelta: 'bg-green-100 text-green-700 border-green-200',
  Rechazada: 'bg-red-100 text-red-700 border-red-200',
  Cancelada: 'bg-gray-100 text-gray-600 border-gray-200',
};

/**
 * Badge component for urgencia or estado values.
 * @param {string} type - 'urgencia' | 'estado'
 * @param {string} value - The value to display
 */
export default function Badge({ type, value }) {
  const styleMap = type === 'urgencia' ? URGENCIA_STYLES : ESTADO_STYLES;
  const style = styleMap[value] || 'bg-gray-100 text-gray-600 border-gray-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}
    >
      {value}
    </span>
  );
}
