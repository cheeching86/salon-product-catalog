import { db, clearAllData } from './db'
import { blobToBase64, base64ToBlob } from '../utils/image'

const BACKUP_FORMAT_VERSION = 1

/**
 * Exports the entire catalog (brands, categories, products, descriptions
 * and images) into a single portable JSON file. Images are embedded as
 * base64 data URLs so the backup is one self-contained file — nothing
 * ever leaves the device, this only builds a Blob for the user to save.
 */
export async function exportBackup() {
  const [brands, categories, products] = await Promise.all([
    db.brands.toArray(),
    db.categories.toArray(),
    db.products.toArray()
  ])

  const productsWithImages = await Promise.all(
    products.map(async (p) => {
      let imageBase64 = null
      let imageType = null
      if (p.image) {
        imageBase64 = await blobToBase64(p.image)
        imageType = p.image.type || 'image/jpeg'
      }
      return {
        id: p.id,
        name: p.name,
        brandId: p.brandId,
        categoryId: p.categoryId,
        description: p.description,
        imageBase64,
        imageType,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }
    })
  )

  const backup = {
    app: 'salon-product-catalog',
    formatVersion: BACKUP_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    brands,
    categories,
    products: productsWithImages
  }

  const json = JSON.stringify(backup, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  return blob
}

export function downloadBackupFile(blob, filename = 'SalonCatalogBackup.json') {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Revoke on next tick so the download has time to start.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Restores a catalog from a previously exported backup JSON file.
 * mode: 'replace' clears existing data first, 'merge' adds/overwrites by id.
 */
export async function importBackup(file, { mode = 'replace' } = {}) {
  const text = await file.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('This file is not a valid Salon Catalog backup (invalid JSON).')
  }

  if (!data || !Array.isArray(data.brands) || !Array.isArray(data.categories) || !Array.isArray(data.products)) {
    throw new Error('This file is not a valid Salon Catalog backup.')
  }

  const products = await Promise.all(
    data.products.map(async (p) => ({
      id: p.id,
      name: p.name,
      brandId: p.brandId,
      categoryId: p.categoryId,
      description: p.description || '',
      image: p.imageBase64 ? await base64ToBlob(p.imageBase64) : null,
      createdAt: p.createdAt || new Date().toISOString(),
      updatedAt: p.updatedAt || new Date().toISOString()
    }))
  )

  if (mode === 'replace') {
    await clearAllData()
  }

  await db.transaction('rw', db.brands, db.categories, db.products, async () => {
    await db.brands.bulkPut(data.brands)
    await db.categories.bulkPut(data.categories)
    await db.products.bulkPut(products)
  })

  return {
    brands: data.brands.length,
    categories: data.categories.length,
    products: products.length
  }
}
