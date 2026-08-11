import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, addCategory, updateCategory, deleteCategory } from '../../db/db'
import NameDialog from '../../components/NameDialog'
import ConfirmDialog from '../../components/ConfirmDialog'
import { PlusIcon, EditIcon, TrashIcon } from '../../components/Icons'

export default function CategoriesAdmin() {
  const categories = useLiveQuery(() => db.categories.orderBy('name').toArray(), [], [])
  const productCounts = useLiveQuery(async () => {
    const list = await db.products.toArray()
    const counts = {}
    for (const p of list) counts[p.categoryId] = (counts[p.categoryId] || 0) + 1
    return counts
  }, [], {})

  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  async function handleSave(name) {
    if (editing === 'new') {
      await addCategory(name)
    } else {
      await updateCategory(editing.id, name)
    }
    setEditing(null)
  }

  async function handleDelete() {
    await deleteCategory(pendingDelete.id)
    setPendingDelete(null)
  }

  const deleteCount = pendingDelete ? productCounts[pendingDelete.id] || 0 : 0

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h2>Categories</h2>
          <p className="section-desc">Product groupings shown to customers as filters.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setEditing('new')}>
          <PlusIcon width={16} height={16} />
          Add Category
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
          {(categories || []).length === 0 && (
            <tr>
              <td className="empty-row" colSpan={3}>
                No categories yet. Add your first category to get started.
              </td>
            </tr>
          )}
          {(categories || []).map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>
                <span className="tag-count">{productCounts[c.id] || 0}</span>
              </td>
              <td>
                <div className="row-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditing(c)}>
                    <EditIcon width={15} height={15} />
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => setPendingDelete(c)}>
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
          title={editing === 'new' ? 'Add Category' : 'Edit Category'}
          label="Category name"
          initialValue={editing === 'new' ? '' : editing.name}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={`Delete "${pendingDelete.name}"?`}
          message="This removes the category from your catalog. This cannot be undone."
          warning={
            deleteCount > 0
              ? `${deleteCount} product${deleteCount === 1 ? ' is' : 's are'} currently assigned to this category. Those products will remain, but will show no category until you reassign them.`
              : null
          }
          confirmLabel="Delete category"
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
