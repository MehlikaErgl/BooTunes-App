import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  InputGroup,
  FormControl,
  Badge,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Reader";

  // Mock data; replace with real API data
  const readingBooks = [
    { title: "The Alchemist", progress: 60, image: "https://picsum.photos/300/400?random=1" },
    { title: "Atomic Habits", progress: 80, image: "https://picsum.photos/300/400?random=2" },
  ];
  const recommendedBooks = [
    { title: "Sapiens", author: "Yuval Noah Harari", image: "https://picsum.photos/200/300?random=3" },
    { title: "Blink", author: "Malcolm Gladwell", image: "https://picsum.photos/200/300?random=4" },
    { title: "Deep Work", author: "Cal Newport", image: "https://picsum.photos/200/300?random=5" },
  ];

  return (
    <Container
      fluid
      className="py-5"
      style={{
        maxWidth: "100%",
        height: "calc(100vh - 25vh)",
        overflowY: "auto",
        margin: "0 auto",
      }}
    >
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="d-inline-block p-2 mb-4 rounded"
          style={{
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(128,128,128,0.5)'
          }}
        >
          <h3
            className="mb-0"
            style={{ color: '#222' }}  /* Burayı istediğin koyulukta bir hex kodu ile güncelle */
          >
            Welcome back, <span className="text-primary">{username}</span> 👋
          </h3>
        </div>

      </motion.div>

      {/* Search & Quick Actions */}
      <Row className="align-items-center mb-5">
        <Col xs={12} md={8} lg={6} className="mb-3 mb-md-0">
          <InputGroup>
            <FormControl
              placeholder="Search your library..."
              aria-label="Search books"
            />
            <Button variant="primary">🔍</Button>
          </InputGroup>
        </Col>
        <Col xs={12} md={4} className="text-md-end">
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
        </Col>
      </Row>

      {/* Currently Reading Section */}
      <section className="mb-5">
        <div className="d-inline-block p-2 mb-3 rounded" style={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(128,128,128,0.5)' }}>
          <h5 className="text-dark mb-0">Currently Reading</h5>
        </div>
        <Row className="gx-4 gy-4">
          {readingBooks.map((book, idx) => (
            <Col xs={12} sm={6} md={4} lg={3} key={idx}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-100 shadow-sm border-0">
                  <div style={{ position: "relative" }}>
                    <Card.Img
                      variant="top"
                      src={book.image}
                      alt={book.title}
                      style={{
                        height: "220px",
                        objectFit: "cover",
                        borderTopLeftRadius: "0.5rem",
                        borderTopRightRadius: "0.5rem",
                      }}
                    />
                    <Badge
                      bg="primary"
                      pill
                      style={{ position: "absolute", top: 10, right: 10 }}
                    >
                      {book.progress}%
                    </Badge>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="mb-3">{book.title}</Card.Title>
                    <Button
                      variant="primary"
                      className="mt-auto"
                      onClick={() => navigate("/reader")}
                    >
                      Continue
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Recommended Books Section */}
      <section>
        <div className="d-inline-block p-2 mb-3 rounded" style={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(128,128,128,0.5)' }}>
          <h5 className="text-dark mb-0">Recommended For You</h5>
        </div>
        <div className="d-flex flex-row flex-nowrap overflow-auto gx-3">
          {recommendedBooks.map((book, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="me-3"
              style={{ minWidth: '160px' }}
            >
              <Card className="shadow-sm border-0">
                <Card.Img
                  variant="top"
                  src={book.image}
                  alt={book.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title className="mb-1" style={{ fontSize: '1rem' }}>{book.title}</Card.Title>
                  <Card.Subtitle className="text-muted" style={{ fontSize: '0.85rem' }}>{book.author}</Card.Subtitle>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => navigate("/reader")}
                  >
                    Read
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </Container>
  );
}
