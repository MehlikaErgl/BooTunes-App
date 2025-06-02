import React, { useEffect, useState, useCallback, useContext } from "react";
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
import { useUserSettings } from "../context/UserSettingsContext";

export default function ReadingBook() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
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
  const { settings } = useUserSettings();
  const { fontSize, fontFamily, lineHeight } = settings;

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

        const saved = localStorage.getItem(`readingProgress_${id}`);
        const savedIndex = saved ? parseInt(saved) : 0;

        if (data.length > 0) {
          setCurrentIndex(savedIndex);
          loadChapter(data[savedIndex]);
        }
      })
      .catch((err) => console.error("Bölümler alınamadı:", err));
  }, [id, loadChapter]);

  const isDark = theme === "dark";
  const handleBack = () => navigate("/library");

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
    setSummaryResult("Summarizing...");
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
      else setSummaryResult("Summary failed: " + result.error);
    } catch (err) {
      setSummaryResult("Sunucu hatası: " + err.message);
    }
  };

  const saveProgress = () => {
    localStorage.setItem(`readingProgress_${id}`, currentIndex);
    alert("Progress saved ✅");
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
                <Button variant={isDark ? "outline-light" : "outline-secondary"} onClick={() => setSummarySelectModal(true)}>📄 Summary</Button>
                <Button variant={isDark ? "outline-light" : "outline-secondary"} onClick={saveProgress}>Save</Button>
              </div>
            </Card.Header>

            <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: headerBg, color: textColor }}>
              <h4 className="mb-0" style={{ fontFamily: settings.fontFamily || 'Merriweather, serif' }}>
                {chapters[currentIndex]?.replace(".txt", "").replace(/_/g, " ")}
              </h4>
              <div className="d-flex gap-2">
                <Button size="sm" onClick={handlePrev} disabled={currentIndex === 0}>&larr; Previous</Button>
                <Button size="sm" onClick={handleNext} disabled={currentIndex === chapters.length - 1}>Next &rarr;</Button>
              </div>
            </div>

            <div style={{
              flex: 1,
              overflowY: "auto",
              maxHeight: "calc(100vh - 250px)",
              backgroundColor: contentBg,
              padding: "2.5rem 3rem",
              color: textColor
            }} className="custom-scroll">
              {loading ? (
                <Spinner animation="border" />
              ) : (
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    fontFamily: settings.fontFamily || "Georgia, serif",
                    fontSize: settings.fontSize === "small" ? "14px" :
                              settings.fontSize === "large" ? "22px" : "18px",
                    lineHeight: settings.lineHeight || 1.8,
                  }}
                >
                  {selectedContent}
                </pre>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Summary modal seçici */}
      <Modal show={summarySelectModal} onHide={() => setSummarySelectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Which chapter would you like to summarize?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select value={selectedChapterToSummarize} onChange={(e) => setSelectedChapterToSummarize(e.target.value)} className="mb-3">
            <option value="">Select a Chapter</option>
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
            Summarize
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={summaryModal} onHide={() => setSummaryModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chapter Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ whiteSpace: "pre-wrap", fontFamily: settings.fontFamily || 'Georgia, serif' }}>
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
