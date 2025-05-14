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
} from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Reader";
  const [theme, setTheme] = useState(document.body.getAttribute("data-theme") || "light");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.getAttribute("data-theme") || "light");
    });
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const readingBooks = [
    { title: "The Alchemist", progress: 60, image: "https://picsum.photos/300/400?random=1" },
    { title: "Atomic Habits", progress: 80, image: "https://picsum.photos/300/400?random=2" },
    { title: "1984", progress: 90, image: "https://picsum.photos/300/400?random=6" },
  ];

  const recommendedBooks = [
    { title: "Sapiens", author: "Yuval Noah Harari", image: "https://picsum.photos/200/300?random=3" },
    { title: "Blink", author: "Malcolm Gladwell", image: "https://picsum.photos/200/300?random=4" },
    { title: "Deep Work", author: "Cal Newport", image: "https://picsum.photos/200/300?random=5" },
    { title: "1984", author: "George Orwell", image: "https://picsum.photos/200/300?random=7" },
  ];

  const allBooks = [...readingBooks, ...recommendedBooks];
  const [searchTerm, setSearchTerm] = useState("");
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
      className="py-1 px-0"
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
      <div className="py-0 px-4" style={{ flexShrink: 0 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="d-inline-block p-2 mb-3 rounded" style={blurStyle}>
            <h3 className="mb-0" style={{ color: textColor }}>
              Welcome back, <span className="text-primary">{username}</span> 👋
            </h3>
          </div>
        </motion.div>

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
          <Col xs={12} md={4} className="text-md-end">
            <Button variant="outline-primary" className="me-2 mb-2" onClick={() => navigate("/library")}>
              📚 Library
            </Button>
            <Button variant="outline-success" className="mb-2" onClick={() => navigate("/playlist")}>🎵 Playlist</Button>
          </Col>
        </Row>
      </div>

      <div
        className="custom-scroll"
        style={{ overflowY: "auto", flexGrow: 1, padding: "2rem" }}
      >
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
                        <Button variant="primary" className="mt-auto" onClick={() => navigate("/reader")}>Read</Button>
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
          <>
            <section className="mb-5">
              <div className="d-inline-block p-2 mb-3 rounded" style={blurStyle}>
                <h5 className="mb-0" style={{ color: textColor }}>Currently Reading</h5>
              </div>
              <Row className="gx-4 gy-4">
                {readingBooks.map((book, idx) => (
                  <Col xs={12} sm={4} md={4} lg={3} key={idx}>
                    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Card className="h-100 shadow-sm border-0" style={{ backgroundColor: cardBg, color: textColor }}>
                        <div style={{ position: "relative" }}>
                          <Card.Img src={book.image} alt={book.title} style={{ height: "180px", objectFit: "cover" }} />
                          <Badge bg="primary" pill style={{ position: "absolute", top: 10, right: 10 }}>{book.progress}%</Badge>
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="mb-3">{book.title}</Card.Title>
                          <Button variant="primary" className="mt-auto" onClick={() => navigate("/reader")}>Continue</Button>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </section>

            <section>
              <div className="d-inline-block p-2 mb-3 rounded" style={blurStyle}>
                <h5 className="mb-0" style={{ color: textColor }}>Recommended For You</h5>
              </div>
              <div className="d-flex flex-row flex-nowrap overflow-auto gx-3">
                {recommendedBooks.map((book, idx) => (
                  <motion.div key={idx} whileHover={{ scale: 1.05 }} className="me-3" style={{ minWidth: '160px' }}>
                    <Card className="shadow-sm border-0" style={{ backgroundColor: cardBg, color: textColor }}>
                      <Card.Img src={book.image} alt={book.title} style={{ height: '200px', objectFit: 'cover' }} />
                      <Card.Body>
                        <Card.Title className="mb-1" style={{ fontSize: '1rem' }}>{book.title}</Card.Title>
                        <Card.Subtitle className="text-muted" style={{ fontSize: '0.85rem' }}>{book.author}</Card.Subtitle>
                        <Button variant="outline-primary" size="sm" className="mt-2" onClick={() => navigate("/reader")}>Read</Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

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