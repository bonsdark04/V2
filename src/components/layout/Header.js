import React, { useContext, useState } from 'react';
import { Navbar, Nav, Container, Form, Button, Badge, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { MyCartContext, MyUserContext } from '../../configs/Contexts';
import cookie from 'react-cookies';

const Header = () => {
  const navigate = useNavigate();
  const [cartCounter, cartDispatch] = useContext(MyCartContext);
  const [user, dispatch] = useContext(MyUserContext);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    cookie.remove('tokenUser', { path: '/' });
    dispatch({ type: 'logout' });
    cartDispatch({ type: 'clear' });
    navigate('/');
  };

  const cartItemCount = cartCounter.reduce((total, item) => total + item.quantity, 0);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">
          SaleWeb
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
            <Nav.Link as={Link} to="/products">Sản phẩm</Nav.Link>
          </Nav>

          <Form className="d-flex me-3" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="me-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-light" type="submit">
              Tìm
            </Button>
          </Form>

          <Nav>
            <Nav.Link as={Link} to="/cart" className="position-relative">
              <i className="bi bi-cart3"></i> Giỏ hàng
              {cartItemCount > 0 && (
                <Badge 
                  bg="danger" 
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.7rem' }}
                >
                  {cartItemCount}
                </Badge>
              )}
            </Nav.Link>

            {user ? (
              <NavDropdown title={user.fullName} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/user/profile">
                  Thông tin cá nhân
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/user/orders">
                  Đơn hàng của tôi
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Đăng nhập</Nav.Link>
                <Nav.Link as={Link} to="/register">Đăng ký</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
