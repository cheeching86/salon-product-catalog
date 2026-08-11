import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, addProduct, updateProduct } from '../../db/db'
import { fileToBlob } from '../../utils/image'
import { useObjectUrl } from '../../hooks/useObjectUrl'
import { ImageOffIcon, UploadIcon, TrashIcon } from '../../components/Icons'

export default function ProductForm({ product, onDone, onCancel }) {
  const isNew = !product
  const brands = useLiveQuery(() => db.brands.orderBy('name').toArray(), [], [])
  const categories = useLiveQuery(() => db.categories.orderBy('name').toArray(), [], [])

  const [name, setName] = useState(product?.name || '')
  const [brandId, setBrandId] = useState(product?.brandId || '')
  const [categoryId, setCategoryId] = useState(product?.categoryId || '')
  const [description, setDescription] = useState(product?.description || '')
  const [image, setImage] = useState(product?.image || null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const previewUrl = useObjectUrl(image)

  async function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const blob = await fileToBlob(file)
      setImage(blob)
    } catch (err) {
      setError(err.message)
    }
    e.target.value = ''
  }

  async function handleSave() {
    if (!name.trim()) {
      setError('Product name is required.')
      return
    }
    setSaving(true)
    try {
      const payload = { name, brandId: brandId || null, categoryId: categoryId || null, description, image }
      if (isNew) {
        await addProduct(payload)
      } else {
        await updateProduct(product.id, payload)
      }
      onDone()
    } catch (err) {
      setError(err.message || 'Something went wrong saving this product.')
      setSaving(false)
    }
  }

  return (
    <div>
      <h2>{isNew ? 'Add Product' : 'Edit Product'}</h2>
      <p className="section-desc">
        {isNew ? 'Add a new product to the catalog.' : 'Update this product\u2019s details or photo.'}
      </p>

      <div className="form-grid">
        <div className="form-field">
          <label>Product Image</label>
          <div className="image-uploader">
            <div className="image-uploader__preview">
              {previewUrl ? <img src={previewUrl} alt="Product preview" /> : <ImageOffIcon width={26} height={26} />}
            </div>
            <div className="image-uploader__buttons">
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                <UploadIcon width={15} height={15} />
                {image ? 'Replace image' : 'Upload image'}
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </label>
              {image && (
                <button className="btn btn-ghost btn-sm" onClick={() => setImage(null)}>
                  <TrashIcon width={15} height={15} />
                  Remove image
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="form-field">
          <label>Product Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Majirel Permanent Color Cream" />
        </div>

        <div className="form-field">
          <label>Brand</label>
          <select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
            <option value="">No brand</option>
            {(brands || []).map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">No category</option>
            {(categories || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description shown to customers"
          />
        </div>

        {error && <div className="dialog-warning">{error}</div>}

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  )
}
