import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import bgImage from "../assets/background.png";

function Layout({ children }) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm sticky-top">
        <Container>
          <Navbar.Brand href="/home">BooTunes 🎵📖</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/home" className={({ isActive }) => (isActive ? "fw-bold text-white" : "")}>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/reader" className={({ isActive }) => (isActive ? "fw-bold text-white" : "")}>
              Reader
            </Nav.Link>
            <Nav.Link as={NavLink} to="/settings" className={({ isActive }) => (isActive ? "fw-bold text-white" : "")}>
              Settings
            </Nav.Link>
          </Nav>
          <div className="d-flex align-items-center gap-2">
            {username && <span className="text-white">👋 {username}</span>}
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Container>
      </Navbar>

      <Container className="mt-4 mb-4">{children}</Container>
    </div>
  );
}

export default Layout;
