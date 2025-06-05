// GÜNCELLENMİŞ "Home" BİLEŞENİ

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
  Alert
} from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUserSettings } from "../context/UserSettingsContext";

export default function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Reader";
  const [readingBooks, setReadingBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [recommendedBooks] = useState([]);
  const [theme, setTheme] = useState(document.body.getAttribute("data-theme") || "light");
  const isDark = theme === "dark";

  const { settings } = useUserSettings();
  const { fontSize, fontFamily, lineHeight } = settings;

  const fetchBooks = () => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:5000/api/books?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setReadingBooks(data))
      .catch((err) => console.error("Kitaplar alınamadı", err));
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.getAttribute("data-theme") || "light");
    });
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, []);

  const allBooks = [...readingBooks, ...recommendedBooks];
  const filteredBooks = allBooks.filter((book) =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const primaryColor = isDark ? "#1a1a1a" : "#111111"; // koyu tonlar
  const buttonColor = isDark ? "#999999" : "#111111";
  const readerTitle = isDark ? "#e0e0e0" : "#111111";

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
        fontFamily,
        fontSize,
        lineHeight
      }}
    >
      <div className="py-0 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="d-inline-block p-2 my-3 rounded" style={blurStyle}>
            <h3 className="mb-0" style={{ color: textColor }}>
              Welcome back, <span style={{ color: readerTitle }}>{username}</span> 👋
            </h3>
          </div>
        </motion.div>
      </div>

      <div className="px-4 mb-3 text-center">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <InputGroup>
              <FormControl
                placeholder="Search your library..."
                aria-label="Search books"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={
                  isDark
                    ? {
                        backgroundColor: "#ffffff",
                        color: "#001f3f",
                        border: "1px solid #ccc"
                      }
                    : {
                        backgroundColor: "#eaeaea",
                        color: "#001f3f",
                        border: "1px solid #001f3f"
                      }
                }
              />
              <Button style={{ backgroundColor: buttonColor, borderColor: buttonColor }}>
                🔍
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </div>

      <div className="custom-scroll" style={{ overflowY: "auto", flexGrow: 1, padding: "2rem" }}>
        {searchTerm && (
          <section className="mb-5">
            <h5 className="mb-3" style={{ color: textColor }}>Search Results</h5>
            <Row className="gx-4 gy-4">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book, idx) => (
                  <Col xs={12} sm={6} md={4} lg={3} key={idx}>
                    <Card
                      className="shadow-sm border-0"
                      style={{
                        backgroundColor: cardBg,
                        color: textColor,
                        width: "100%",
                        maxHeight: "400px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        overflow: "hidden"
                      }}
                    >
                      <Card.Img variant="top" src={book.image} alt={book.title} style={{ height: "220px", objectFit: "cover" }} />
                      <Card.Body className="d-flex flex-column justify-content-between">
                        <Card.Title>{book.title}</Card.Title>
                        {book.author && <Card.Subtitle className="mb-2" style={{ color: isDark ? "#999" : "#555" }}>{book.author}</Card.Subtitle>}
                        <Button style={{ backgroundColor: primaryColor, borderColor: primaryColor }} className="mt-auto" onClick={() => navigate(`/readingbook/${book._id}`)}>Read</Button>
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
                        <Badge pill style={{ position: "absolute", top: 10, right: 10, backgroundColor: primaryColor, color: "#fff" }}>📖</Badge>
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="mb-3">{book.title}</Card.Title>
                        <Button
                          onClick={() => navigate(`/readingbook/${book._id}`)}
                          style={{
                            backgroundColor: theme === "dark" ? "#f0f0f0" : "#444",
                            color: theme === "dark" ? "#111" : "#fff",
                            border: "none"
                          }}
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
        )}
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 8px; }
        .custom-scroll::-webkit-scrollbar-thumb { background-color: ${isDark ? "#555" : "#ccc"}; border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background-color: ${isDark ? "#2f2f2f" : "#f1f1f1"}; }
      `}</style>
    </Container>
  );
}
