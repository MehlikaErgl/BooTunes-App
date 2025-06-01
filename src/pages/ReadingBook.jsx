import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Modal
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

export default function ReadingBook() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState("general");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isAdded, setIsAdded] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [selectedContent, setSelectedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [summaryModal, setSummaryModal] = useState(false);
  const [summaryResult, setSummaryResult] = useState("");
  const [summarySelectModal, setSummarySelectModal] = useState(false);
  const [selectedChapterToSummarize, setSelectedChapterToSummarize] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.body.dataset.theme || "light";
      setTheme(newTheme);
    });
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const loadChapter = useCallback((filename) => {
    setLoading(true);
    fetch(`http://localhost:5000/api/chapters/${id}/${filename}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedContent(data.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Bölüm yüklenemedi:", err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/chapters/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setChapters(data);
        if (data.length > 0) {
          setCurrentIndex(0);
          loadChapter(data[0]);
        }
      })
      .catch((err) => console.error("Bölümler alınamadı:", err));
  }, [id, loadChapter]);

  const isDark = theme === "dark";
  const handlePlayPause = () => setIsPlaying((prev) => !prev);
  const handleBack = () => navigate("/reader");

  const handleNext = () => {
    if (currentIndex < chapters.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      loadChapter(chapters[newIndex]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      loadChapter(chapters[newIndex]);
    }
  };

  const requestSummary = async (filename) => {
    setSummaryModal(true);
    setSummaryResult("Özetleniyor...");
    try {
      const res = await fetch(`http://localhost:5000/api/chapters/${id}/${filename}`);
      const data = await res.json();
      const response = await fetch("http://localhost:8000/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.content })
      });
      const result = await response.json();
      if (result.summary) setSummaryResult(result.summary);
      else setSummaryResult("Özetleme başarısız: " + result.error);
    } catch (err) {
      setSummaryResult("Sunucu hatası: " + err.message);
    }
  };

  const contentBg = isDark ? "#181818" : "#f5f1eb";
  const textColor = isDark ? "#e0e0e0" : "#2c2c2c";
  const headerBg = isDark ? "#1e1e1e" : "#faf9f6";

  return (
    <Container fluid className="d-flex flex-column" style={{ minHeight: "100vh", backgroundColor: contentBg, padding: 0, position: "relative", overflow: "hidden" }}>
      <Row className="flex-grow-1 g-0" style={{ height: "100vh" }}>
        <Col md={12} className="d-flex flex-column">
          <Card className="flex-grow-1 border-0 shadow-sm" style={{ backgroundColor: contentBg, color: textColor }}>
            <Card.Header className="d-flex justify-content-between align-items-center border-bottom sticky-top" style={{ backgroundColor: headerBg, color: textColor, zIndex: 10 }}>
              <Button variant={isDark ? "secondary" : "light"} onClick={handleBack}>Back</Button>
              <div className="d-flex gap-2">
                <Button variant={isDark ? "outline-light" : "outline-secondary"} onClick={() => setSummarySelectModal(true)}>📄 Özetle</Button>
                <Button variant={isDark ? "outline-light" : "outline-secondary"} onClick={() => alert("Saved!")}>Save</Button>
              </div>
            </Card.Header>

            <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: headerBg, color: textColor }}>
              <h4 className="mb-0" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>{chapters[currentIndex]?.replace(".txt", "").replace(/_/g, " ")}</h4>
              <div className="d-flex gap-2">
                <Button size="sm" onClick={handlePrev} disabled={currentIndex === 0}>&larr; Previous</Button>
                <Button size="sm" onClick={handleNext} disabled={currentIndex === chapters.length - 1}>Next &rarr;</Button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", maxHeight: "calc(100vh - 250px)", backgroundColor: contentBg, padding: "2.5rem 3rem", color: textColor }} className="custom-scroll">
              {loading ? <Spinner animation="border" /> : <pre style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: "18px", fontFamily: 'Georgia, serif' }}>{selectedContent}</pre>}
            </div>
          </Card>
        </Col>
      </Row>

      <div className="position-fixed bottom-0 start-0 end-0 d-flex justify-content-between align-items-center px-4" style={{ height: "70px", backgroundColor: "#000", color: "#fff", zIndex: 1200 }}>
        <div className="d-flex align-items-center gap-3">
          <img src="https://picsum.photos/200/200?random=31" alt="cover" style={{ width: "50px", height: "50px", borderRadius: "0.5rem", objectFit: "cover" }} />
          <div>
            <div style={{ fontWeight: "bold" }}>Locked Eyes</div>
            <div style={{ fontSize: "0.8rem", color: "#ccc" }}>Mystery Friends</div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          <Button variant="outline-light" size="sm" style={{ borderRadius: "50%", width: "36px", height: "36px" }}>&#9664;</Button>
          <Button variant="light" size="sm" style={{ borderRadius: "50%", width: "48px", height: "48px" }} onClick={handlePlayPause}>{isPlaying ? "❚❚" : "▶"}</Button>
          <Button variant="outline-light" size="sm" style={{ borderRadius: "50%", width: "36px", height: "36px" }}>&#9654;</Button>
        </div>
        <div className="d-flex align-items-center gap-3">
          <Form.Select size="sm" value={playlist} onChange={(e) => setPlaylist(e.target.value)} style={{ maxWidth: "150px", backgroundColor: "#1f1f1f", color: "#fff", borderColor: "#333", borderRadius: "0.375rem", height: "36px" }}>
            <option value="general">🎵 General Playlist</option>
            <option value="my">🎶 My Playlist</option>
          </Form.Select>
          <Button variant="outline-light" size="sm" style={{ height: "36px", width: "70px", borderRadius: "0.375rem", fontSize: "0.85rem", padding: 0 }} onClick={() => setIsAdded(true)} disabled={isAdded}>{isAdded ? "added" : "add+"}</Button>
        </div>
      </div>

      <Modal show={summarySelectModal} onHide={() => setSummarySelectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Hangi bölümü özetlemek istersiniz?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select value={selectedChapterToSummarize} onChange={(e) => setSelectedChapterToSummarize(e.target.value)} className="mb-3">
            <option value="">Bölüm Seçiniz</option>
            {chapters.map((ch, idx) => (
              <option key={idx} value={ch}>{ch.replace(".txt", "").replace(/_/g, " ")}</option>
            ))}
          </Form.Select>
          <Button onClick={() => {
            if (selectedChapterToSummarize) {
              setSummarySelectModal(false);
              requestSummary(selectedChapterToSummarize);
            }
          }} disabled={!selectedChapterToSummarize}>
            Özetle
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={summaryModal} onHide={() => setSummaryModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Bölüm Özeti</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ whiteSpace: "pre-wrap", fontFamily: 'Georgia, serif' }}>
          {summaryResult}
        </Modal.Body>
      </Modal>

      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: ${isDark ? "#444" : "#bbb"};
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background-color: ${isDark ? "#2b2b2b" : "#eee"};
        }
      `}</style>
    </Container>
  );
}
