import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Alert, Spinner, Button, Badge, Form, Image } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { MyCartContext } from '../../../configs/Contexts';
import api, { endpoints } from '../../../configs/Apis';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [cartCounter, cartDispatch] = useContext(MyCartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`${endpoints['product-detail']}/${slug}`);
        
        if (response.data.success) {
          setProduct(response.data.data);
        } else {
          setError('Không tìm thấy sản phẩm');
        }
      } catch (err) {
        setError('Lỗi kết nối server');
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductDetail();
    }
  }, [slug]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product) return;

    cartDispatch({
      type: 'add',
      payload: {
        id: product._id,
        name: product.title,
        price: product.priceNew,
        image: product.thumbnail,
        quantity: parseInt(quantity)
      }
    });

    // Show success message or redirect to cart
    navigate('/cart');
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Không tìm thấy sản phẩm'}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        {/* Product Images */}
        <Col md={6}>
          <div className="mb-3">
            <Image
              src={product.images && product.images[selectedImage] ? product.images[selectedImage] : product.thumbnail}
              alt={product.title}
              fluid
              className="w-100"
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </div>
          
          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <Row className="g-2">
              {product.images.map((image, index) => (
                <Col key={index} xs={3}>
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fluid
                    className={`cursor-pointer ${selectedImage === index ? 'border border-primary' : ''}`}
                    style={{ height: '80px', objectFit: 'cover' }}
                    onClick={() => setSelectedImage(index)}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Col>

        {/* Product Info */}
        <Col md={6}>
          <h1 className="mb-3">{product.title}</h1>
          
          {/* Price */}
          <div className="mb-3">
            {product.priceNew !== product.price && (
              <span className="text-decoration-line-through text-muted me-2 fs-5">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="fw-bold text-danger fs-4">
              {formatPrice(product.priceNew)}
            </span>
            {product.discountPercentage > 0 && (
              <Badge bg="danger" className="ms-2">
                -{product.discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-3">
              <h5>Mô tả</h5>
              <p className="text-muted">{product.description}</p>
            </div>
          )}

          {/* Category */}
          {product.category && (
            <div className="mb-3">
              <h5>Danh mục</h5>
              <Badge bg="secondary">{product.category.title}</Badge>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="mb-4">
            <Row className="align-items-center">
              <Col xs={4}>
                <Form.Label>Số lượng:</Form.Label>
              </Col>
              <Col xs={4}>
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </Col>
              <Col xs={4}>
                <Button 
                  variant="success" 
                  size="lg"
                  onClick={handleAddToCart}
                  className="w-100"
                >
                  Thêm vào giỏ
                </Button>
              </Col>
            </Row>
          </div>

          {/* Additional Info */}
          <div className="border-top pt-3">
            <h5>Thông tin sản phẩm</h5>
            <ul className="list-unstyled">
              <li><strong>Mã sản phẩm:</strong> {product._id}</li>
              <li><strong>Trạng thái:</strong> 
                <Badge bg={product.status === 'active' ? 'success' : 'secondary'} className="ms-2">
                  {product.status === 'active' ? 'Còn hàng' : 'Hết hàng'}
                </Badge>
              </li>
              {product.position && (
                <li><strong>Vị trí:</strong> {product.position}</li>
              )}
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailPage;
