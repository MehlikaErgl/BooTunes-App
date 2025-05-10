import React, { useState, useEffect } from "react";
import {
  Container,
  Navbar,
  Nav,
  Button,
  Offcanvas,
  Row,
  Col
} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import bgImage from "../assets/background.png";

export default function Layout({ children }) {
  const navigate = useNavigate();

  // theme + user
  const storedTheme = localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState(storedTheme);
  const username = localStorage.getItem("username");

  // mobile width detection
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const isMobile = width < 576;

  // offcanvas state
  const [showCanvas, setShowCanvas] = useState(false);
  const [offcanvasWidth, setOffcanvasWidth] = useState(
    window.innerWidth < 768 ? "80%" : "30%"
  );
  useEffect(() => {
    const onResize = () =>
      setOffcanvasWidth(window.innerWidth < 768 ? "80%" : "30%");
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // persist theme
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // colors & backgrounds
  const textColor = theme === "light" ? "text-dark" : "text-light";
  const navVariant = theme === "light" ? "light" : "dark";
  const navBg =
    theme === "light"
      ? "rgba(255,255,255,0.8)"
      : "rgba(25, 23, 23, 0.85)";
  const offcanvasBg =
    theme === "light" ? "bg-light text-dark" : "bg-dark text-light";
  const contentBg =
    theme === "light"
      ? "rgba(255,255,255,0.60)"
      : "rgba(40, 40, 40, 0.65)";
  const contentBlur = theme === "light" ? "blur(16px)" : "blur(6px)";

  // nav links
  const navItems = [
    { label: "Home", to: "/home" },
    { label: "Library", to: "/library" },
    { label: "Reader", to: "/reader" },
    { label: "Settings", to: "/settings" }
  ];

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
      }}
    >
      {/* Theme overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            theme === "dark"
              ? "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.85) 100%)"
              : "linear-gradient(180deg, rgba(53,48,48,0.4) 0%, rgba(41,38,38,0.6) 100%)",
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
          <Navbar.Brand as={NavLink} to="/home" className={`${textColor} fw-bold`}>
            BooTunes 🎵📖
          </Navbar.Brand>

          <Button
            variant="link"
            className="d-lg-none text-white ms-auto"
            onClick={() => setShowCanvas(true)}
          >
            {showCanvas ? <FiX size={24} /> : <FiMenu size={24} />}
          </Button>

          <Navbar.Collapse className="d-none d-lg-flex justify-content-between align-items-center">
            <Nav className="align-items-center">
              {navItems.map(item => (
                <Nav.Link
                  key={item.to}
                  as={NavLink}
                  to={item.to}
                  className={({ isActive }) =>
                    `mx-3 ${textColor} ${isActive ? "fw-bold" : ""}`
                  }
                >
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>
            <div className="d-flex align-items-center">
              <Button variant="link" onClick={toggleTheme} className={`${textColor} me-3`}>
                {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
              </Button>
              {username && <span className={`${textColor} me-3`}>👋 {username}</span>}
              <Button
                variant={theme === "dark" ? "outline-light" : "outline-primary"}
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Offcanvas menu */}
      <Offcanvas
        show={showCanvas}
        onHide={() => setShowCanvas(false)}
        placement="start"
        className={offcanvasBg}
        scroll={true}
        style={{ width: offcanvasWidth, backdropFilter: "blur(5px)" }}
      >
        <Offcanvas.Header closeButton closeVariant={theme === "light" ? "dark" : "white"}>
          <Offcanvas.Title className={textColor}>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column mt-3">
            {navItems.map(item => (
              <Nav.Link
                key={item.to}
                as={NavLink}
                to={item.to}
                onClick={() => setShowCanvas(false)}
                className={`${textColor} my-2`}
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
          <hr className="border-secondary my-3" />
          {username && <div className={`${textColor} mb-3`}>👋 {username}</div>}
          <div className="d-flex justify-content-between">
            <Button variant="link" onClick={toggleTheme} className={textColor}>
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </Button>
            <Button
              variant={theme === "dark" ? "outline-light" : "outline-primary"}
              onClick={() => {
                setShowCanvas(false);
                handleLogout();
              }}
            >
              Logout
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Content wrapper */}
      <Container
        fluid
        className="py-5"
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
              padding: "2rem",

              // mobile gets 50px more height
              maxHeight: isMobile
                ? "calc(100vh - 100px)"
                : "calc(100vh - 150px)",

              overflowY: "hidden",
              backdropFilter: contentBlur
            }}
          >
            {React.cloneElement(children, { theme })}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
