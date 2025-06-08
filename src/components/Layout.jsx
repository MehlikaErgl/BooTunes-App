import React, { useState, useEffect } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  Button,
  Row,
  Col
} from "react-bootstrap";
import { FiSun, FiMoon } from "react-icons/fi";
import bgImage from "../assets/background.jpg";
import logo from "../assets/logo.jpg";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const storedTheme = localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState(storedTheme);
  const [showConfirm, setShowConfirm] = useState(false);
  const username = localStorage.getItem("username");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const textColor = theme === "light" ? "text-dark" : "text-light";
  const navVariant = theme === "light" ? "light" : "dark";
  const navBg =
  theme === "light"
    ? "rgba(255,255,255,0.8)"
    : "#111";
    const contentBg =
    theme === "light"
      ? "rgba(255,255,255,0.60)"
      : "rgba(20, 20, 20, 0.65)"; // daha nötr koyu gri/siyah tonu
    
  const contentBlur = theme === "light" ? "blur(16px)" : "blur(6px)";

  const navItems = [
    { label: "Home", to: "/home" },
    { label: "Library", to: "/library" },
    { label: "Playlists", to: "/playlist" },
    { label: "Settings", to: "/settings" }
  ];

  const location = useLocation();
  const isSettingsPage = location.pathname === "/settings";
  const isLibraryPage = location.pathname === "/library";

  return (
    <div
      style={{
        position: "relative",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        width: "100%",
        overflowY: "hidden"
      }}
    >
      {/* Theme overlay */}
      {/* Theme overlay */}
{/* Theme overlay */}
<div
  style={{
    position: "absolute",
    inset: 0,
    background:
      theme === "dark"
        ? "linear-gradient(180deg, rgba(15,15,15,0.7) 0%, rgba(10,10,10,0.9) 100%)"
        : "linear-gradient(180deg, rgba(220,220,220,0.6) 0%, rgba(200,200,200,0.75) 100%)",
    pointerEvents: "none",
    zIndex: 0
  }}
/>



      {/* Navbar */}
      <Navbar
        expand="lg"
        variant={navVariant}
        className="shadow-sm sticky-top"
        style={{ backdropFilter: "blur(10px)", backgroundColor: navBg }}
      >
        <Container fluid className="px-4">
          <Navbar.Brand
            as={NavLink}
            to="/home"
            className={`${textColor} fw-bold me-4 d-flex align-items-center`}
          >
            BooTunes
            <img
              src={logo}
              alt="Logo"
              style={{
                height: "36px",
                width: "36px",
                borderRadius: "50%",
                marginRight: "10px",
                objectFit: "cover",
                marginLeft: "10px"
              }}
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="align-items-center me-auto">
              {navItems.map((item) => (
                <Nav.Link
                  key={item.to}
                  as={NavLink}
                  to={item.to}
                  className={({ isActive }) =>
                    `mx-4 ${textColor} ${isActive ? "fw-bold" : ""}`
                  }
                >
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>

          <div className="d-flex align-items-center ms-auto">
            <Button
              variant="link"
              onClick={toggleTheme}
              className={`${textColor} me-3`}
            >
              {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
            </Button>
            {username && <span className={`${textColor} me-3`}>👋 {username}</span>}
            <Button
  style={{
    backgroundColor: theme === "dark" ? "#f0f0f0" : "#444", // lacivert (#001f3f) yerine koyu gri
    color: theme === "dark" ? "#333" : "#fff",               // lacivert yazı (#001f3f) yerine siyaha yakın koyu gri
    border: "none"
  }}
  size="sm"
  onClick={() => setShowConfirm(true)}
>
  Logout
</Button>
          </div>
        </Container>
      </Navbar>

      {/* Content wrapper */}
      <Container
        fluid
        className="py-4"
        style={{ position: "relative", zIndex: 1, paddingTop: "70px" }}
      >
        <Row className="justify-content-center">
          <Col
            xs={12}
            md={12}
            lg={10}
            xl={9}
            style={{
              backgroundColor: contentBg,
              borderRadius: "1rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              maxHeight: "calc(100vh - 98px)",
              overflowY: isSettingsPage || isLibraryPage ? "auto" : "hidden",
              backdropFilter: contentBlur
            }}
          >
            {React.cloneElement(children, { theme })}
          </Col>
        </Row>
      </Container>

      {/* Confirm Logout Modal */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1050,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              backgroundColor: theme === "light" ? "#fff" : "#1c1c1c",
              padding: "2rem",
              borderRadius: "1rem",
              width: "90%",
              maxWidth: "400px",
              textAlign: "center",
              color: theme === "light" ? "#000" : "#f0f0f0",
              boxShadow: "0 0 20px rgba(0,0,0,0.3)",
              backdropFilter: "blur(10px)"
            }}
          >
            <h5>Are you sure you want to logout?</h5>
            <div className="d-flex justify-content-center mt-4">
              <Button
                variant="danger"
                className="me-3"
                onClick={handleLogout}
              >
                Yes, Logout
              </Button>
              <Button
                variant={theme === "light" ? "secondary" : "light"}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
