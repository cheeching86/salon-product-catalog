// Image helpers. Product photos are stored as Blobs directly inside
// IndexedDB (via Dexie) — never as remote URLs, never in localStorage.

/** Read a File input into a Blob (kept as a Blob, not base64, for compact storage). */
export function fileToBlob(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'))
    if (!file.type.startsWith('image/')) return reject(new Error('File is not an image'))
    // File already IS a Blob, but we re-wrap with an explicit type so
    // downstream <img> object URLs always resolve to a proper MIME type.
    resolve(file.slice(0, file.size, file.type))
  })
}

/** Convert a Blob to a base64 data URL string, used only for JSON backup export. */
export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/** Convert a base64 data URL string back into a Blob, used on backup import. */
export async function base64ToBlob(dataUrl) {
  const res = await fetch(dataUrl)
  return await res.blob()
}

/** Build a tiny in-memory placeholder image (SVG-based) for sample/demo products
 *  that ship with no real photo yet — fully local, no network fetch involved. */
export function placeholderImageBlob(label, accent = '#2F4538') {
  const initials = (label || 'P')
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${accent}"/>
          <stop offset="1" stop-color="#241C17"/>
        </linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(#g)"/>
      <circle cx="300" cy="300" r="140" fill="none" stroke="#C9A227" stroke-width="3" opacity="0.6"/>
      <text x="300" y="325" font-family="Georgia, 'Times New Roman', serif" font-size="150"
            fill="#FAF6F1" text-anchor="middle">${initials}</text>
    </svg>`

  return new Blob([svg], { type: 'image/svg+xml' })
}
