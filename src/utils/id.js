// Generates a unique id without any external dependency or network call.
// Falls back gracefully if crypto.randomUUID isn't available (older WebViews).
export function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
