import React from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Reader() {
  const navigate = useNavigate();

  const chapter = {
    title: "Chapter 4: The Journey",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Phasellus feugiat nisl nec elit vulputate, vel malesuada metus varius. Vivamus in sem vitae nibh aliquam vehicula. Integer sit amet augue vitae arcu lacinia fermentum at ut purus. Cras et tellus vitae nisl tincidunt hendrerit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`
  };

  const recommendedBooks = [
    { title: "Brave New World", image: "https://picsum.photos/100/140?random=16" },
    { title: "Sapiens", image: "https://picsum.photos/100/140?random=17" },
  ];

  return (
    <Container
      style={{
        maxWidth: "900px",
        margin: "2rem auto",
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(8px)",
        borderRadius: "1rem",
        padding: "2rem",
      }}
    >
      <Row>
        {/* Chapter Panel */}
        <Col md={8} className="mb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className="h-100"
              style={{ border: "none", background: "transparent" }}
            >
              <Card.Header className="d-flex justify-content-between align-items-center" style={{ background: 'transparent', borderBottom: '1px solid #ddd' }}>
                <h4 className="mb-0 text-dark">{chapter.title}</h4>
                <Button variant="outline-primary" onClick={() => navigate('/ReadingBook')}>Read Full</Button>
              </Card.Header>
              <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <p className="text-dark" style={{ lineHeight: 1.6 }}>{chapter.content}</p>
              </Card.Body>
              <Card.Footer style={{ background: 'transparent', borderTop: '1px solid #ddd' }}>
                <Button variant="primary" onClick={() => navigate('/ReadingBook')}>Continue Reading</Button>
              </Card.Footer>
            </Card>
          </motion.div>
        </Col>

        {/* Recommendations */}
        <Col md={4} className="mb-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              style={{ border: 'none', background: 'transparent' }}
            >
              <Card.Header style={{ background: 'transparent', borderBottom: '1px solid #ddd' }}>
                <h5 className="mb-0 text-dark">📌 Recommendations</h5>
              </Card.Header>
              <ListGroup variant="flush">
                {recommendedBooks.map((book, idx) => (
                  <ListGroup.Item
                    key={idx}
                    className="d-flex align-items-center"
                    style={{ background: 'transparent', borderBottom: '1px solid #eee' }}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '0.5rem', marginRight: '1rem' }}
                    />
                    <div className="flex-grow-1">
                      <span className="text-dark" style={{ fontWeight: 500 }}>{book.title}</span>
                    </div>
                    <Button variant="outline-secondary" size="sm" onClick={() => navigate('/Reader')}>
                      View
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}