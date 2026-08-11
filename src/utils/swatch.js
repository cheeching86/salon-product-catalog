// Deterministically assigns one of the curated "shade card" accent colors
// (defined as --swatch-1..8 in tokens.css) to a category id, so each
// category always reads with the same ribbon color across the app.
const SWATCHES = [
  'var(--swatch-1)',
  'var(--swatch-2)',
  'var(--swatch-3)',
  'var(--swatch-4)',
  'var(--swatch-5)',
  'var(--swatch-6)',
  'var(--swatch-7)',
  'var(--swatch-8)'
]

export function swatchForId(id) {
  if (!id) return SWATCHES[0]
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return SWATCHES[hash % SWATCHES.length]
}
