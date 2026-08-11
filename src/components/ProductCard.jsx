import { useObjectUrl } from '../hooks/useObjectUrl'
import { swatchForId } from '../utils/swatch'
import { ImageOffIcon } from './Icons'

export default function ProductCard({ product, brandName, categoryName, onOpen }) {
  const imageUrl = useObjectUrl(product.image)

  return (
    <button className="product-card" onClick={() => onOpen(product)}>
      <div className="product-card__ribbon" style={{ background: swatchForId(product.categoryId) }} />
      <div className="product-card__image">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} loading="lazy" />
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
            <ImageOffIcon width={28} height={28} />
          </div>
        )}
      </div>
      <div className="product-card__body">
        {brandName && <span className="product-card__brand">{brandName}</span>}
        <h3 className="product-card__name">{product.name}</h3>
        {categoryName && <span className="product-card__category">{categoryName}</span>}
        {product.description && <p className="product-card__desc">{product.description}</p>}
      </div>
    </button>
  )
}
