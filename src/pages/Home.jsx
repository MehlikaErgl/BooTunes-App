import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  InputGroup,
  FormControl,
  Badge,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Reader";
  const [theme, setTheme] = useState(document.body.getAttribute("data-theme") || "light");
  const [readingBooks, setReadingBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [recommendedBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.getAttribute("data-theme") || "light");
    });
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:5000/api/books?userId=${userId}`)
      .then(res => res.json())
      .then(data => setReadingBooks(data))
      .catch(err => console.error("Kitaplar alınamadı", err));
  }, []);

  const handleBookSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userId = localStorage.getItem("userId");
    formData.append("userId", userId);
    formData.append("pdf", pdfFile);

    fetch("http://localhost:5000/api/books", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((newBook) => {
        setReadingBooks((prev) => [...prev, newBook]);
        setShowModal(false);
        e.target.reset();
        alert("Kitap eklendi ✅");
      })
      .catch((err) => {
        console.error("❌ Kitap eklenemedi:", err);
        alert("Kitap eklenemedi");
      });
  };

  const allBooks = [...readingBooks, ...recommendedBooks];
  const filteredBooks = allBooks.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isDark = theme === "dark";
  const contentBg = isDark ? "rgba(51, 46, 46, 0.4)" : undefined;
  const cardBg = isDark ? "rgba(255,255,255,0.08)" : "#ffffff";
  const textColor = isDark ? "#f1f1f1" : "#222";
  const blurStyle = {
    backdropFilter: "blur(6px)",
    backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(200, 200, 200, 0.66)"
  };

  return (
    <Container
      fluid
      className="py-1 px-0 position-relative"
      style={{
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundColor: contentBg,
        backdropFilter: isDark ? "blur(6px)" : undefined,
        color: textColor,
      }}
    >
      {/* Welcome Message */}
      <div className="py-0 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="d-inline-block p-2 my-3 rounded" style={blurStyle}>
            <h3 className="mb-0" style={{ color: textColor }}>
              Welcome back, <span className="text-primary">{username}</span> 👋
            </h3>
          </div>
        </motion.div>
      </div>

      {/* Add Button (Fixed Position) */}
      <Button
        variant="primary"
        className="position-absolute rounded-circle d-flex justify-content-center align-items-center"
        style={{
          width: "80px",
          height: "80px",
          top: "20px",
          right: "20px",
          background: "#084261",
          zIndex: 1000
        }}
        onClick={() => setShowModal(true)}
      >
        <img
          src="https://cdn-icons-png.freepik.com/512/845/845216.png"
          alt="Add"
          style={{ width: "40px", height: "40px" }}
        />
      </Button>

      {/* Search Bar */}
      <div className="px-4 mb-2">
        <Row className="align-items-center">
          <Col xs={12} md={8} lg={6} className="mb-3 mb-md-0">
            <InputGroup>
              <FormControl
                placeholder="Search your library..."
                aria-label="Search books"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={
                  isDark
                    ? {
                        backgroundColor: "#6a6a6a",
                        color: "#ffffff",
                        border: "1px solid #555",
                      }
                    : {}
                }
              />
              <Button variant={isDark ? "light" : "primary"}>🔍</Button>
            </InputGroup>
          </Col>
        </Row>
      </div>

      {/* Playlist & Library Buttons under search */}
      <div className="px-4 mb-3 p-2">
        <Button
          variant="outline-primary"
          className="me-2 mb-2"
          onClick={() => navigate("/library")}
        >
          📚 Library
        </Button>
        <Button
          variant="outline-success"
          className="mb-2"
          onClick={() => navigate("/playlist")}
        >
          🎵 Playlist
        </Button>
      </div>

      {/* Book Cards */}
      <div className="custom-scroll" style={{ overflowY: "auto", flexGrow: 1, padding: "2rem" }}>
        {searchTerm && (
          <section className="mb-5">
            <h5 className="mb-3" style={{ color: textColor }}>Search Results</h5>
            <Row className="gx-4 gy-4">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book, idx) => (
                  <Col xs={12} sm={6} md={4} lg={3} key={idx}>
                    <Card className="h-100 shadow-sm border-0" style={{ backgroundColor: cardBg, color: textColor }}>
                      <Card.Img variant="top" src={book.image} alt={book.title} style={{ height: "220px", objectFit: "cover" }} />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title>{book.title}</Card.Title>
                        {book.author && <Card.Subtitle className="text-muted mb-2">{book.author}</Card.Subtitle>}
                        <Button variant="primary" className="mt-auto" onClick={() => navigate(`/readingbook/${book._id}`)}>Read</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col><Alert variant="warning">No books found matching "{searchTerm}".</Alert></Col>
              )}
            </Row>
          </section>
        )}

        {!searchTerm && (
          <section className="mb-5">
            <div className="d-inline-block p-2 mb-3 rounded" style={blurStyle}>
              <h5 className="mb-0" style={{ color: textColor }}>Your Library</h5>
            </div>
            <Row className="gx-4 gy-4">
              {readingBooks.map((book, idx) => (
                <Col xs={12} sm={4} md={4} lg={3} key={idx}>
                  <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="h-100 shadow-sm border-0" style={{ backgroundColor: cardBg, color: textColor }}>
                      <div style={{ position: "relative" }}>
                        <Card.Img src={book.image} alt={book.title} style={{ height: "180px", objectFit: "cover" }} />
                        <Badge bg="primary" pill style={{ position: "absolute", top: 10, right: 10 }}>📖</Badge>
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="mb-3">{book.title}</Card.Title>
                        <Button variant="primary" className="mt-auto" onClick={() => navigate(`/reader/${book._id}`)}>Continue</Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </section>
        )}
      </div>

      {/* Modal for Add Book */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Book</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBookSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Book Title</Form.Label>
              <Form.Control type="text" name="title" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control type="text" name="author" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cover Image URL</Form.Label>
              <Form.Control type="text" name="image" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>PDF File</Form.Label>
              <Form.Control type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Add</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: ${isDark ? "#555" : "#ccc"};
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background-color: ${isDark ? "#2f2f2f" : "#f1f1f1"};
        }
      `}</style>
    </Container>
  );
}
