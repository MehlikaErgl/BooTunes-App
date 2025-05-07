import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const chapters = [
  { id: 1, title: "Chapter 1: Introduction", content: "Chapter 1 content..." },
  { id: 2, title: "Chapter 2: The Beginning", content: "Chapter 2 content..." },
  { id: 3, title: "Chapter 3: Rising Action", content: "Chapter 3 content..." },
  { id: 4, title: "Chapter 4: The Journey", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
  { id: 5, title: "Chapter 5: Conclusion", content: "Chapter 5 content..." }
];

const backgrounds = [
  "https://source.unsplash.com/random/1600x900?book",
  "https://source.unsplash.com/random/1600x900?nature",
  "https://source.unsplash.com/random/1600x900?library",
  "https://source.unsplash.com/random/1600x900?abstract"
];

export default function Reader() {
  const navigate = useNavigate();
  const [lastReadChapterId, setLastReadChapterId] = useState(4);
  const [backgroundImage, setBackgroundImage] = useState("");

  const currentChapter = chapters.find(ch => ch.id === lastReadChapterId);

  useEffect(() => {
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackgroundImage(randomBg);
  }, []);

  const handleChapterClick = (chapter) => {
    setLastReadChapterId(chapter.id);
    navigate("/ReadingBook", { state: { chapter } });
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <Container
        style={{
          maxWidth: "1000px",
          margin: "auto",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(10px)",
          borderRadius: "1rem",
          padding: "2rem",
        }}
      >
        <Row>
          {/* Chapter Listesi */}
          <Col md={4} className="mb-4">
            <h5 className="text-dark mb-3">Chapters</h5>
            <ListGroup>
              {chapters.map((ch) => (
                <ListGroup.Item
                  key={ch.id}
                  action
                  onClick={() => handleChapterClick(ch)}
                  style={{
                    backgroundColor: ch.id === lastReadChapterId ? "#d6d8db" : "",
                    fontWeight: ch.id === lastReadChapterId ? "bold" : "normal",
                    cursor: "pointer"
                  }}
                >
                  {ch.title}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          {/* Seçilen Chapter Detayı */}
          <Col md={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                className="h-100"
                style={{ border: "none", background: "transparent" }}
              >
                <Card.Header
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    background: "transparent",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <h4 className="mb-0 text-dark">{currentChapter.title}</h4>
                </Card.Header>
                <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <p className="text-dark" style={{ lineHeight: 1.6 }}>
                    {currentChapter.content}
                  </p>
                </Card.Body>
                <Card.Footer
                  style={{
                    background: "transparent",
                    borderTop: "1px solid #ddd",
                  }}
                >
                  <Button
                    variant="primary"
                    onClick={() => handleChapterClick(currentChapter)}
                  >
                    Continue Reading
                  </Button>
                </Card.Footer>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
