import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemData: {},
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  updateSimilarProducts = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    rating: data.rating,
    price: data.price,
    style: data.style,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductItemDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)

    const apiURL = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiURL, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      //   console.log(fetchedData.similar_products)
      const updatedData = {
        availability: fetchedData.availability,
        brand: fetchedData.brand,
        description: fetchedData.description,
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        rating: fetchedData.rating,
        price: fetchedData.price,
        style: fetchedData.style,
        title: fetchedData.title,
        totalReviews: fetchedData.total_reviews,
        similarProducts: fetchedData.similar_products.map(each =>
          this.updateSimilarProducts(each),
        ),
      }
      this.setState({
        productItemData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSimilarProducts = () => {
    const {productItemData} = this.state
    const {similarProducts} = productItemData
    return (
      <div className="similar-products-container">
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-product-list">
          {similarProducts.map(each => (
            <SimilarProductItem key={each.id} itemDetails={each} />
          ))}
        </ul>
      </div>
    )
  }

  onClickPlus = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onClickMinus = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  renderProductItemData = () => {
    const {productItemData, quantity} = this.state
    console.log(productItemData)
    const {
      imageUrl,
      title,
      description,
      price,
      availability,
      brand,
      rating,
      totalReviews,
    } = productItemData

    return (
      <>
        <div className="product-item-container">
          <div className="product-img-container">
            <img className="product-img" src={imageUrl} alt="product" />
          </div>
          <div className="product-details-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="product-rating-container">
              <p className="product-rating">
                {rating}
                <img
                  className="star-img"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </p>
              <p className="product-reviews">{totalReviews} reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="product-availability">
              Available: <p className="span-styles">{availability}</p>
            </p>
            <p className="product-brand">
              Brand: <p className="span-styles">{brand}</p>
            </p>
            <div className="product-quantity-container">
              <button
                className="minus-btn"
                type="button"
                data-testid="minus"
                onClick={this.onClickMinus}
              >
                <BsDashSquare />
              </button>

              <p>{quantity}</p>
              <button
                className="plus-btn"
                type="button"
                data-testid="plus"
                onClick={this.onClickPlus}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="add-cart-btn" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        {this.renderSimilarProducts()}
      </>
    )
  }

  onClickShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view-img"
      />
      <h1 className="failure-view-heading">Product Not Found</h1>
      <button
        className="failure-view-btn"
        type="button"
        onClick={this.onClickShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-spinner" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemData()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductDetails()}
      </>
    )
  }
}

export default ProductItemDetails
