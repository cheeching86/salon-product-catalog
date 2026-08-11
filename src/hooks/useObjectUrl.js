import { useEffect, useState } from 'react'

/** Turns a Blob stored in IndexedDB into a URL an <img> can render,
 *  and revokes it on cleanup so tablet memory doesn't creep up over
 *  a long day of browsing the catalog. */
export function useObjectUrl(blob) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    if (!blob) {
      setUrl(null)
      return
    }
    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [blob])

  return url
}
