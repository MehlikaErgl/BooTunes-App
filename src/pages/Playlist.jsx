import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  FormControl,
  InputGroup,
  Alert,
} from "react-bootstrap";
import jazzPhoto from "../assets/jazz.png";
import chillPhoto from "../assets/chill.png";
import classicPhoto from "../assets/classic.png";
import popPhoto from "../assets/pop.png";
import rockPhoto from "../assets/rock.png";

const categories = [
  { name: "Jazz", image: jazzPhoto },
  { name: "Chill", image: chillPhoto },
  { name: "Pop", image: popPhoto },
  { name: "Rock", image: rockPhoto },
  { name: "Classical", image: classicPhoto },
];

const allSongs = {
  Jazz: [
    { title: "Autumn Leaves", artist: "Bill Evans" },
    { title: "So What", artist: "Miles Davis" },
  ],
  Chill: [
    { title: "Ocean Eyes", artist: "Billie Eilish" },
    { title: "Weightless", artist: "Marconi Union" },
  ],
  Pop: [
    { title: "Blinding Lights", artist: "The Weeknd" },
    { title: "Levitating", artist: "Dua Lipa" },
  ],
  Rock: [
    { title: "Bohemian Rhapsody", artist: "Queen" },
    { title: "Smells Like Teen Spirit", artist: "Nirvana" },
  ],
  Classical: [
    { title: "Clair de Lune", artist: "Debussy" },
    { title: "Symphony No. 5", artist: "Beethoven" },
  ],
};

function getRandomImageUrl() {
  return `https://picsum.photos/80/80?random=${Math.floor(Math.random() * 1000)}`;
}

function Playlist() {
  const [showMyPlaylist, setShowMyPlaylist] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [myPlaylist, setMyPlaylist] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  const handleAdd = (song) => {
    if (!myPlaylist.find((s) => s.title === song.title)) {
      const songWithImage = { ...song, image: getRandomImageUrl() };
      setMyPlaylist([...myPlaylist, songWithImage]);
    } else {
      showAlert(`"${song.title}" is already in your playlist.`, "warning");
    }
  };

  const handleRemove = (song) => {
    setMyPlaylist(myPlaylist.filter((s) => s.title !== song.title));
    showAlert(`"${song.title}" removed from your playlist.`, "danger");
  };

  const showAlert = (message, variant) => {
    setAlertMsg({ message, variant });
    setTimeout(() => setAlertMsg(null), 2000);
  };

  const filteredPlaylist = myPlaylist.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-4">
      <h2 className="fw-bold text-center py-3 px-4 rounded" style={{ backgroundColor: "#f0f0f0" }}>
        🎵 Musics
      </h2>

      {alertMsg && (
        <Alert variant={alertMsg.variant} className="text-center">
          {alertMsg.message}
        </Alert>
      )}

      <Row className="mb-4 justify-content-center">
        <Col xs="auto">
          <Button
            variant={!showMyPlaylist ? "primary" : "outline-primary"}
            className="me-2"
            onClick={() => {
              setShowMyPlaylist(false);
              setSelectedCategory(null);
            }}
          >
            All Playlist
          </Button>
          <Button
            variant={showMyPlaylist ? "primary" : "outline-primary"}
            onClick={() => {
              setShowMyPlaylist(true);
              setSelectedCategory(null);
            }}
          >
            My Playlist
          </Button>
        </Col>
      </Row>

      {/* Category View */}
      {!showMyPlaylist && !selectedCategory && (
        <Row className="mb-4">
          {categories.map((cat, idx) => (
            <Col md={6} key={idx} className="mb-4">
              <Card
                onClick={() => setSelectedCategory(cat.name)}
                className="shadow-sm hover-shadow cursor-pointer"
                style={{ cursor: "pointer" }}
              >
                <Card.Img variant="top" src={cat.image} height={200} style={{ objectFit: "cover" }} />
                <Card.Body className="text-center">
                  <Card.Title>{cat.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Song List per Category */}
      {!showMyPlaylist && selectedCategory && (
        <>
          <h4 className="mb-3">{selectedCategory} Songs</h4>
          <Row>
            {allSongs[selectedCategory].map((song, idx) => {
              const alreadyAdded = myPlaylist.some((s) => s.title === song.title);
              return (
                <Col md={6} key={idx} className="mb-3">
                  <Card className="d-flex flex-row align-items-center shadow-sm p-2">
                    <img
                      src={getRandomImageUrl()}
                      alt="Song"
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                    <div className="ms-3 flex-grow-1">
                      <h6 className="mb-1">{song.title}</h6>
                      <small className="text-muted">{song.artist}</small>
                    </div>
                    <Button
                      variant={alreadyAdded ? "success" : "outline-primary"}
                      onClick={() => handleAdd(song)}
                    >
                      {alreadyAdded ? "Added" : "Add"}
                    </Button>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}

      {/* My Playlist View */}
      {showMyPlaylist && (
        <>
          <InputGroup className="mb-4">
            <FormControl
              placeholder="Search in your playlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          {filteredPlaylist.length === 0 ? (
            <p className="text-center text-muted">No songs in your playlist.</p>
          ) : (
            <Row>
              {filteredPlaylist.map((song, idx) => (
                <Col md={6} key={idx} className="mb-3">
                  <Card className="d-flex flex-row align-items-center shadow-sm p-2">
                    <img
                      src={song.image}
                      alt={song.title}
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                    <div className="ms-3 flex-grow-1">
                      <h6 className="mb-1">{song.title}</h6>
                      <small className="text-muted">{song.artist}</small>
                    </div>
                    <Button variant="outline-danger" onClick={() => handleRemove(song)}>
                      Remove
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
}

export default Playlist;
