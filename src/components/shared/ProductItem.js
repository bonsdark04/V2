import React, { useContext } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { MyCartContext } from '../../configs/Contexts';
import { useNavigate } from 'react-router-dom';

const ProductItem = ({ product }) => {
  const [cartCounter, cartDispatch] = useContext(MyCartContext);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = () => {
    cartDispatch({
      type: 'add',
      payload: {
        id: product._id,
        name: product.title,
        price: product.priceNew,
        image: product.thumbnail,
        quantity: 1
      }
    });
  };

  const handleViewDetail = () => {
    navigate(`/products/${product.slug}`);
  };

  return (
    <Card className="h-100 product-item">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={product.thumbnail} 
          alt={product.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        {product.discountPercentage > 0 && (
          <Badge 
            bg="danger" 
            className="position-absolute top-0 end-0 m-2"
          >
            -{product.discountPercentage}%
          </Badge>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-truncate">{product.title}</Card.Title>
        <div className="mb-2">
          {product.priceNew !== product.price && (
            <span className="text-decoration-line-through text-muted me-2">
              {formatPrice(product.price)}
            </span>
          )}
          <span className="fw-bold text-danger">
            {formatPrice(product.priceNew)}
          </span>
        </div>
        <div className="mt-auto">
          <div className="d-grid gap-2">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={handleViewDetail}
            >
              Xem chi tiết
            </Button>
            <Button 
              variant="success" 
              size="sm"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductItem;
