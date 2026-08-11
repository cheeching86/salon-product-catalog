import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, deleteProduct } from '../../db/db'
import ProductForm from './ProductForm'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useObjectUrl } from '../../hooks/useObjectUrl'
import { PlusIcon, EditIcon, TrashIcon, ImageOffIcon } from '../../components/Icons'

function Thumb({ image }) {
  const url = useObjectUrl(image)
  return (
    <div className="thumb">
      {url ? <img src={url} alt="" /> : <ImageOffIcon width={16} height={16} style={{ margin: 14, color: 'var(--color-ink-faint)' }} />}
    </div>
  )
}

export default function ProductsAdmin() {
  const products = useLiveQuery(() => db.products.orderBy('updatedAt').reverse().toArray(), [], [])
  const brands = useLiveQuery(() => db.brands.toArray(), [], [])
  const categories = useLiveQuery(() => db.categories.toArray(), [], [])

  const brandById = useMemo(() => Object.fromEntries((brands || []).map((b) => [b.id, b.name])), [brands])
  const categoryById = useMemo(
    () => Object.fromEntries((categories || []).map((c) => [c.id, c.name])),
    [categories]
  )

  const [formTarget, setFormTarget] = useState(null) // null | 'new' | product
  const [pendingDelete, setPendingDelete] = useState(null)

  async function handleDelete() {
    await deleteProduct(pendingDelete.id)
    setPendingDelete(null)
  }

  if (formTarget) {
    return (
      <ProductForm
        product={formTarget === 'new' ? null : formTarget}
        onDone={() => setFormTarget(null)}
        onCancel={() => setFormTarget(null)}
      />
    )
  }

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h2>Products</h2>
          <p className="section-desc">Everything shown in the customer catalog.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setFormTarget('new')}>
          <PlusIcon width={16} height={16} />
          Add Product
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(products || []).length === 0 && (
            <tr>
              <td className="empty-row" colSpan={5}>
                No products yet. Add your first product to get started.
              </td>
            </tr>
          )}
          {(products || []).map((p) => (
            <tr key={p.id}>
              <td>
                <Thumb image={p.image} />
              </td>
              <td>{p.name}</td>
              <td>{brandById[p.brandId] || '—'}</td>
              <td>{categoryById[p.categoryId] || '—'}</td>
              <td>
                <div className="row-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => setFormTarget(p)}>
                    <EditIcon width={15} height={15} />
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => setPendingDelete(p)}>
                    <TrashIcon width={15} height={15} />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pendingDelete && (
        <ConfirmDialog
          title={`Delete "${pendingDelete.name}"?`}
          message="This permanently removes the product and its photo from this device. This cannot be undone."
          confirmLabel="Delete product"
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
