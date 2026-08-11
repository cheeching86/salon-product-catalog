export default function ConfirmDialog({
  title,
  message,
  warning,
  confirmLabel = 'Delete',
  danger = true,
  onConfirm,
  onCancel
}) {
  return (
    <div className="dialog-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="dialog-card" role="alertdialog" aria-modal="true" aria-label={title}>
        <h3>{title}</h3>
        {message && <p>{message}</p>}
        {warning && <div className="dialog-warning">{warning}</div>}
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
