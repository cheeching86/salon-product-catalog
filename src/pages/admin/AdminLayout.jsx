import { useState } from 'react'
import { ArrowLeftIcon, DashboardIcon, TagIcon, LayersIcon, PackageIcon, BackupIcon } from '../../components/Icons'
import Dashboard from './Dashboard'
import BrandsAdmin from './BrandsAdmin'
import CategoriesAdmin from './CategoriesAdmin'
import ProductsAdmin from './ProductsAdmin'
import BackupRestore from './BackupRestore'

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'brands', label: 'Brands', icon: TagIcon },
  { id: 'categories', label: 'Categories', icon: LayersIcon },
  { id: 'products', label: 'Products', icon: PackageIcon },
  { id: 'backup', label: 'Backup & Restore', icon: BackupIcon }
]

export default function AdminLayout({ onBackToCatalog }) {
  const [section, setSection] = useState('dashboard')

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <h2 className="admin-topbar__title">
          Salon Catalog <span>Admin</span>
        </h2>
        <button className="btn btn-secondary btn-sm" onClick={onBackToCatalog}>
          <ArrowLeftIcon width={16} height={16} />
          Back to catalog
        </button>
      </div>

      <div className="admin-body">
        <nav className="admin-nav">
          {SECTIONS.map((s) => {
            const Icon = s.icon
            return (
              <button
                key={s.id}
                className={section === s.id ? 'active' : ''}
                onClick={() => setSection(s.id)}
              >
                <Icon />
                {s.label}
              </button>
            )
          })}
        </nav>

        <div className="admin-content">
          {section === 'dashboard' && <Dashboard onNavigate={setSection} />}
          {section === 'brands' && <BrandsAdmin />}
          {section === 'categories' && <CategoriesAdmin />}
          {section === 'products' && <ProductsAdmin />}
          {section === 'backup' && <BackupRestore />}
        </div>
      </div>
    </div>
  )
}
