import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

export default function ReadingBook() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState("general");
  const [musicOpen, setMusicOpen] = useState(false);
  const navigate = useNavigate();

  const handlePlayPause = () => setIsPlaying((p) => !p);
  const handleBack = () => navigate("/reader");
  const toggleMusic = () => setMusicOpen((o) => !o);

  return (
    <Container
      fluid
      style={{
        minHeight: "75vh",
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem"
      }}
    >
      <div
        className="w-100"
        style={{
          maxWidth: "2000px",
          height: "calc(100vh - 100px)",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          borderRadius: "1rem",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Row className="h-100 g-0">
          {/* Book Content */}
          <Col md={8} className="d-flex flex-column h-100">
            <Card
              className="flex-grow-1 border-0"
              style={{ background: "transparent", overflow: "hidden" }}
            >
              <Card.Header className="d-flex justify-content-between align-items-center border-bottom">
                <Button variant="light" onClick={handleBack}>Back</Button>
                <Button variant="outline-secondary" onClick={() => alert("Saved!")}>Save</Button>
              </Card.Header>

              {/* Chapter Title */}
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

              {/* Scrollable Text Area */}
              <Card.Body
                style={{
                  overflowY: "auto",
                  padding: "2rem",
                  flex: 1,
                  backgroundColor: "white"
                }}
              >
                <p style={{ lineHeight: 1.7, color: "#333" }}>
                  {Array(20).fill(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget
                  nulla quis sapien pretium sodales. In eget diam nec massa dapibus fermentum. Curabitur
                  ullamcorper, metus at fringilla laoreet, risus metus bibendum sapien, sed placerat odio ligula
                  nec sem. Pellentesque nec purus nec ligula laoreet lacinia. Vivamus sit amet metus vel eros
                  bibendum convallis.`).join("\n\n")}
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Music Controls - Right Side */}
          <Col md={4} className="d-none d-md-flex p-3 align-items-center">
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
                  <Button variant="outline-light" size="sm" style={{ borderRadius: "50%", width: "40px", height: "40px", padding: 0 }}>◀︎</Button>
                  <Button variant="light" size="sm" style={{ borderRadius: "50%", width: "60px", height: "60px", padding: 0 }} onClick={handlePlayPause}>
                    {isPlaying ? "❚❚" : "▶︎"}
                  </Button>
                  <Button variant="outline-light" size="sm" style={{ borderRadius: "50%", width: "40px", height: "40px", padding: 0 }}>▶︎</Button>
                </div>

                <Form.Select value={playlist} onChange={(e) => setPlaylist(e.target.value)}>
                  <option value="general">General Playlist</option>
                  <option value="personal">My Playlist</option>
                </Form.Select>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Mobile Music Toggle */}
        <div className="d-md-none position-fixed bottom-0 w-100" style={{ zIndex: 1050 }}>
          <Button variant="primary" className="w-100 rounded-0" onClick={toggleMusic}>
            {musicOpen ? <><FiChevronDown /> Hide Music</> : <><FiChevronUp /> Show Music</>}
          </Button>
        </div>

        {/* Mobile Music Panel */}
        <AnimatePresence>
          {musicOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3 }}
              className="d-md-none position-fixed bottom-0 w-100"
              style={{ height: "50vh", backgroundColor: "rgba(40,40,40,0.95)", zIndex: 1040, padding: "1rem" }}
            >
              <Card className="text-center shadow-sm" style={{ borderRadius: "0.75rem", backgroundColor: "#282828", color: "#fff", height: "100%" }}>
                <Card.Img
                  variant="top"
                  src="https://picsum.photos/200/200?random=31"
                  style={{ width: "100px", height: "100px", borderRadius: "1rem", objectFit: "cover", margin: "1rem auto 0" }}
                />
                <Card.Body>
                  <Card.Title className="mb-1">Locked Eyes</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">Mystery Friends</Card.Subtitle>

                  <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
                    <Button variant="outline-light" size="sm" style={{ borderRadius: "50%", width: "40px", height: "40px", padding: 0 }}>◀︎</Button>
                    <Button variant="light" size="sm" style={{ borderRadius: "50%", width: "60px", height: "60px", padding: 0 }} onClick={handlePlayPause}>
                      {isPlaying ? "❚❚" : "▶︎"}
                    </Button>
                    <Button variant="outline-light" size="sm" style={{ borderRadius: "50%", width: "40px", height: "40px", padding: 0 }}>▶︎</Button>
                  </div>

                  <Form.Select value={playlist} onChange={(e) => setPlaylist(e.target.value)}>
                    <option value="general">General Playlist</option>
                    <option value="personal">My Playlist</option>
                  </Form.Select>
                </Card.Body>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}
