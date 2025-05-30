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
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [myBookList, setMyBookList] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:5000/api/books?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setMyBookList(data))
      .catch((err) => console.error("Kitaplar alınamadı:", err));
  }, []);

  const handleBookSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userId = localStorage.getItem("userId");
    formData.append("userId", userId);
    formData.append("pdf", pdfFile);

    fetch("http://localhost:5000/api/books", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((newBook) => {
        setMyBookList((prev) => [...prev, newBook]);
        e.target.reset();
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
      <Container fluid className="py-3">
        <h2 className="mb-3">📚 Library</h2>

        <Row className="justify-content-center mb-3">
          <Col xs={12} md={6} lg={4}>
            <InputGroup className="mb-2">
              <FormControl
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="primary">🔍</Button>
            </InputGroup>

          
          </Col>
        </Row>
      </Container>

      <div style={{ flex: 1, overflowY: "auto", padding: "1rem 2rem" }}>
        <Tabs defaultActiveKey="mybooks" id="tabs" className="mb-3">
          <Tab
            eventKey="mybooks"
            title={
              <span>
                My Books <Badge bg="success">{myBookList.length}</Badge>
              </span>
            }
          >
            <Row className="gx-4 gy-4">
              {filteredBooks.map((book) => (
                <Col xs={12} sm={6} md={4} lg={3} key={book._id}>
                  <Card className="h-100 d-flex flex-column shadow-sm">
                    <Card.Img
                      src={book.image}
                      alt={book.title}
                      style={{
                        height: "160px", // Görsel küçültüldü
                        objectFit: "cover",
                      }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="text-center">{book.title}</Card.Title>
                      <div className="mt-auto d-grid gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/reader/${book._id}`)}
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
                </Col>
              ))}
            </Row>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
