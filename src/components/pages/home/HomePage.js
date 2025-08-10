import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import ProductItem from '../../shared/ProductItem';
import api, { endpoints } from '../../../configs/Apis';

const HomePage = () => {
  const [productsFeatured, setProductsFeatured] = useState([]);
  const [productsNew, setProductsNew] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response = await api.get(endpoints.home);
        
        if (response.data.success) {
          setProductsFeatured(response.data.data.productsFeatured);
          setProductsNew(response.data.data.productsNew);
        } else {
          setError('Không thể tải dữ liệu trang chủ');
        }
      } catch (err) {
        setError('Lỗi kết nối server');
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Featured Products Section */}
      <section className="mb-5">
        <h2 className="mb-4">Sản phẩm nổi bật</h2>
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {productsFeatured.map((product) => (
            <Col key={product._id}>
              <ProductItem product={product} />
            </Col>
          ))}
        </Row>
      </section>

      {/* New Products Section */}
      <section className="mb-5">
        <h2 className="mb-4">Sản phẩm mới</h2>
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {productsNew.map((product) => (
            <Col key={product._id}>
              <ProductItem product={product} />
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  );
};

export default HomePage;
