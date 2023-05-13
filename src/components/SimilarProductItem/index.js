import './index.css'

const SimilarProductItem = props => {
  const {itemDetails} = props
  const {title, imageUrl, brand, price, rating} = itemDetails
  return (
    <li className="similar-product-item">
      <img
        className="similar-product-img"
        src={imageUrl}
        alt={`similar product ${title}`}
      />
      <p className="similar-product-title">{title}</p>
      <p className="similar-product-brand">by {brand}</p>
      <div className="similar-product-price-rating-container">
        <p className="similar-product-price">Rs {price}/-</p>
        <p className="similar-product-rating">
          {rating}
          <img
            className="similar-star-img"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </p>
      </div>
    </li>
  )
}

export default SimilarProductItem
