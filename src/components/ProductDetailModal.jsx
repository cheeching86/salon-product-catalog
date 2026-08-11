import { useEffect, useRef } from 'react'
import { useObjectUrl } from '../hooks/useObjectUrl'
import { CloseIcon, ImageOffIcon } from './Icons'

export default function ProductDetailModal({ product, brandName, categoryName, onClose }) {
  const imageUrl = useObjectUrl(product?.image)
  const overlayRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  if (!product) return null

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className="modal-card" role="dialog" aria-modal="true" aria-label={product.name}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>
        <div className="product-detail__image">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-ink-faint)'
              }}
            >
              <ImageOffIcon width={40} height={40} />
            </div>
          )}
        </div>
        <div className="product-detail__body">
          {brandName && <div className="product-detail__brand">{brandName}</div>}
          <h2 className="product-detail__name">{product.name}</h2>
          {categoryName && <span className="product-detail__category">{categoryName}</span>}
          {product.description && <p className="product-detail__desc">{product.description}</p>}
          <button className="back-btn" onClick={onClose}>
            ← Back to catalog
          </button>
        </div>
      </div>
    </div>
  )
}
