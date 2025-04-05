import React, { useState } from "react";
import { Card, Button, Row, Col, Form, Accordion } from "react-bootstrap";

function Library() {
  const allBooks = [
    { title: "The Alchemist", image: "https://picsum.photos/200/300?random=11" },
    { title: "1984", image: "https://picsum.photos/200/300?random=12" },
    { title: "Sapiens", image: "https://picsum.photos/200/300?random=13" },
    { title: "Atomic Habits", image: "https://picsum.photos/200/300?random=14" },
    { title: "Brave New World", image: "https://picsum.photos/200/300?random=15" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [myBookList, setMyBookList] = useState([]);

  const handleAddToList = (book) => {
    if (!myBookList.some((b) => b.title === book.title)) {
      setMyBookList([...myBookList, book]);
    }
  };

  return (
    <div className="text-white">
      <div
          className="text-center mb-4 p-3 mx-auto rounded-4 shadow-sm"
          style={{
            maxWidth: "400px",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(6px)",
          }}
        >
        <h2 style={{ fontSize: "2rem", color: "#fff", margin: 0 }}>
        📚 Library
        </h2>
      </div>

      {/* Search */}
      <Form className="mb-4 d-flex justify-content-center">
        <Form.Control
          type="text"
          placeholder="Search books..."
          style={{ width: "300px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      {/* Books */}
      <Row className="g-3 mb-4">
        {allBooks
          .filter((book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((book, index) => (
            <Col md={3} key={index}>
              <Card className="shadow-sm h-100">
                <Card.Img variant="top" src={book.image} />
                <Card.Body>
                  <Card.Title className="text-center">{book.title}</Card.Title>
                  <Button
                    variant="success"
                    className="w-100"
                    onClick={() => handleAddToList(book)}
                  >
                    Add to Booklist
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      {/* My Book List */}
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>📌 My Book List ({myBookList.length})</Accordion.Header>
          <Accordion.Body>
            {myBookList.length === 0 ? (
              <p>No books added yet.</p>
            ) : (
              <Row className="g-3">
                {myBookList.map((book, index) => (
                  <Col md={3} key={index}>
                    <Card className="shadow-sm h-100">
                      <Card.Img variant="top" src={book.image} />
                      <Card.Body>
                        <Card.Title className="text-center">{book.title}</Card.Title>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default Library;
