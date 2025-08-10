import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Form, Pagination } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import ProductItem from '../../shared/ProductItem';
import api, { endpoints } from '../../../configs/Apis';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    setSelectedCategory(category);
    setCurrentPage(page);
  }, [category, page]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `${endpoints.products}?page=${currentPage}`;
        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }

        const response = await api.get(url);
        
        if (response.data.success) {
          setProducts(response.data.data.products);
          setTotalPages(response.data.data.pagination.totalPages);
        } else {
          setError('Không thể tải danh sách sản phẩm');
        }
      } catch (err) {
        setError('Lỗi kết nối server');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get(endpoints['product-categories']);
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
    fetchProducts();
  }, [currentPage, selectedCategory]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    setCurrentPage(1);
    
    const newSearchParams = new URLSearchParams(searchParams);
    if (newCategory) {
      newSearchParams.set('category', newCategory);
    } else {
      newSearchParams.delete('category');
    }
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', pageNumber.toString());
    setSearchParams(newSearchParams);
  };

  const renderPagination = () => {
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
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

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        {/* Filter Sidebar */}
        <Col md={3}>
          <div className="mb-4">
            <h5>Danh mục sản phẩm</h5>
            <Form.Select 
              value={selectedCategory} 
              onChange={handleCategoryChange}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.title}
                </option>
              ))}
            </Form.Select>
          </div>
        </Col>

        {/* Products Grid */}
        <Col md={9}>
          <h2 className="mb-4">
            Sản phẩm
            {selectedCategory && (
              <span className="text-muted"> - {categories.find(c => c.slug === selectedCategory)?.title}</span>
            )}
          </h2>

          {products.length === 0 ? (
            <Alert variant="info">Không có sản phẩm nào trong danh mục này.</Alert>
          ) : (
            <>
              <Row xs={1} md={2} lg={3} className="g-4 mb-4">
                {products.map((product) => (
                  <Col key={product._id}>
                    <ProductItem product={product} />
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center">
                  <Pagination>
                    <Pagination.First 
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {renderPagination()}
                    <Pagination.Next 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last 
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductsPage;
