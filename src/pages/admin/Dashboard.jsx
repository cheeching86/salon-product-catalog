import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'

export default function Dashboard({ onNavigate }) {
  const brandCount = useLiveQuery(() => db.brands.count(), [], 0)
  const categoryCount = useLiveQuery(() => db.categories.count(), [], 0)
  const productCount = useLiveQuery(() => db.products.count(), [], 0)
  const withImage = useLiveQuery(() => db.products.filter((p) => !!p.image).count(), [], 0)

  return (
    <div>
      <h2>Dashboard</h2>
      <p className="section-desc">A quick overview of what's currently stored on this device.</p>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card__value">{productCount}</div>
          <div className="stat-card__label">Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{brandCount}</div>
          <div className="stat-card__label">Brands</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{categoryCount}</div>
          <div className="stat-card__label">Categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{withImage}</div>
          <div className="stat-card__label">Products with photo</div>
        </div>
      </div>

      <div className="backup-card">
        <h3>Everything here lives only on this device</h3>
        <p>
          All brands, categories, products and photos are stored locally in this tablet's browser storage.
          Nothing is uploaded anywhere. Use <strong>Backup &amp; Restore</strong> regularly to keep a saved
          copy in case this device is ever reset or replaced.
        </p>
        <button className="btn btn-primary btn-sm" onClick={() => onNavigate('backup')}>
          Go to Backup &amp; Restore
        </button>
      </div>
    </div>
  )
}
