import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  ListGroup,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const chapters = [
  { id: 1, title: "Chapter 1: Introduction", content: "Chapter 1 content..." },
  { id: 2, title: "Chapter 2: The Beginning", content: "Chapter 2 content..." },
  { id: 3, title: "Chapter 3: Rising Action", content: "Chapter 3 content..." },
  { id: 4, title: "Chapter 4: The Journey", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
  { id: 5, title: "Chapter 5: Conclusion", content: "Chapter 5 content..." },
];

const backgrounds = [
  "https://source.unsplash.com/random/1600x900?book",
  "https://source.unsplash.com/random/1600x900?nature",
  "https://source.unsplash.com/random/1600x900?library",
  "https://source.unsplash.com/random/1600x900?abstract",
];

export default function Reader() {
  const navigate = useNavigate();
  const [lastReadChapterId, setLastReadChapterId] = useState(1);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [showModal, setShowModal] = useState(false);
  const [summaryRange, setSummaryRange] = useState("1-3");
  const [showSummary, setShowSummary] = useState(false);

  const currentChapter = chapters.find(ch => ch.id === lastReadChapterId);
  const isDark = theme === "dark";

  useEffect(() => {
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackgroundImage(randomBg);

    const observer = new MutationObserver(() => {
      setTheme(document.body.getAttribute("data-theme") || "light");
    });
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const textColor = isDark ? "text-light" : "text-dark";
  const boxBg = isDark ? "rgba(40, 40, 40, 0.8)" : "rgba(255,255,255,0.85)";
  const sharedBoxStyle = {
    background: boxBg,
    backdropFilter: "blur(10px)",
    borderRadius: "1rem",
    padding: "1.5rem",
    marginBottom: "1rem",
    maxHeight: "calc(100vh - 120px)",
    overflowY: "auto",
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        overflow: "hidden",
        padding: "2rem",
      }}
    >
      <Row>
        {/* Left - Chapters List */}
        <Col md={4}>
          <div style={sharedBoxStyle} className={isDark ? "dark-scroll-reader" : ""}>
            <h5 className={`${textColor} mb-3`}>Chapters</h5>
            <ListGroup>
              {chapters.map((ch) => (
                <ListGroup.Item
                  key={ch.id}
                  action
                  onClick={() => {
                    setLastReadChapterId(ch.id);
                    navigate("/ReadingBook", { state: { chapter: ch } });
                  }}
                  style={{
                    backgroundColor: ch.id === lastReadChapterId
                      ? (isDark ? "rgba(255,255,255,0.1)" : "#d6d8db")
                      : (isDark ? "rgba(255,255,255,0.05)" : ""),
                    color: isDark ? "#eee" : "#000",
                    fontWeight: ch.id === lastReadChapterId ? "bold" : "normal",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  {ch.title}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>

        {/* Right - Book Description + Chapter Content + Buttons */}
        <Col md={8}>
          <div
            className={isDark ? "dark-scroll-reader" : ""}
            style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Book Description */}
              <div style={sharedBoxStyle}>
                <h3 className={`${textColor}`}>📚 *The Journey Within*</h3>
                <p className={textColor}>
                  <strong>Author:</strong> Jane Doe<br />
                  <strong>Published:</strong> 2023<br />
                  <strong>Description:</strong> A compelling exploration of self-discovery and emotional growth through metaphorical storytelling.
                </p>
              </div>

              {/* Chapter Content + Buttons */}
              <div style={sharedBoxStyle}>
                <h4 className={`${textColor}`}>{currentChapter.title}</h4>
                <p className={textColor} style={{ lineHeight: 1.6 }}>
                  {currentChapter.content}
                </p>

                <div className="d-flex flex-column align-items-center mt-4 gap-2">
                  <Button
                    variant="primary"
                    onClick={() => navigate("/ReadingBook", { state: { chapter: currentChapter } })}
                    className="w-50"
                  >
                    Continue Reading
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowModal(true);
                      setShowSummary(false);
                    }}
                    className="w-50"
                  >
                    📄 Summarize Chapters
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </Col>
      </Row>

      {/* Summary Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        style={{ backdropFilter: "blur(12px)" }}
      >
        <Modal.Body
          style={{
            backgroundColor: isDark ? "rgba(66, 61, 61, 0.85)" : "rgba(255, 255, 255, 0.29)",
            padding: "2rem",
            borderRadius: "1rem",
            color: textColor,
          }}
        >
          <h4 className="mb-4">📄 Chapter Summary Preview</h4>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="e.g. 1-3"
              value={summaryRange}
              onChange={(e) => setSummaryRange(e.target.value)}
            />
            <Button variant="primary" onClick={() => setShowSummary(true)}>
              Summarize
            </Button>
          </InputGroup>

          {showSummary && (
            <div
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "0.75rem",
                backgroundColor: isDark ? "rgba(241, 216, 216, 0.29)" : "#f8f9fa",
              }}
            >
              <p className="mb-0">
                "In chapters {summaryRange}, the narrative unfolds as the characters begin their journey.
                Tensions rise, motivations are tested, and key events shape the direction of the story..."
              </p>
            </div>
          )}

          <div className="text-end mt-4">
            <Button variant="primary" onClick={() => setShowModal(false)}>Close</Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Dark mode scroll styling */}
      {isDark && (
        <style>{`
          .dark-scroll-reader::-webkit-scrollbar {
            width: 10px;
          }
          .dark-scroll-reader::-webkit-scrollbar-track {
            background: #2b2b2b;
            border-radius: 8px;
          }
          .dark-scroll-reader::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 10px;
            border: 2px solid #2b2b2b;
          }
        `}</style>
      )}
    </div>
  );
}
