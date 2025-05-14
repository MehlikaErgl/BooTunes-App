import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ReadingBook() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState("general");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.body.dataset.theme || "light";
      setTheme(newTheme);
    });
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === "dark";

  const handlePlayPause = () => setIsPlaying((prev) => !prev);
  const handleBack = () => navigate("/reader");

  const contentBg = isDark ? "#2f2f2f" : "white";
  const textColor = isDark ? "#f1f1f1" : "#333";
  const headerBg = isDark ? "#1e1e1e" : "#f8f9fa";

  return (
    <Container
      fluid
      className="d-flex flex-column"
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        padding: 0,
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Row className="flex-grow-1 g-0" style={{ height: "100vh" }}>
        <Col md={12} className="d-flex flex-column">
          <Card
            className="flex-grow-1 border-0"
            style={{
              backgroundColor: isDark ? "#181818" : "rgba(255,255,255,0.85)",
              color: textColor
            }}
          >
            {/* Header */}
            <Card.Header
              className="d-flex justify-content-between align-items-center border-bottom sticky-top"
              style={{
                backgroundColor: headerBg,
                color: textColor,
                zIndex: 10
              }}
            >
              <Button variant={isDark ? "secondary" : "light"} onClick={handleBack}>
                Back
              </Button>
              <Button
                variant={isDark ? "outline-light" : "outline-secondary"}
                onClick={() => alert("Saved!")}
              >
                Save
              </Button>
            </Card.Header>

            {/* Subheader */}
            <div
              className="px-4 py-2 d-flex justify-content-between align-items-center border-bottom sticky-top"
              style={{
                backgroundColor: headerBg,
                top: "56px",
                zIndex: 9,
                color: textColor
              }}
            >
              <h5 className="mb-0">📖 Chapter 4</h5>
              <span className="text-muted">The Journey</span>
            </div>

            {/* Book Content */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                maxHeight: "calc(100vh - 250px)",
                backgroundColor: contentBg,
                padding: "2rem",
                color: textColor
              }}
              className="custom-scroll"
            >
              <p style={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {Array(100)
                  .fill("Lorem ipsum dolor sit amet, consectetur adipiscing elit...")
                  .join("\n\n")}
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Music Player Bar */}
      <div
  className="position-fixed bottom-0 start-0 end-0 d-flex justify-content-between align-items-center px-4"
  style={{
    height: "70px",
    backgroundColor: "#000",
    color: "#fff",
    zIndex: 1200,
  }}
>
  {/* Sol: Şarkı bilgisi */}
  <div className="d-flex align-items-center gap-3">
    <img
      src="https://picsum.photos/200/200?random=31"
      alt="cover"
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "0.5rem",
        objectFit: "cover",
      }}
    />
    <div>
      <div style={{ fontWeight: "bold" }}>Locked Eyes</div>
      <div style={{ fontSize: "0.8rem", color: "#ccc" }}>Mystery Friends</div>
    </div>
  </div>

  {/* Orta: Kontroller */}
  <div className="d-flex align-items-center gap-3">
    <Button
      variant="outline-light"
      size="sm"
      style={{ borderRadius: "50%", width: "36px", height: "36px" }}
    >
      ◀︎
    </Button>
    <Button
      variant="light"
      size="sm"
      style={{ borderRadius: "50%", width: "48px", height: "48px" }}
      onClick={handlePlayPause}
    >
      {isPlaying ? "❚❚" : "▶︎"}
    </Button>
    <Button
      variant="outline-light"
      size="sm"
      style={{ borderRadius: "50%", width: "36px", height: "36px" }}
    >
      ▶︎
    </Button>
  </div>

  {/* Sağ: Playlist seçimi + Artı butonu */}
  <div className="d-flex align-items-center gap-3">
  <Form.Select
    size="sm"
    value={playlist}
    onChange={(e) => setPlaylist(e.target.value)}
    style={{
      maxWidth: "150px",
      backgroundColor: "#1f1f1f",
      color: "#fff",
      borderColor: "#333",
      borderRadius: "0.375rem", // Bootstrap default for small select
      height: "36px"
    }}
  >
    <option value="general">🎵 General Playlist</option>
    <option value="my">🎶 My Playlist</option>
  </Form.Select>

  <Button
    variant="outline-light"
    size="sm"
    style={{
      height: "36px",
      width: "70px",
      borderRadius: "0.375rem", // Match select's roundness
      fontSize: "0.85rem",
      padding: 0
    }}
    onClick={() => setIsAdded(true)}
    disabled={isAdded}
  >
    {isAdded ? "added" : "add+"}
  </Button>
</div>
</div>
      {/* Scrollbar Styling */}
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
