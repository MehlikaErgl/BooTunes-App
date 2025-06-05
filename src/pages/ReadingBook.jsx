import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Form,
  Spinner,
  Modal
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useUserSettings } from "../context/UserSettingsContext";
import {
  FiPlay,
  FiPause,
  FiPlus,
  FiSkipBack,
  FiSkipForward
} from "react-icons/fi";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState("general");
  const [showMenu, setShowMenu] = useState(false);
  const [fontSliderValue, setFontSliderValue] = useState(17);
  const [isAdded, setIsAdded] = useState(false);

  // **Yeni eklendi**: fade state'i
  const [fade, setFade] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();
  const { settings } = useUserSettings();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.body.dataset.theme || "light";
      setTheme(newTheme);
    });
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // loadChapter fonksiyonunu fade geçişi ile sarmaladık
  const loadChapter = useCallback(
    (filename) => {
      // 1) Önce fade-out (opacity 0)
      setFade(false);

      // 2) Kısa bir süre bekleyip (200ms) içeriği fetch edip fade-in yap
      setTimeout(() => {
        setLoading(true);
        fetch(`http://localhost:5000/api/chapters/${id}/${filename}`)
          .then((res) => res.json())
          .then((data) => {
            const normalized = data.content.replace(/\n{2,}/g, "\n");
            setSelectedContent(normalized);
            setLoading(false);
            // Yeni içerik yüklendikten sonra fade-in (opacity 1)
            setFade(true);
          })
          .catch((err) => {
            console.error("Bölüm yüklenemedi:", err);
            setLoading(false);
            setFade(true);
          });
      }, 200); // 200ms boyunca önceki içerik kaybolacak
    },
    [id]
  );

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/chapters/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setChapters(data);
        const saved = localStorage.getItem(`readingProgress_${id}`);
        const savedIndex = saved ? parseInt(saved, 10) : 0;
        if (data.length > 0) {
          setCurrentIndex(savedIndex);
          loadChapter(data[savedIndex]);
        }
      })
      .catch((err) => console.error("Bölümler alınamadı:", err));
  }, [id, loadChapter]);

  const isDark = theme === "dark";
  const handleBack = () => navigate("/library");
  const handlePlayPause = () => setIsPlaying((prev) => !prev);

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: contentBg,
        position: "relative"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          backgroundColor: headerBg,
          color: textColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          height: "50px",
          flexShrink: 0
        }}
      >
        <Button
          variant="link"
          onClick={handleBack}
          style={{
            position: "absolute",
            left: "10px",
            color: textColor,
            fontSize: "1.5rem"
          }}
        >
          ←
        </Button>
        <span style={{ fontSize: "1.1rem", fontWeight: 500 }}>
          Chapter {currentIndex + 1} / {chapters.length}
        </span>
        <div style={{ position: "absolute", right: "10px" }}>
          <Button
            variant={isDark ? "outline-light" : "outline-dark"}
            size="sm"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            ☰
          </Button>
        </div>
      </div>

      {/* MENÜ PANELİ */}
      {showMenu && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "10px",
            width: "220px",
            backgroundColor: isDark ? "#2c2c2c" : "#fff",
            color: isDark ? "#fff" : "#000",
            border: "1px solid #ccc",
            borderRadius: "0.5rem",
            zIndex: 2000,
            padding: "1rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}
        >
          <div className="d-flex flex-column gap-3">
            <Button
              size="sm"
              variant={isDark ? "outline-light" : "outline-dark"}
              onClick={() => {
                setShowMenu(false);
                setSummarySelectModal(true);
              }}
            >
              📄 Summary
            </Button>
            <div>
              <div className="mb-1">Font Size</div>
              <Form.Range
                min={12}
                max={28}
                step={1}
                value={fontSliderValue}
                onChange={(e) => setFontSliderValue(parseInt(e.target.value, 10))}
              />
              <div style={{ fontSize: "0.8rem" }}>Current: {fontSliderValue}px</div>
            </div>
            <div>
              <div>🖼 Image Preference</div>
              <small>(Not implemented yet)</small>
            </div>
            <Button
              size="sm"
              variant={isDark ? "outline-light" : "outline-dark"}
              onClick={saveProgress}
            >
              💾 Save Progress
            </Button>
          </div>
        </div>
      )}

      {/* İÇERİK ALANI */}
      <div
        style={{
          height: "calc(100% - 50px - 50px)",
          overflowY: "auto",
          padding: "1rem",
          backgroundColor: contentBg,
          color: textColor,
          // **Yeni eklendi**: opacity ve transition
          opacity: fade ? 1 : 0,
          transition: "opacity 0.3s ease-in-out"
        }}
        className="custom-scroll"
      >
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100%" }}
          >
            <Spinner animation="border" />
          </div>
        ) : (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: settings.fontFamily || "Georgia, serif",
              fontSize: `${fontSliderValue}px`,
              lineHeight: settings.lineHeight || 1.8,
              maxWidth: "900px",
              margin: "0 auto"
            }}
          >
            {selectedContent}
          </pre>
        )}
        {currentIndex > 0 && (
          <Button
            onClick={handlePrev}
            style={{
              position: "fixed",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              backgroundColor: "#444",
              color: "#fff",
              zIndex: 1000,
              border: "none"
            }}
          >
            <FiSkipBack size={24} />
          </Button>
        )}
        {currentIndex < chapters.length - 1 && (
          <Button
            onClick={handleNext}
            style={{
              position: "fixed",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              backgroundColor: "#444",
              color: "#fff",
              zIndex: 1000,
              border: "none"
            }}
          >
            <FiSkipForward size={24} />
          </Button>
        )}
      </div>

      {/* MÜZİK BARI */}
      <div
        className="position-fixed bottom-0 start-0 end-0 d-flex justify-content-between align-items-center px-3"
        style={{
          height: "50px",
          backgroundColor: "#000",
          color: "#fff",
          zIndex: 1200
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <img
            src="https://picsum.photos/200/200?random=31"
            alt="cover"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "0.5rem",
              objectFit: "cover"
            }}
          />
          <div>
            <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
              Locked Eyes
            </div>
            <div style={{ fontSize: "0.7rem", color: "#ccc" }}>
              Mystery Friends
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Button
            variant="outline-light"
            size="sm"
            style={{
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              padding: 0
            }}
          >
            <FiSkipBack size={16} />
          </Button>
          <Button
            variant="light"
            size="sm"
            onClick={handlePlayPause}
            style={{
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              padding: 0
            }}
          >
            {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} />}
          </Button>
          <Button
            variant="outline-light"
            size="sm"
            style={{
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              padding: 0
            }}
          >
            <FiSkipForward size={16} />
          </Button>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Form.Select
            size="sm"
            value={playlist}
            onChange={(e) => setPlaylist(e.target.value)}
            style={{
              maxWidth: "120px",
              backgroundColor: "#1f1f1f",
              color: "#fff",
              borderColor: "#333",
              borderRadius: "0.375rem",
              height: "30px",
              fontSize: "0.8rem"
            }}
          >
            <option value="general">🎵 General</option>
            <option value="my">🎶 My Playlist</option>
          </Form.Select>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => setIsAdded(true)}
            disabled={isAdded}
            style={{
              height: "30px",
              width: "50px",
              borderRadius: "0.375rem",
              fontSize: "0.75rem",
              padding: 0
            }}
          >
            <FiPlus size={16} />
          </Button>
        </div>
      </div>

      {/* ÖZET SEÇİM MODAL */}
      <Modal
        show={summarySelectModal}
        onHide={() => setSummarySelectModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Which chapter would you like to summarize?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select
            value={selectedChapterToSummarize}
            onChange={(e) => setSelectedChapterToSummarize(e.target.value)}
            className="mb-3"
          >
            <option value="">Select a Chapter</option>
            {chapters.map((ch, idx) => (
              <option key={idx} value={ch}>
                {ch.replace(".txt", "").replace(/_/g, " ")}
              </option>
            ))}
          </Form.Select>
          <Button
            onClick={() => {
              if (selectedChapterToSummarize) {
                setSummarySelectModal(false);
                requestSummary(selectedChapterToSummarize);
              }
            }}
            disabled={!selectedChapterToSummarize}
          >
            Summarize
          </Button>
        </Modal.Body>
      </Modal>

      {/* ÖZET SONUÇ MODAL */}
      <Modal
        show={summaryModal}
        onHide={() => setSummaryModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chapter Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            whiteSpace: "pre-wrap",
            fontFamily: settings.fontFamily || "Georgia, serif"
          }}
        >
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
    </div>
  );
}
