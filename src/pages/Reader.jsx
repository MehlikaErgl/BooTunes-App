import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";

export default function Reader() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/books/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Kitap bulunamadı");
        return res.json();
      })
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Yükleniyor...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h3 className="mb-3">📖 {book.title}</h3>
      {book.pdfUrl ? (
        <iframe
          src={`http://localhost:5000${book.pdfUrl}`}
          title="PDF Viewer"
          width="100%"
          height="650px"
          style={{ border: "1px solid #ccc", borderRadius: "10px" }}
        />
      ) : (
        <Alert variant="warning">PDF bulunamadı</Alert>
      )}
    </Container>
  );
}
