import { useState } from 'react'

export default function NameDialog({ title, label, initialValue = '', onSave, onCancel }) {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState('')

  function handleSave() {
    const trimmed = value.trim()
    if (!trimmed) {
      setError('This field is required.')
      return
    }
    onSave(trimmed)
  }

  return (
    <div className="dialog-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="dialog-card" role="dialog" aria-modal="true" aria-label={title}>
        <h3>{title}</h3>
        <div className="form-field" style={{ marginTop: 14 }}>
          <label>{label}</label>
          <input
            type="text"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          {error && <div className="dialog-warning" style={{ marginTop: 8 }}>{error}</div>}
        </div>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
