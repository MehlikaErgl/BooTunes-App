import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Reader() {
  const navigate = useNavigate();

  const recommendedBooks = [
    { title: "Brave New World", image: "https://picsum.photos/200/300?random=16" },
    { title: "Sapiens", image: "https://picsum.photos/200/300?random=17" },
  ];

  return (
    <div className="text-white">
      <h2 className="text-center mb-4" style={{ fontSize: "2rem", textShadow: "1px 1px #000" }}>
        📖 Book Reader
      </h2>

      {/* Chapter Section */}
      <Row className="g-3 mb-4">
        <Col md={12}>
          <Card className="shadow-sm p-3">
            <Card.Title>Chapter 4: The Journey</Card.Title>
            <Card.Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Phasellus
              feugiat nisl nec elit vulputate, vel malesuada metus varius.
            </Card.Text>
            <Button variant="primary" onClick={() => navigate("/Readingbook")}>Read</Button>
          </Card>
        </Col>
      </Row>

      {/* Book Recommendations */}
      <h4 className="mb-3">📌 Book Recommendations</h4>
      <Row className="g-3">
        {recommendedBooks.map((book, index) => (
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
    </div>
  );
}

export default Reader;
