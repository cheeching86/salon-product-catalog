import Dexie from 'dexie'
import { generateId } from '../utils/id'
import { placeholderImageBlob } from '../utils/image'

// A single local database. Everything lives on this device only —
// nothing here is ever sent to a server.
export const db = new Dexie('SalonCatalogDB')

db.version(1).stores({
  // '&id' = unique primary key we generate ourselves (not auto-increment)
  // so that ids are stable across export/import round-trips.
  brands: '&id, name, createdAt, updatedAt',
  categories: '&id, name, createdAt, updatedAt',
  products: '&id, name, brandId, categoryId, createdAt, updatedAt'
})

/**
 * Seeds the database with starter brands, categories and a handful of
 * sample products — but ONLY the very first time the app runs on this
 * device. Never re-seeds an existing (even emptied-by-user) database.
 */
export async function seedIfEmpty() {
  const seeded = await db.table('brands').count()
  if (seeded > 0) return

  const now = new Date().toISOString()

  const brandNames = ["L'Oréal", 'Schwarzkopf', 'Wella', 'Goldwell']
  const categoryNames = [
    'Hair Color',
    'Shampoo',
    'Conditioner',
    'Treatment',
    'Styling',
    'Hair Care',
    'Salon Accessories'
  ]

  const brands = brandNames.map((name) => ({
    id: generateId(),
    name,
    createdAt: now,
    updatedAt: now
  }))

  const categories = categoryNames.map((name) => ({
    id: generateId(),
    name,
    createdAt: now,
    updatedAt: now
  }))

  const byBrand = Object.fromEntries(brands.map((b) => [b.name, b.id]))
  const byCategory = Object.fromEntries(categories.map((c) => [c.name, c.id]))

  const sampleProducts = [
    {
      name: 'Majirel Permanent Color Cream',
      brand: "L'Oréal",
      category: 'Hair Color',
      description:
        'Ammonia-based permanent cream color delivering rich, even coverage and long-lasting radiance across the full shade range.'
    },
    {
      name: 'Absolut Repair Gold Quinoa Shampoo',
      brand: "L'Oréal",
      category: 'Shampoo',
      description:
        'Fortifying shampoo for very damaged hair, blended with gold quinoa and wheat protein to rebuild strength and shine.'
    },
    {
      name: 'BC Bonacure Repair Rescue Conditioner',
      brand: 'Schwarzkopf',
      category: 'Conditioner',
      description:
        'Deep-conditioning treatment with keratin and Q10 that smooths the hair surface and restores flexibility after chemical services.'
    },
    {
      name: 'BlondMe Premium Lightener',
      brand: 'Schwarzkopf',
      category: 'Hair Color',
      description:
        'Dust-reduced bleaching powder engineered for clean, controlled lift with minimal breakage on fine or fragile hair.'
    },
    {
      name: 'Koleston Perfect Permanent Color',
      brand: 'Wella',
      category: 'Hair Color',
      description:
        'Professional permanent color with Pure Balance Technology for vivid, true-to-swatch results and healthy-looking hair.'
    },
    {
      name: 'Fusion Intense Repair Mask',
      brand: 'Wella',
      category: 'Treatment',
      description:
        'Intensive repair mask that reconstructs the inner hair structure, ideal as a weekly in-salon treatment for chemically treated hair.'
    },
    {
      name: 'Topchic Permanent Hair Color',
      brand: 'Goldwell',
      category: 'Hair Color',
      description:
        'High-performance permanent color offering brilliant shine, precise gray coverage and a pleasant low-ammonia formula.'
    },
    {
      name: 'Dualsenses Curl Definer Cream',
      brand: 'Goldwell',
      category: 'Styling',
      description:
        'Lightweight curl cream that defines and tames curls without weigh-down, protecting against humidity and frizz.'
    },
    {
      name: 'Everyday Nourishing Hair Oil',
      brand: "L'Oréal",
      category: 'Hair Care',
      description:
        'Multi-purpose finishing oil that adds gloss and softness while taming flyaways — safe for daily use on all hair types.'
    },
    {
      name: 'Sectioning Clip Set (12 pcs)',
      brand: 'Wella',
      category: 'Salon Accessories',
      description:
        'Durable crocodile-style sectioning clips for color application and cutting — a back-bar essential for every station.'
    }
  ]

  const products = sampleProducts.map((p) => ({
    id: generateId(),
    name: p.name,
    brandId: byBrand[p.brand],
    categoryId: byCategory[p.category],
    description: p.description,
    image: placeholderImageBlob(p.name),
    createdAt: now,
    updatedAt: now
  }))

  await db.transaction('rw', db.brands, db.categories, db.products, async () => {
    await db.brands.bulkAdd(brands)
    await db.categories.bulkAdd(categories)
    await db.products.bulkAdd(products)
  })
}

// ---------- Brands ----------
export async function addBrand(name) {
  const now = new Date().toISOString()
  const brand = { id: generateId(), name: name.trim(), createdAt: now, updatedAt: now }
  await db.brands.add(brand)
  return brand
}

export async function updateBrand(id, name) {
  await db.brands.update(id, { name: name.trim(), updatedAt: new Date().toISOString() })
}

export async function deleteBrand(id) {
  await db.brands.delete(id)
}

export async function countProductsForBrand(id) {
  return db.products.where('brandId').equals(id).count()
}

// ---------- Categories ----------
export async function addCategory(name) {
  const now = new Date().toISOString()
  const category = { id: generateId(), name: name.trim(), createdAt: now, updatedAt: now }
  await db.categories.add(category)
  return category
}

export async function updateCategory(id, name) {
  await db.categories.update(id, { name: name.trim(), updatedAt: new Date().toISOString() })
}

export async function deleteCategory(id) {
  await db.categories.delete(id)
}

export async function countProductsForCategory(id) {
  return db.products.where('categoryId').equals(id).count()
}

// ---------- Products ----------
export async function addProduct({ name, brandId, categoryId, description, image }) {
  const now = new Date().toISOString()
  const product = {
    id: generateId(),
    name: name.trim(),
    brandId,
    categoryId,
    description: (description || '').trim(),
    image: image || null,
    createdAt: now,
    updatedAt: now
  }
  await db.products.add(product)
  return product
}

export async function updateProduct(id, changes) {
  await db.products.update(id, { ...changes, updatedAt: new Date().toISOString() })
}

export async function deleteProduct(id) {
  await db.products.delete(id)
}

// ---------- Danger zone (used only by Backup & Restore) ----------
export async function clearAllData() {
  await db.transaction('rw', db.brands, db.categories, db.products, async () => {
    await db.brands.clear()
    await db.categories.clear()
    await db.products.clear()
  })
}
