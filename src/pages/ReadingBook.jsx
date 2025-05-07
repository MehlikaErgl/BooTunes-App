import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ReadingBook() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState("general");
  const navigate = useNavigate();

  const handlePlayPause = () => setIsPlaying((prev) => !prev);
  const handleBack = () => navigate("/reader");

  return (
    <Container
      fluid
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        paddingBottom: "80px" // Mobilde sabit bar için boşluk
      }}
    >
      <div
        className="w-100"
        style={{
          maxWidth: "2000px",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          borderRadius: "1rem",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh"
        }}
      >
        <Row className="flex-grow-1 g-0">
          <Col md={8} className="d-flex flex-column">
            <Card className="flex-grow-1 border-0" style={{ background: "transparent" }}>
              <Card.Header className="d-flex justify-content-between align-items-center border-bottom">
                <Button variant="light" onClick={handleBack}>Back</Button>
                <Button variant="outline-secondary" onClick={() => alert("Saved!")}>Save</Button>
              </Card.Header>

              {/* Chapter Header */}
              <div
                className="px-4 py-2 d-flex justify-content-between align-items-center"
                style={{
                  backgroundColor: "rgba(240,240,240,0.95)",
                  borderBottom: "1px solid #ccc",
                  position: "sticky",
                  top: 0,
                  zIndex: 10
                }}
              >
                <h5 className="mb-0">📖 Chapter 4</h5>
                <span className="text-muted">The Journey</span>
              </div>

              {/* Book Content */}
              <Card.Body
                style={{
                  overflowY: "auto",
                  padding: "2rem",
                  flex: 1,
                  backgroundColor: "white"
                }}
              >
                <p style={{ lineHeight: 1.7, color: "#333" }}>
                  {Array(20).fill("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget nulla quis sapien pretium sodales. In eget diam nec massa dapibus fermentum. Curabitur ullamcorper, metus at fringilla laoreet, risus metus bibendum sapien, sed placerat odio ligula nec sem. Pellentesque nec purus nec ligula laoreet lacinia. Vivamus sit amet metus vel eros bibendum convallis.").join("\n\n")}
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Desktop Music Controls */}
          <Col md={4} className="d-none d-md-flex p-3 align-items-top">
            <Card className="text-center shadow-sm w-100" style={{ borderRadius: "0.75rem", backgroundColor: "var(--bs-dark)", color: "var(--bs-light)" }}>
              <Card.Img
                variant="top"
                src="https://picsum.photos/200/200?random=31"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "1rem",
                  objectFit: "cover",
                  margin: "1rem auto 0"
                }}
              />
              <Card.Body>
                <Card.Title className="mb-1">Locked Eyes</Card.Title>
                <Card.Subtitle className="mb-3 text-muted">Mystery Friends</Card.Subtitle>

                <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
                  <Button variant="outline-light" size="sm" style={{ borderRadius: "50%", width: "40px", height: "40px" }}>◀︎</Button>
                  <Button variant="light" size="sm" style={{ borderRadius: "50%", width: "60px", height: "60px" }} onClick={handlePlayPause}>
                    {isPlaying ? "❚❚" : "▶︎"}
                  </Button>
                  <Button variant="outline-light" size="sm" style={{ borderRadius: "50%", width: "40px", height: "40px" }}>▶︎</Button>
                </div>

                <Form.Select value={playlist} onChange={(e) => setPlaylist(e.target.value)}>
                  <option value="general">General Playlist</option>
                  <option value="personal">My Playlist</option>
                </Form.Select>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Fixed Music Bar for Mobile/Tablet Only */}
      <div
        className="d-md-none position-fixed bottom-0 start-0 end-0"
        style={{
          height: "70px",
          backgroundColor: "#282828",
          color: "#fff",
          zIndex: 1100,
          display: "flex",
          alignItems: "center",
          padding: "0 1rem",
          justifyContent: "space-between"
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <img
            src="https://picsum.photos/200/200?random=31"
            alt="cover"
            style={{ width: "50px", height: "50px", borderRadius: "0.5rem", objectFit: "cover" }}
          />
          <div>
            <div style={{ fontWeight: "bold" }}>Locked Eyes</div>
            <div style={{ fontSize: "0.8rem", color: "#ccc" }}>Mystery Friends</div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <Button variant="outline-light" size="sm" style={{ borderRadius: "50%", width: "36px", height: "36px" }}>◀︎</Button>
          <Button variant="light" size="sm" style={{ borderRadius: "50%", width: "48px", height: "48px" }} onClick={handlePlayPause}>
            {isPlaying ? "❚❚" : "▶︎"}
          </Button>
          <Button variant="outline-light" size="sm" style={{ borderRadius: "50%", width: "36px", height: "36px" }}>▶︎</Button>
        </div>
      </div>
    </Container>
  );
}
