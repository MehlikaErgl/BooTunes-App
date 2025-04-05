import React from "react";
import { Card, Button, Row, Col, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const readingBooks = [
    { title: "The Alchemist", progress: 60, image: "https://picsum.photos/200/300?random=1" },
    { title: "Atomic Habits", progress: 80, image: "https://picsum.photos/200/300?random=2" },
  ];

  return (
    <div className="text-white">
      <div
          className="text-center mb-4 p-3 mx-auto rounded-4 shadow-sm"
          style={{
            maxWidth: "400px",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(6px)",
          }}
        >
        <h2 style={{ fontSize: "2rem", color: "#fff", margin: 0 }}>
          Welcome to Bootunes
        </h2>
      </div>

      <div className="d-flex justify-content-center gap-3 mb-4">
        <Button variant="primary" onClick={() => navigate("/Library")}>
          📚 Go to Library
        </Button>
        <Button variant="success" onClick={() => navigate("/Playlist")}>
          🎵 Go to Playlist
        </Button>
      </div>

      {/* Okunan Kitaplar */}
      <h4 className="mb-3">📖 Currently Reading</h4>
      <Row className="g-3 mb-4">
        {readingBooks.map((book, index) => (
          <Col md={6} key={index}>
            <Card className="shadow-sm">
              <Row className="g-0">
                <Col md={4}>
                  <Card.Img src={book.image} alt={book.title} />
                </Col>
                <Col md={8}>
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <ProgressBar now={book.progress} label={`${book.progress}%`} className="mb-3" />
                    <Button variant="success" onClick={() => navigate("/reader")}>
                      Continue
                    </Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Home;
