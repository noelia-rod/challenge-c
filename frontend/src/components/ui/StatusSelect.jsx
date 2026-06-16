import { useState } from 'react';

// Valid transitions per current state
const TRANSITIONS = {
  Recibida: ['En revisión', 'Rechazada', 'Cancelada'],
  'En revisión': ['Resuelta', 'Rechazada', 'Cancelada'],
  Resuelta: [],
  Rechazada: [],
  Cancelada: [],
};

const SELECT_COLOR = {
  Recibida: 'border-blue-300 bg-blue-50 text-blue-700',
  'En revisión': 'border-orange-300 bg-orange-50 text-orange-700',
  Resuelta: 'border-green-300 bg-green-50 text-green-700',
  Rechazada: 'border-red-300 bg-red-50 text-red-700',
  Cancelada: 'border-gray-300 bg-gray-50 text-gray-600',
};

/**
 * Inline status change dropdown.
 * @param {string}   currentEstado  - Current estado value
 * @param {function} onUpdate       - async (newEstado) => void  — called when user selects a new value
 */
export default function StatusSelect({ currentEstado, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const options = TRANSITIONS[currentEstado] ?? [];

  if (options.length === 0) {
    // Terminal state — show as plain badge-like text
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded border ${SELECT_COLOR[currentEstado] || 'border-gray-200 bg-gray-50 text-gray-600'}`}>
        {currentEstado}
      </span>
    );
  }

  const handleChange = async (e) => {
    const newEstado = e.target.value;
    if (!newEstado) return;
    setLoading(true);
    try {
      await onUpdate(newEstado);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={currentEstado}
      onChange={handleChange}
      disabled={loading}
      className={`text-xs font-medium px-2 py-1 rounded border cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 ${SELECT_COLOR[currentEstado] || ''}`}
    >
      <option value={currentEstado}>{currentEstado}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          → {opt}
        </option>
      ))}
    </select>
  );
}
