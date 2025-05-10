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
} from "react-bootstrap";
import { motion } from "framer-motion";

export default function Library() {
  const allBooks = [
    { title: "The Alchemist", image: "https://picsum.photos/300/400?random=11" },
    { title: "1984", image: "https://picsum.photos/300/400?random=12" },
    { title: "Sapiens", image: "https://picsum.photos/300/400?random=13" },
    { title: "Atomic Habits", image: "https://picsum.photos/300/400?random=14" },
    { title: "Brave New World", image: "https://picsum.photos/300/400?random=15" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [myBookList, setMyBookList] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.getAttribute("data-theme") || "light");
    });
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === "dark";

  const handleAddToList = (book) => {
    if (!myBookList.some((b) => b.title === book.title)) {
      setMyBookList([...myBookList, book]);
    }
  };

  const handleRemoveFromList = (book) => {
    setMyBookList(myBookList.filter((b) => b.title !== book.title));
  };

  const filteredBooks = allBooks.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container
      fluid
      className="py-4 px-3"
      style={{
        height: "calc(100vh - 20vh)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundColor: isDark ? "rgba(51, 46, 46, 0.4)" : undefined,
        backdropFilter: isDark ? "blur(6px)" : undefined,
        color: isDark ? "#eee" : "#000",
      }}
    >
      <div
        className="d-inline-block p-2 mb-3 rounded"
        style={{
          backdropFilter: "blur(5px)",
          backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(153,152,152,0.5)"
        }}
      >
        <h2 className={`mb-0 ${isDark ? "text-light" : "text-dark"}`}>Library 📚</h2>
      </div>

      <Row className="justify-content-center mb-3">
        <Col xs={12} md={6} lg={4}>
          <InputGroup>
            <FormControl
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: isDark ? "#6a6a6a" : undefined,
                color: isDark ? "#eee" : undefined,
                border: isDark ? "1px solid #555" : undefined
              }}
            />
            <Button variant="primary">🔍</Button>
          </InputGroup>
        </Col>
      </Row>

      <div
        style={{
          overflowY: "auto",
          flexGrow: 1,
          paddingRight: "0.5rem",
          scrollbarColor: isDark ? "#999 #333" : undefined,
          scrollbarWidth: "thin"
        }}
        className={isDark ? "dark-scrollbar" : ""}
      >
        <Tabs
          defaultActiveKey="all"
          id="library-tabs"
          className="mb-3 justify-content-center"
          variant={isDark ? "pills" : undefined}
        >
          <Tab
            eventKey="all"
            title={
              <span>
                All Books <Badge bg="secondary">{filteredBooks.length}</Badge>
              </span>
            }
          >
            <Row className="gx-4 gy-4 mt-2">
              {filteredBooks.map((book, idx) => (
                <Col xs={12} sm={6} md={4} lg={3} key={idx}>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Card
                      className="h-100 shadow"
                      style={{
                        border: "none",
                        borderRadius: "0.75rem",
                        backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#fff",
                        color: isDark ? "#f1f1f1" : "#000"
                      }}
                    >
                      <Card.Img
                        src={book.image}
                        alt={book.title}
                        style={{
                          height: "220px",
                          objectFit: "cover",
                          borderRadius: "0.75rem 0.75rem 0 0"
                        }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className={`mb-3 ${isDark ? "text-light" : "text-dark"}`}>{book.title}</Card.Title>
                        <Button
                          variant="outline-success"
                          onClick={() => handleAddToList(book)}
                          disabled={myBookList.some((b) => b.title === book.title)}
                          className="mt-auto"
                        >
                          {myBookList.some((b) => b.title === book.title)
                            ? "Added"
                            : "Add to Booklist"}
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Tab>

          <Tab
            eventKey="mylist"
            title={
              <span>
                My List <Badge bg="success">{myBookList.length}</Badge>
              </span>
            }
          >
            {myBookList.length === 0 ? (
              <p className={`text-center mt-4 ${isDark ? "text-light" : "text-muted"}`}>No books added yet.</p>
            ) : (
              <Row className="gx-4 gy-4 mt-3">
                {myBookList.map((book, idx) => (
                  <Col xs={12} sm={6} md={4} lg={3} key={idx}>
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Card
                        className="h-100 shadow"
                        style={{
                          border: "none",
                          borderRadius: "0.75rem",
                          backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#fff",
                          color: isDark ? "#f1f1f1" : "#000"
                        }}
                      >
                        <Card.Img
                          src={book.image}
                          alt={book.title}
                          style={{
                            height: "220px",
                            objectFit: "cover",
                            borderRadius: "0.75rem 0.75rem 0 0"
                          }}
                        />
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="text-center mb-3">{book.title}</Card.Title>
                          <Button
                            variant="outline-danger"
                            onClick={() => handleRemoveFromList(book)}
                            className="mt-auto"
                          >
                            Remove from List
                          </Button>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
}
