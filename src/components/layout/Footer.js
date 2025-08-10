import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5>SaleWeb</h5>
            <p className="text-muted">
              Cửa hàng trực tuyến uy tín với nhiều sản phẩm chất lượng cao.
            </p>
          </Col>
          <Col md={4}>
            <h5>Liên kết</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-muted text-decoration-none">Trang chủ</a></li>
              <li><a href="/products" className="text-muted text-decoration-none">Sản phẩm</a></li>
              <li><a href="/about" className="text-muted text-decoration-none">Về chúng tôi</a></li>
              <li><a href="/contact" className="text-muted text-decoration-none">Liên hệ</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Liên hệ</h5>
            <p className="text-muted">
              Email: info@saleweb.com<br />
              Điện thoại: 0123 456 789<br />
              Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
            </p>
          </Col>
        </Row>
        <hr className="my-3" />
        <Row>
          <Col className="text-center">
            <p className="text-muted mb-0">
              © 2024 SaleWeb. Tất cả quyền được bảo lưu.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
