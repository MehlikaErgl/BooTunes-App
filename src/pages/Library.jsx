import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  InputGroup,
  FormControl,
  Badge,
  Tabs,
  Tab,
  Form,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUserSettings } from "../context/UserSettingsContext";

export default function Library() {
  const { settings } = useUserSettings();
  const { fontSize, fontFamily, lineHeight } = settings;

  const [searchTerm, setSearchTerm] = useState("");
  const [myBookList, setMyBookList] = useState([]);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [isTitleConfirmed, setIsTitleConfirmed] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const navigate = useNavigate();

  const fetchMyBooks = () => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:5000/api/books?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setMyBookList(data))
      .catch((err) => console.error("Kitaplar alınamadı:", err));
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPdfFile(file);
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setTitle(nameWithoutExt);
    setIsTitleConfirmed(false);
    setImageUrl("");
  };

  const handleConfirmTitle = async () => {
    if (!title.trim()) {
      alert("Lütfen başlık girin.");
      return;
    }
    setLoadingImage(true);
    try {
      const response = await fetch(`http://localhost:5000/api/fetchImage?query=${encodeURIComponent(title)}`);
      const data = await response.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        setIsTitleConfirmed(true);
      } else throw new Error("Resim bulunamadı.");
    } catch (err) {
      console.error("❌ Resim alınamadı:", err);
      alert("Resim alınamadı, lütfen manuel girin.");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim() || !pdfFile) {
      alert("Başlık, resim ve PDF zorunludur.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", imageUrl);
    formData.append("pdf", pdfFile);
    formData.append("userId", localStorage.getItem("userId"));

    fetch("http://localhost:5000/api/books", {
      method: "POST",
      body: formData
    })
      .then((res) => res.json())
      .then(() => {
        fetchMyBooks();
        setTitle("");
        setImageUrl("");
        setPdfFile(null);
        setIsTitleConfirmed(false);
        alert("Kitap başarıyla eklendi ✅");
      })
      .catch((err) => {
        console.error("❌ Kitap eklenemedi:", err);
        alert("Kitap eklenemedi");
      });
  };

  const handleRemove = (id) => {
    fetch(`http://localhost:5000/api/books/${id}`, {
      method: "DELETE"
    })
      .then((res) => {
        if (res.ok) {
          setMyBookList((prev) => prev.filter((book) => book._id !== id));
        }
      })
      .catch((err) => console.error("Silme hatası:", err));
  };

  const filteredBooks = myBookList.filter((book) =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#121212",
        color: "#f1f1f1",
        fontFamily,
        fontSize,
        lineHeight
      }}
    >
      <Container fluid className="py-3" style={{ flexShrink: 0 }}>
        <h2 className="mb-3">📚 Library</h2>

        <Row className="justify-content-center mb-3">
          <Col xs={12} md={6} lg={4}>
            <InputGroup className="mb-2">
              <FormControl
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ backgroundColor: '#2a2a2a', color: '#f1f1f1', border: '1px solid #555' }}
              />
              <Button variant="primary">🔍</Button>
            </InputGroup>

            <Form onSubmit={handleBookSubmit}>
              <Form.Label htmlFor="pdf-upload">Choose PDF:</Form.Label>
              <Form.Control
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                className="mb-2"
                onChange={handlePdfChange}
                required
                style={{ backgroundColor: '#2a2a2a', color: '#f1f1f1', border: '1px solid #555' }}
              />

              <Form.Label htmlFor="book-title">Book Title:</Form.Label>
              <InputGroup className="mb-2">
                <FormControl
                  id="book-title"
                  name="title"
                  value={title}
                  placeholder="Type or confirm title"
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setIsTitleConfirmed(false);
                    setImageUrl("");
                  }}
                  required
                  style={{ backgroundColor: '#2a2a2a', color: '#f1f1f1', border: '1px solid #555' }}
                />
                <Button
                  variant={isTitleConfirmed ? "success" : "outline-secondary"}
                  disabled={!title.trim() || loadingImage}
                  onClick={handleConfirmTitle}
                >
                  {loadingImage ? <Spinner animation="border" size="sm" /> : isTitleConfirmed ? "✓ Confirmed" : "Confirm Title"}
                </Button>
              </InputGroup>

              <Form.Label htmlFor="image-url">Image URL:</Form.Label>
              <FormControl
                id="image-url"
                name="image"
                value={imageUrl}
                placeholder="Auto-filled or paste manually"
                onChange={(e) => setImageUrl(e.target.value)}
                className="mb-2"
                required
                style={{ backgroundColor: '#2a2a2a', color: '#f1f1f1', border: '1px solid #555' }}
              />

              <Button type="submit" variant="success" className="w-100">➕ Add Book</Button>
            </Form>
          </Col>
        </Row>
      </Container>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Tabs defaultActiveKey="mybooks" className="mb-3">
          <Tab eventKey="mybooks" title={<span>My Books <Badge bg="success">{myBookList.length}</Badge></span>} />
        </Tabs>

        <div style={{ flex: 1, overflowX: "auto", overflowY: "hidden", whiteSpace: "nowrap", padding: "0 1rem" }}>
          {filteredBooks.map((book) => (
            <div key={book._id} style={{ display: "inline-block", verticalAlign: "top", width: "180px", marginRight: "1rem", marginBottom: "1rem" }}>
              <Card className="h-100 d-flex flex-column shadow-sm" style={{ backgroundColor: "#1c1c1c", color: "#f1f1f1" }}>
                <Card.Img variant="top" src={book.image} style={{ height: "140px", objectFit: "cover" }} />
                <Card.Body className="d-flex flex-column p-2">
                  <Card.Title className="text-center" style={{ fontSize: "0.9rem", whiteSpace: "normal" }}>{book.title}</Card.Title>
                  <div className="mt-auto d-grid gap-1">
                    <Button variant="outline-primary" size="sm" onClick={() => navigate(`/readingbook/${book._id}`)}>📖 Read</Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleRemove(book._id)}>❌ Remove</Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        input[type="file"]::file-selector-button {
          background-color: #444;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 5px;
        }
        .nav-tabs .nav-link.active {
          background-color: #444 !important;
          color: white !important;
          border-color: #444 !important;
        }
        .nav-tabs .nav-link {
          color: #aaa;
        }
      `}</style>
    </div>
  );
}
