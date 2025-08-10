import { useContext, useEffect, useState } from "react";
import { Alert, Badge, Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import Apis, { endpoints } from "../../configs/Apis";
import { Link } from "react-router-dom";
import { MyCartContext, MyUserContext } from "../../contexts/Contexts";

const Header = () => {
    const [categories, setCategories] = useState([]);
    const [cartCounter, ] = useContext(MyCartContext);
    const [user, dispatch] = useContext(MyUserContext);

    const loadCates = async () => {
        let res = await Apis.get(endpoints['categories']);
        setCategories(res.data.data.categories);
    }

    useEffect(() => {
        loadCates();
    }, []);

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">E-commerce Website</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Link to="/" className="nav-link">Trang chủ</Link>
                    <NavDropdown title="Danh mục" id="basic-nav-dropdown">
                        {categories.map(c => <Link key={c.id} to={`/?cateId=${c.id}`} className="dropdown-item">{c.name}</Link>)}
                    </NavDropdown>

                    <Link to="/cart" className="nav-link text-success">Giỏ hàng <Badge bg="danger">{cartCounter}</Badge></Link>

                    {user === null?<>
                        <Link to="/register" className="nav-link text-info">Đăng ký</Link>
                        <Link to="/login" className="nav-link text-info">Đăng nhập</Link>
                    </>:<>

                        <Link to="/" className="nav-link text-info">
                            <img src={user.avatar} width={30} className="rounded" />
                            Chào {user.username}!
                        </Link>
                        <Button variant="danger" onClick={() => dispatch({"type": "logout"})}>Đăng xuất</Button>
                    </>}
                    
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;