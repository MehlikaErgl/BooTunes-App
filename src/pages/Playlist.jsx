// File: src/pages/Playlist.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert
} from "react-bootstrap";
import { FiPlay, FiPause, FiX } from "react-icons/fi";
import { useUserSettings } from "../context/UserSettingsContext";

// Mood list with gradient backgrounds
const moods = [
  { name: "Tense", gradient: "linear-gradient(135deg,#b71c1c,#880e4f)" },
  { name: "Excited", gradient: "linear-gradient(135deg,#ffeb3b,#ff9800)" },
  { name: "Delighted", gradient: "linear-gradient(135deg,#f48fb1,#ce93d8)" },
  { name: "Tired", gradient: "linear-gradient(135deg,#757575,#424242)" },
  { name: "Happy", gradient: "linear-gradient(135deg,#ffeb3b,#cddc39)" },
  { name: "Calm", gradient: "linear-gradient(135deg,#4fc3f7,#81d4fa)" },
  { name: "Frustrated", gradient: "linear-gradient(135deg,#ff7043,#d84315)" },
  { name: "Bored", gradient: "linear-gradient(135deg,#cfd8dc,#90a4ae)" },
  { name: "Content", gradient: "linear-gradient(135deg,#a5d6a7,#66bb6a)" },
  { name: "Angry", gradient: "linear-gradient(135deg,#e53935,#b71c1c)" },
  { name: "Relaxed", gradient: "linear-gradient(135deg,#80cbc4,#4db6ac)" },
  { name: "Depressed", gradient: "linear-gradient(135deg,#37474f,#263238)" },
];

export default function Playlist() {
  const [theme, setTheme] = useState(
    document.body.getAttribute("data-theme") || "light"
  );
  const { fontSize, fontFamily, lineHeight } = useUserSettings();

  // myPlaylist: { title, artist, image, url, mood } dizisi
  const [myPlaylist, setMyPlaylist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("myPlaylist")) || [];
    } catch {
      return [];
    }
  });

  // Seçili mood ve ona ait parçalar
  const [selectedMood, setSelectedMood] = useState(null);
  const filtered = selectedMood
    ? myPlaylist.filter((s) => s.mood === selectedMood)
    : [];

  // Çalan şarkı ve oynatma durumu
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Seek bar için
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Audio referansı
  const audioRef = useRef(new Audio());
  const audio = audioRef.current;

  // Scroll refs
  const containerRef = useRef(null);
  const tracksRef = useRef(null);

  // Tema dinleyicisi
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.getAttribute("data-theme") || "light");
    });
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("myPlaylist", JSON.stringify(myPlaylist));
  }, [myPlaylist]);

  // Audio metadata & timeupdate event'leri
  useEffect(() => {
    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
    };
  }, [currentSong]);

  // 1) Only when the track changes do we assign audio.src:
  useEffect(() => {
    if (!currentSong) return;
    audio.src = currentSong.url;
  }, [currentSong]);

  // 2) Play / pause without ever reassigning the src:
  useEffect(() => {
    if (!currentSong) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const isDark = theme === "dark";
  const textColor = isDark ? "#f1f1f1" : "#000";
  const blurBox = {
    backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#f0f0f0",
    backdropFilter: "blur(6px)",
  };

  // Mood seçildiğinde aşağı kaydır
  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
    setTimeout(() => {
      if (tracksRef.current) {
        tracksRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  const handlePlayPause = (song) => {
    if (currentSong?.url === song.url) {
      setIsPlaying((p) => !p);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleRemove = (song) => {
    setMyPlaylist((pl) => pl.filter((s) => s.url !== song.url));
    // Eğer şu anda silinen şarkı çalıyorsa durdur
    if (currentSong?.url === song.url) {
      setIsPlaying(false);
      setCurrentSong(null);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        color: textColor,
        fontFamily,
        fontSize,
        lineHeight,
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4" style={{ flexShrink: 0 }}>
        <h2 className="fw-bold text-center py-3 px-4 rounded" style={blurBox}>
          🎶 Browse by Mood
        </h2>
      </div>

      {/* Main */}
      <Container
        fluid
        style={{
          overflowY: "auto",
          flex: 1,
          padding: "1rem 2rem",
          marginBottom: "80px"      // ← burada alt boşluk
        }}
      >
        {/* Mood Cards */}
        <Row className="mb-4 justify-content-center">
          {moods.map((m) => (
            <Col xs={6} sm={4} md={3} lg={2} key={m.name} className="mb-3">
              <Card
                onClick={() => handleMoodClick(m.name)}
                className="shadow-sm text-center p-3"
                style={{
                  cursor: "pointer",
                  background: m.gradient,
                  color: "#fff",
                  height: "120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Card.Title style={{ fontSize: "1rem" }}>{m.name}</Card.Title>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Tracks Section */}
        <div ref={tracksRef}>
          {/* İçeriğin sabit bir yüksekliği ve overflowY: auto */}
          <div
          style={{
              maxHeight: "calc(100vh - 250px)",
              overflowY: "auto",
              paddingRight: "1rem"
            }}
          >
          <h4 className="mb-3">{selectedMood || "Select a Mood"} Tracks</h4>
          {selectedMood && filtered.length === 0 && (
            <Alert variant="info">No tracks in your playlist for this mood.</Alert>
          )}
          {selectedMood && filtered.length > 0 && (
            <Row>
              {filtered.map((song, idx) => (
                <Col md={6} key={idx} className="mb-3">
                  <Card
                    className="d-flex flex-row align-items-center shadow-sm p-2"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.08)"
                        : "#fff",
                      color: textColor,
                    }}
                  >
                    <img
                      src={song.image || `https://picsum.photos/seed/${song.file}/80/80`}
                      alt={song.title}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="ms-3 flex-grow-1">
                      <h6 className="mb-1">{song.title}</h6>
                      <small className="text-muted">{song.artist}</small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Button
                        variant="outline-light"
                        onClick={() => handlePlayPause(song)}
                      >
                        {currentSong?.url === song.url && isPlaying ? (
                          <FiPause size={18} />
                        ) : (
                          <FiPlay size={18} />
                        )}
                      </Button>
                      <Button
                        variant="outline-light"
                        onClick={() => handleRemove(song)}
                      >
                        <FiX size={18} />
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          </div>
        </div>
      </Container>

      {/* Spotify-Style Music Bar with Seek */}
      {currentSong && (
        <div
          className="position-fixed bottom-0 start-0 end-0 d-flex align-items-center px-3"
          style={{
            height: "70px",
            backgroundColor: isDark ? "#111" : "#eee",
            zIndex: 1200,
          }}
        >
          <div className="d-flex align-items-center gap-3">
            
            <div>
              <div style={{ fontSize: "0.9rem" }}>{currentSong.title}</div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: isDark ? "#ccc" : "#666",
                }}
              >
                {currentSong.artist}
              </div>
            </div>
          </div>

          {/* Seek Bar */}
          <div style={{ flexGrow: 1, margin: "0 1rem" }}>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => {
                const t = parseFloat(e.target.value);
                audio.currentTime = t;
                setCurrentTime(t);
              }}
              style={{ width: "100%" }}
            />
            <div style={{ fontSize: "0.75rem", textAlign: "right", color: isDark ? "#888" : "#444" }}>
              {Math.floor(currentTime)}/{Math.floor(duration)}s
            </div>
          </div>

          <Button
            variant={isDark ? "outline-light" : "outline-dark"}
            onClick={() => setIsPlaying((p) => !p)}
            style={{ borderRadius: "50%", width: 40, height: 40 }}
          >
            {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
          </Button>
        </div>
      )}
    </div>
  );
}
