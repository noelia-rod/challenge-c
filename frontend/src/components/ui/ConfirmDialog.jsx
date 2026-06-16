import { useEffect, useRef } from 'react';

/**
 * Modal confirmation dialog.
 * @param {boolean}  isOpen   - Whether the dialog is visible
 * @param {string}   title    - Dialog title
 * @param {string}   message  - Confirmation message
 * @param {function} onConfirm - Called when user confirms
 * @param {function} onCancel  - Called when user cancels or closes
 */
export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen && confirmBtnRef.current) {
      confirmBtnRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-gray-900 mb-2">
          {title || 'Confirmar acción'}
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          {message || '¿Estás seguro de que deseas continuar?'}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            ref={confirmBtnRef}
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
