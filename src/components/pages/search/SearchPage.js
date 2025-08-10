import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import ProductItem from '../../shared/ProductItem';
import api, { endpoints } from '../../../configs/Apis';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const query = searchParams.get('q') || '';

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, currentPage]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`${endpoints.search}?q=${encodeURIComponent(query)}&page=${currentPage}`);
      
      if (response.data.success) {
        setProducts(response.data.data.products);
        setTotalPages(response.data.data.pagination.totalPages);
        setTotalResults(response.data.data.pagination.totalItems);
      } else {
        setError('Không thể tìm kiếm sản phẩm');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setCurrentPage(1);
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const renderPagination = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Button
          key={number}
          variant={number === currentPage ? 'primary' : 'outline-primary'}
          className="mx-1"
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Button>
      );
    }
    return items;
  };

  return (
    <Container className="py-4">
      {/* Search Form */}
      <Row className="mb-4">
        <Col md={8} className="mx-auto">
          <Form onSubmit={handleSearch}>
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="me-2"
              />
              <Button type="submit" variant="primary">
                Tìm kiếm
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      {/* Search Results */}
      {query && (
        <div className="mb-4">
          <h4>
            Kết quả tìm kiếm cho "{query}"
            {totalResults > 0 && (
              <span className="text-muted ms-2">
                ({totalResults} sản phẩm)
              </span>
            )}
          </h4>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* No Results */}
      {!loading && !error && query && products.length === 0 && (
        <Alert variant="info" className="text-center">
          <h5>Không tìm thấy sản phẩm nào</h5>
          <p>Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả.</p>
        </Alert>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <>
          <Row xs={1} md={2} lg={3} xl={4} className="g-4 mb-4">
            {products.map((product) => (
              <Col key={product._id}>
                <ProductItem product={product} />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center">
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-primary"
                  className="mx-1"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                
                {renderPagination()}
                
                <Button
                  variant="outline-primary"
                  className="mx-1"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Initial State */}
      {!query && !loading && (
        <div className="text-center py-5">
          <h4>Nhập từ khóa để tìm kiếm sản phẩm</h4>
          <p className="text-muted">
            Tìm kiếm theo tên sản phẩm, mô tả hoặc danh mục
          </p>
        </div>
      )}
    </Container>
  );
};

export default SearchPage;
