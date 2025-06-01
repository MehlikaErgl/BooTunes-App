// src/pages/Library.jsx

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

export default function Library() {
  // 1) Keep track of controlled inputs: title, imageUrl, pdfFile, etc.
  const [searchTerm, setSearchTerm] = useState("");
  const [myBookList, setMyBookList] = useState([]);
  const [title, setTitle] = useState("");            // Controlled book title
  const [imageUrl, setImageUrl] = useState("");      // Controlled image URL
  const [pdfFile, setPdfFile] = useState(null);      // Controlled PDF file
  const [isTitleConfirmed, setIsTitleConfirmed] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const navigate = useNavigate();

  // 2) Load current user's books on mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:5000/api/books?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setMyBookList(data))
      .catch((err) => console.error("Kitaplar alınamadı:", err));
  }, []);

  // 3) Handle file selection: set PDF file AND auto-fill the title field (filename minus extension)
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPdfFile(file);
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setTitle(nameWithoutExt);
    setIsTitleConfirmed(false);
    setImageUrl("");
  };

  // 4) When “Confirm Title” is clicked, call back-end to fetch an image URL via Puppeteer
  const handleConfirmTitle = async () => {
    if (!title.trim()) {
      alert("Lütfen önce bir başlık girin veya seçin.");
      return;
    }
    setLoadingImage(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/fetchImage?query=${encodeURIComponent(title)}`
      );
      if (!response.ok) {
        throw new Error("Resim getirilemedi.");
      }
      const data = await response.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        setIsTitleConfirmed(true);
      } else {
        throw new Error("Hiç resim bulunamadı.");
      }
    } catch (err) {
      console.error("❌ Resim alınamadı:", err);
      alert("Resim bulunamadı. Lütfen manuel olarak bir URL girin.");
    } finally {
      setLoadingImage(false);
    }
  };

  // 5) Handle final “Add Book” submission
  const handleBookSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !imageUrl.trim() || !pdfFile) {
      alert("Başlık, resim URL’si ve PDF dosyası gereklidir.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", imageUrl);
    formData.append("pdf", pdfFile);
    const userId = localStorage.getItem("userId");
    formData.append("userId", userId);

    fetch("http://localhost:5000/api/books", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((newBook) => {
        setMyBookList((prev) => [...prev, newBook]);
        // reset form to initial state
        setTitle("");
        setImageUrl("");
        setPdfFile(null);
        setIsTitleConfirmed(false);
        alert("Kitap eklendi ✅");
      })
      .catch((err) => {
        console.error("❌ Kitap eklenemedi:", err);
        alert("Kitap eklenemedi");
      });
  };

  const handleRemove = (id) => {
    fetch(`http://localhost:5000/api/books/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setMyBookList((prev) => prev.filter((book) => book._id !== id));
        }
      })
      .catch((err) => console.error("Silme hatası:", err));
  };

  // Filter for “My Books” tab
  const filteredBooks = myBookList.filter((book) =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* --- HEADER / FORM SECTION --- */}
      <Container fluid className="py-3" style={{ flexShrink: 0 }}>
        <h2 className="mb-3">📚 Library</h2>

        <Row className="justify-content-center mb-3">
          <Col xs={12} md={6} lg={4}>
            {/* --- SEARCH BAR --- */}
            <InputGroup className="mb-2">
              <FormControl
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="primary">🔍</Button>
            </InputGroup>

            {/* --- ADD NEW BOOK FORM --- */}
            <Form onSubmit={handleBookSubmit}>
              {/* FILE INPUT */}
              <Form.Label htmlFor="pdf-upload" className="mb-1">
                Choose PDF:
              </Form.Label>
              <Form.Control
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                className="mb-2"
                onChange={handlePdfChange}
                required
              />

              {/* TITLE INPUT */}
              <Form.Label htmlFor="book-title" className="mb-1">
                Book Title:
              </Form.Label>
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
                />
                <Button
                  variant={isTitleConfirmed ? "success" : "outline-secondary"}
                  disabled={!title.trim() || loadingImage}
                  onClick={handleConfirmTitle}
                >
                  {loadingImage ? (
                    <Spinner animation="border" size="sm" />
                  ) : isTitleConfirmed ? (
                    "✓ Confirmed"
                  ) : (
                    "Confirm Title"
                  )}
                </Button>
              </InputGroup>

              {/* IMAGE URL INPUT */}
              <Form.Label htmlFor="image-url" className="mb-1">
                Image URL:
              </Form.Label>
              <FormControl
                id="image-url"
                name="image"
                value={imageUrl}
                placeholder="Will be auto-filled after confirming title"
                onChange={(e) => setImageUrl(e.target.value)}
                className="mb-2"
                required
              />

              {/* FINAL SUBMIT */}
              <Button
                type="submit"
                variant="success"
                className="w-100"
                //disabled={!isTitleConfirmed || !imageUrl.trim() || !pdfFile}
              >
                ➕ Add Book
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>

      {/* --- LIST OF BOOKS WITH HORIZONTAL SCROLL --- */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Tabs
          defaultActiveKey="mybooks"
          id="tabs"
          className="mb-3"
          style={{ flexShrink: 0 }}
        >
          <Tab
            eventKey="mybooks"
            title={
              <span>
                My Books <Badge bg="success">{myBookList.length}</Badge>
              </span>
            }
          />
        </Tabs>

        {/* Horizontal scroll container */}
        <div
          style={{
            flex: 1,
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "nowrap",
            padding: "0 1rem"
          }}
        >
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              style={{
                display: "inline-block",
                verticalAlign: "top",
                width: "180px",
                marginRight: "1rem",
                marginBottom: "1rem"
              }}
            >
              <Card className="h-100 d-flex flex-column shadow-sm">
                <div
                  style={{
                    width: "100%",
                    height: "140px",
                    overflow: "hidden",
                    borderTopLeftRadius: "0.25rem",
                    borderTopRightRadius: "0.25rem"
                  }}
                >
                  <Card.Img
                    src={book.image}
                    alt={book.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
                <Card.Body className="d-flex flex-column p-2">
                  <Card.Title
                    className="text-center"
                    style={{
                      fontSize: "0.9rem",
                      whiteSpace: "normal",
                      lineHeight: "1.2"
                    }}
                  >
                    {book.title}
                  </Card.Title>
                  <div className="mt-auto d-grid gap-1">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/readingbook/${book._id}`)}
                    >
                      📖 Read
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemove(book._id)}
                    >
                      ❌ Remove
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}