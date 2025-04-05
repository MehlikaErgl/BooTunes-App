import React, { useState } from "react";
import { Card, Button, Row, Col, Form, Accordion } from "react-bootstrap";

function Playlist() {
  const allPlaylists = [
    { title: "Lo-fi Study", image: "https://picsum.photos/100/100?random=21" },
    { title: "Chill Vibes", image: "https://picsum.photos/100/100?random=22" },
    { title: "Jazz Classics", image: "https://picsum.photos/100/100?random=23" },
    { title: "Piano Relax", image: "https://picsum.photos/100/100?random=24" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [myPlaylist, setMyPlaylist] = useState([]);

  const handleAddToList = (track) => {
    if (!myPlaylist.some((t) => t.title === track.title)) {
      setMyPlaylist([...myPlaylist, track]);
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
          🎵 Playlist Library
        </h2>
      </div>


      {/* Search */}
      <Form className="mb-4 d-flex justify-content-center">
        <Form.Control
          type="text"
          placeholder="Search playlists..."
          style={{ width: "300px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      <Row>
        {/* General Playlist Section */}
        <Col md={8}>
          <Row className="g-3 mb-4">
            {allPlaylists
              .filter((track) =>
                track.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((track, index) => (
                <Col md={6} key={index}>
                  <Card className="shadow-sm d-flex flex-row align-items-center p-2 h-100">
                    <Card.Img
                      src={track.image}
                      style={{ width: "80px", height: "80px", borderRadius: "12px" }}
                      className="me-3"
                    />
                    <Card.Body>
                      <Card.Title>{track.title}</Card.Title>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleAddToList(track)}
                      >
                        Add to My Playlist
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </Col>

        {/* My Playlist Section */}
        <Col md={4}>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                ⭐ My Playlist ({myPlaylist.length})
              </Accordion.Header>
              <Accordion.Body>
                {myPlaylist.length === 0 ? (
                  <p>No tracks added yet.</p>
                ) : (
                  <Row className="g-2">
                    {myPlaylist.map((track, index) => (
                      <Col md={12} key={index}>
                        <Card className="shadow-sm d-flex flex-row align-items-center p-2">
                          <Card.Img
                            src={track.image}
                            style={{ width: "60px", height: "60px", borderRadius: "10px" }}
                            className="me-2"
                          />
                          <Card.Body>
                            <Card.Title style={{ fontSize: "1rem" }}>{track.title}</Card.Title>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </div>
  );
}

export default Playlist;
