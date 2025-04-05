import React, { useState } from "react";
import { Card, Button, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ReadingBook() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState("general");
  const navigate = useNavigate();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleBack = () => {
    // Buraya istersen okuma ilerlemesi kaydetme fonksiyonu ekleyebilirsin
    navigate("/home");
  };

  return (
    <div className="text-white">
      <Row>
        {/* Book Content */}
        <Col md={8} style={{ borderRight: "1px solid #555", padding: "20px", position: "relative" }}>
          {/* Save & Back Button */}
          <Button
            variant="outline-dark"
            size="sm"
            style={{ position: "absolute", top: "20px", right: "20px", zIndex: 10 }}
            onClick={handleBack}
          >
            💾 Save & Back to Home
          </Button>

          <Card className="p-4 shadow-lg" style={{ backgroundColor: "white", color: "#333", minHeight: "100vh" }}>
            <Card.Title style={{ fontSize: "1.8rem" }}>Chapter 4: The Journey</Card.Title>
            <Card.Text style={{ textAlign: "justify", marginTop: "20px" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget nulla quis sapien pretium sodales.
              In eget diam nec massa dapibus fermentum. Curabitur ullamcorper, metus at fringilla laoreet,
              risus metus bibendum sapien, sed placerat odio ligula nec sem. Pellentesque nec purus nec ligula
              laoreet lacinia. Vivamus sit amet metus vel eros bibendum convallis.
            </Card.Text>
          </Card>
        </Col>

        {/* Music & Playlist Control */}
        <Col md={4} style={{ padding: "20px" }}>
          <Card className="shadow-sm p-3 mb-3 text-center">
            <Card.Img
              src="https://picsum.photos/100/100?random=31"
              style={{ width: "80px", height: "80px", borderRadius: "12px" }}
              className="mx-auto mb-2"
            />
            <Card.Title>Locked Eyes</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Mystery Friends</Card.Subtitle>
            <div className="d-flex justify-content-center gap-3 my-2">
              <Button variant="light" size="sm">⏮️</Button>
              <Button variant="light" size="sm" onClick={handlePlayPause}>
                {isPlaying ? "⏸️" : "▶️"}
              </Button>
              <Button variant="light" size="sm">⏭️</Button>
            </div>
            <Form.Select
              value={playlist}
              onChange={(e) => setPlaylist(e.target.value)}
              className="mt-3"
            >
              <option value="general">General Playlist</option>
              <option value="personal">My Playlist</option>
            </Form.Select>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ReadingBook;
