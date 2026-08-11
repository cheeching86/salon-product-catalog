import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import ProductCard from '../components/ProductCard'
import ProductDetailModal from '../components/ProductDetailModal'
import OfflineIndicator from '../components/OfflineIndicator'
import { SearchIcon, SettingsIcon } from '../components/Icons'

export default function CustomerCatalog({ onOpenAdmin }) {
  const [query, setQuery] = useState('')
  const [brandId, setBrandId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [selected, setSelected] = useState(null)

  const brands = useLiveQuery(() => db.brands.orderBy('name').toArray(), [], [])
  const categories = useLiveQuery(() => db.categories.orderBy('name').toArray(), [], [])
  const products = useLiveQuery(() => db.products.toArray(), [], [])

  const brandById = useMemo(() => Object.fromEntries((brands || []).map((b) => [b.id, b.name])), [brands])
  const categoryById = useMemo(
    () => Object.fromEntries((categories || []).map((c) => [c.id, c.name])),
    [categories]
  )

  const filtered = useMemo(() => {
    if (!products) return []
    const q = query.trim().toLowerCase()

    return products.filter((p) => {
      if (brandId && p.brandId !== brandId) return false
      if (categoryId && p.categoryId !== categoryId) return false
      if (!q) return true

      const brandName = (brandById[p.brandId] || '').toLowerCase()
      const categoryName = (categoryById[p.categoryId] || '').toLowerCase()
      const haystack = `${p.name} ${brandName} ${categoryName} ${p.description || ''}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [products, query, brandId, categoryId, brandById, categoryById])

  const hasActiveFilters = query || brandId || categoryId

  return (
    <>
      <header className="catalog-header">
        <div className="catalog-header__top">
          <div className="catalog-header__brand">
            <div className="catalog-header__mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="#F7F3EC" strokeWidth="1.8">
                <path d="M16 7.5a4 4 0 1 0-4 4 4 4 0 1 1-4 4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="catalog-header__title">Salon Product Catalog</h1>
              <p className="catalog-header__subtitle">Professional Hair Care Wholesale Catalog</p>
            </div>
          </div>
          <div className="catalog-header__actions">
            <OfflineIndicator />
            <button className="icon-btn" onClick={onOpenAdmin} aria-label="Open admin settings">
              <SettingsIcon />
            </button>
          </div>
        </div>

        <div className="swatch-strip" aria-hidden="true">
          {['var(--swatch-2)', 'var(--swatch-7)', 'var(--swatch-1)', 'var(--swatch-5)', 'var(--swatch-6)', 'var(--swatch-4)'].map(
            (c, i) => (
              <span key={i} style={{ background: c }} />
            )
          )}
        </div>

        <div className="search-bar">
          <SearchIcon />
          <input
            type="text"
            inputMode="search"
            placeholder="Search product, brand or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <select value={brandId} onChange={(e) => setBrandId(e.target.value)} aria-label="Filter by brand">
            <option value="">All Brands</option>
            {(brands || []).map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {(categories || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              className="clear-filters"
              onClick={() => {
                setQuery('')
                setBrandId('')
                setCategoryId('')
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </header>

      <main className="catalog-main">
        <p className="results-meta">
          {filtered.length} product{filtered.length === 1 ? '' : 's'}
        </p>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try a different search term or clear your filters.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                brandName={brandById[p.brandId]}
                categoryName={categoryById[p.categoryId]}
                onOpen={setSelected}
              />
            ))}
          </div>
        )}
      </main>

      {selected && (
        <ProductDetailModal
          product={selected}
          brandName={brandById[selected.brandId]}
          categoryName={categoryById[selected.categoryId]}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
