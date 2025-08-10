import React, { useContext, useState } from 'react';
import { Container, Row, Col, Table, Button, Form, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MyCartContext } from '../../../configs/Contexts';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartCounter, cartDispatch] = useContext(MyCartContext);
  const [loading, setLoading] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      cartDispatch({
        type: 'update',
        payload: { id: productId, quantity: newQuantity }
      });
    }
  };

  const handleRemoveItem = (productId) => {
    cartDispatch({
      type: 'delete',
      payload: { id: productId }
    });
  };

  const handleCheckout = () => {
    if (cartCounter.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }
    navigate('/checkout');
  };

  const calculateSubtotal = () => {
    return cartCounter.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  if (cartCounter.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="info" className="text-center">
          <h4>Giỏ hàng trống</h4>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Tiếp tục mua sắm
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Giỏ hàng</h2>
      
      <Row>
        <Col lg={8}>
          <Table responsive>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartCounter.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        className="me-3"
                      />
                      <div>
                        <h6 className="mb-0">{item.name}</h6>
                      </div>
                    </div>
                  </td>
                  <td>{formatPrice(item.price)}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        style={{ width: '70px', textAlign: 'center' }}
                        className="mx-2"
                      />
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td>{formatPrice(item.price * item.quantity)}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        <Col lg={4}>
          <div className="border rounded p-3">
            <h5 className="mb-3">Tổng đơn hàng</h5>
            
            <div className="d-flex justify-content-between mb-2">
              <span>Tạm tính:</span>
              <span>{formatPrice(calculateSubtotal())}</span>
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            
            <hr />
            
            <div className="d-flex justify-content-between mb-3">
              <strong>Tổng cộng:</strong>
              <strong className="text-danger fs-5">{formatPrice(calculateTotal())}</strong>
            </div>
            
            <Button
              variant="success"
              size="lg"
              className="w-100"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
            </Button>
            
            <Button
              variant="outline-primary"
              className="w-100 mt-2"
              onClick={() => navigate('/')}
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
