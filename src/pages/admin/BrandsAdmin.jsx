import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, addBrand, updateBrand, deleteBrand, countProductsForBrand } from '../../db/db'
import NameDialog from '../../components/NameDialog'
import ConfirmDialog from '../../components/ConfirmDialog'
import { PlusIcon, EditIcon, TrashIcon } from '../../components/Icons'

export default function BrandsAdmin() {
  const brands = useLiveQuery(() => db.brands.orderBy('name').toArray(), [], [])
  const productCounts = useLiveQuery(async () => {
    const list = await db.products.toArray()
    const counts = {}
    for (const p of list) counts[p.brandId] = (counts[p.brandId] || 0) + 1
    return counts
  }, [], {})

  const [editing, setEditing] = useState(null) // { id, name } or 'new'
  const [pendingDelete, setPendingDelete] = useState(null) // brand object

  async function handleSave(name) {
    if (editing === 'new') {
      await addBrand(name)
    } else {
      await updateBrand(editing.id, name)
    }
    setEditing(null)
  }

  async function handleDelete() {
    await deleteBrand(pendingDelete.id)
    setPendingDelete(null)
  }

  const deleteCount = pendingDelete ? productCounts[pendingDelete.id] || 0 : 0

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h2>Brands</h2>
          <p className="section-desc">The wholesale brands carried in this catalog.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setEditing('new')}>
          <PlusIcon width={16} height={16} />
          Add Brand
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Products</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(brands || []).length === 0 && (
            <tr>
              <td className="empty-row" colSpan={3}>
                No brands yet. Add your first brand to get started.
              </td>
            </tr>
          )}
          {(brands || []).map((b) => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>
                <span className="tag-count">{productCounts[b.id] || 0}</span>
              </td>
              <td>
                <div className="row-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditing(b)}>
                    <EditIcon width={15} height={15} />
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => setPendingDelete(b)}>
                    <TrashIcon width={15} height={15} />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <NameDialog
          title={editing === 'new' ? 'Add Brand' : 'Edit Brand'}
          label="Brand name"
          initialValue={editing === 'new' ? '' : editing.name}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={`Delete "${pendingDelete.name}"?`}
          message="This removes the brand from your catalog. This cannot be undone."
          warning={
            deleteCount > 0
              ? `${deleteCount} product${deleteCount === 1 ? ' is' : 's are'} currently assigned to this brand. Those products will remain, but will show no brand until you reassign them.`
              : null
          }
          confirmLabel="Delete brand"
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
