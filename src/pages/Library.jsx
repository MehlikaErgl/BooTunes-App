import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  InputGroup,
  FormControl,
  Form,
  Spinner,
  Modal
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
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
  const [theme, setTheme] = useState(document.body.getAttribute("data-theme") || "light");
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const navigate = useNavigate();
  const isDark = theme === "dark";

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.getAttribute("data-theme") || "light");
    });
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

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
      setModalMessage("Please enter a title.");
      return;
    }
    setLoadingImage(true);
    try {
      const response = await fetch(`http://localhost:5000/api/fetchImage?query=${encodeURIComponent(title)}`);
      const data = await response.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        setIsTitleConfirmed(true);
      } else throw new Error("Image not found.");
    } catch (err) {
      console.error("❌Image cannot found:", err);
      setModalMessage("Image cannot be found, please enter manually.");
    } finally {
      setLoadingImage(false);
    }
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim() || !pdfFile) {
      setModalMessage("Title, image and PDF are required.");
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
        setModalMessage("Book uploaded successfully ✅");
      })
      .catch((err) => {
        console.error("❌Book cannot be uploaded:", err);
        setModalMessage("Book cannot be uploaded");
      });
  };

  const handleRemove = (id) => {
    setSelectedBookId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:5000/api/books/${selectedBookId}`, {
      method: "DELETE"
    })
      .then((res) => {
        if (res.ok) {
          setMyBookList((prev) => prev.filter((book) => book._id !== selectedBookId));
        }
      })
      .catch((err) => console.error("Deleting Error:", err))
      .finally(() => {
        setShowDeleteModal(false);
        setSelectedBookId(null);
      });
  };

  const filteredBooks = myBookList.filter((book) =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const blurStyle = {
    backdropFilter: "blur(6px)",
    backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(200,200,200,0.66)",
    padding: "1rem",
    borderRadius: "10px"
  };

  const cardBg = isDark ? "rgba(255,255,255,0.6)" : "#ccc";
  const buttonColor = isDark ? "#000000" : "#000"; // Aydınlık modda lacivert yerine siyah
  const searchBorderColor = isDark ? "#ccc" : "#000"; // Aydınlık modda lacivert yerine siyah
  const textColor = isDark ? "#f1f1f1" : "#000"; // Aydınlık modda siyah
  const contentBg = isDark ? "rgba(51, 46, 46, 0.4)" : undefined;
  const cardBorderColor = isDark ? "#cccccc" : "#001f3f";

  return (
    <Container
  fluid
  className="py-4 px-4"
  style={{
    minHeight: "100vh",
    backgroundColor: contentBg,
    color: textColor,
    fontFamily,
    fontSize,
    lineHeight,
    overflowY: "auto"
  }}
>
  <div className="text-center mb-3">
    <Button
      variant="outline-primary"
      className="px-4 py-2"
      onClick={() => setShowUploadPanel(!showUploadPanel)}
      style={{
        backgroundColor: isDark ? "#f0f0f0" : "#001f3f",
        borderColor: isDark ? "#f0f0f0" : "#001f3f",
        color: isDark ? "#111" : "#fff",
        fontWeight: "bold"
      }}
    >
      📤 Upload Book
    </Button>
  </div>

  <div style={{ width: "100%", paddingBottom: "50px" }}>
    <AnimatePresence>
      {showUploadPanel && (
        <motion.div
          key="uploadPanel"
          initial={{ opacity: 0, height: 0, scaleY: 0.9 }}
          animate={{ opacity: 1, height: "auto", scaleY: 1 }}
          exit={{ opacity: 0, height: 0, scaleY: 0.9 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="mb-4"
          style={{ overflow: "hidden" }}
        >
          <Form onSubmit={handleBookSubmit} style={blurStyle}>
            <Row>
              <Col md={6}>
                <Form.Label>Choose PDF:</Form.Label>
                <Form.Control type="file" accept="application/pdf" onChange={handlePdfChange} required />
              </Col>
              <Col md={6}>
                <Form.Label>Book Title:</Form.Label>
                <InputGroup>
                  <FormControl
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setIsTitleConfirmed(false);
                      setImageUrl("");
                    }}
                    required
                  />
                  <Button onClick={handleConfirmTitle} disabled={!title.trim() || loadingImage}>
                    {loadingImage ? <Spinner animation="border" size="sm" /> : isTitleConfirmed ? "✓" : "Confirm"}
                  </Button>
                </InputGroup>
              </Col>
            </Row>
            <Form.Label className="mt-3">Image URL:</Form.Label>
            <FormControl
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
            <div style={{ fontSize: "0.85rem", marginTop: "5px", marginBottom: "5px", color: isDark ? "#fff" : "#001f3f" }}>
              *You can manually add the book cover image URL or click Confirm to auto-generate one.
            </div>
            <div className="d-flex justify-content-center">
              <Button
                type="submit"
                className="mt-2"
                style={{
                  width: "160px",
                  backgroundColor: "#e6f2ff",
                  borderColor: "#b3d9ff",
                  borderWidth: "2px",
                  color: "#001f3f",
                  fontWeight: "bold"
                }}
              >
                ➕ Add Book
              </Button>
            </div>
          </Form>
        </motion.div>
      )}
    </AnimatePresence>

    <Row className="justify-content-center mb-3">
      <Col xs={12} md={6} lg={4}>
        <InputGroup>
          <FormControl
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              backgroundColor: isDark ? "#fff" : "#eaeaea",
              color: "#001f3f",
              border: `2px solid ${searchBorderColor}`
            }}
          />
          <Button
            style={{
              backgroundColor: isDark ? "#555" : buttonColor,
              borderColor: isDark ? "#555" : buttonColor
            }}
          >
            🔍
          </Button>
        </InputGroup>
      </Col>
    </Row>

    <Row className="gx-4 gy-4">
      {filteredBooks.map((book) => (
        <Col xs={12} sm={6} md={4} lg={3} key={book._id}>
          <Card style={{ backgroundColor: cardBg, color: textColor, height: "100%", maxHeight: "400px", border: `2px solid ${cardBorderColor}`, borderRadius: "7px" }}>
            <Card.Img
              variant="top"
              src={book.image}
              style={{ height: "200px", objectFit: "cover" }}
            />
            <Card.Body className="d-flex flex-column align-items-center">
              <Card.Title className="text-center">{book.title}</Card.Title>
              <Button
                variant="outline-primary"
                className="mb-2"
                onClick={() => navigate(`/readingbook/${book._id}`)}
                style={{ fontWeight: "bold", width: "150px", borderWidth: "2px", marginTop: 10 }}
              >
                📖 Read
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => handleRemove(book._id)}
                style={{ fontWeight: "bold", width: "150px", borderWidth: "2px" }}
              >
                Remove
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </div>

  <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
    <div
      style={{
        backgroundColor: isDark ? "rgba(0, 31, 63, 0.9)" : "#fff",
        borderRadius: "7px",
        padding: "1rem",
        color: isDark ? "#fff" : "#000"
      }}
    >
      <Modal.Header closeButton style={{ border: "none", backgroundColor: "transparent" }}>
        <Modal.Title className="text-center w-100">Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        Are you sure you want to delete this book?
      </Modal.Body>
      <Modal.Footer className="justify-content-center" style={{ backgroundColor: "transparent", borderTop: "none" }}>
        <Button variant="danger" onClick={confirmDelete}>Yes, Remove</Button>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)} className="ms-3">Cancel</Button>
      </Modal.Footer>
    </div>
  </Modal>

</Container>

  );
}