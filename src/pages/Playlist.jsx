import React, { useState } from "react";
import {
  Card,
  Button,
  InputGroup,
  FormControl,
  Nav,
  Tab,
  Badge,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { FiPlus, FiCheck, FiX } from "react-icons/fi";

export default function Playlist() {
  const allPlaylists = [
    { title: "Lo-fi Study", image: "https://picsum.photos/300/300?random=21" },
    { title: "Chill Vibes", image: "https://picsum.photos/300/300?random=22" },
    { title: "Jazz Classics", image: "https://picsum.photos/300/300?random=23" },
    { title: "Piano Relax", image: "https://picsum.photos/300/300?random=24" },
    { title: "Morning Boost", image: "https://picsum.photos/300/300?random=25" },
    { title: "Evening Acoustic", image: "https://picsum.photos/300/300?random=26" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [myPlaylist, setMyPlaylist] = useState([]);

  const handleAdd = (pl) => {
    if (!myPlaylist.find((t) => t.title === pl.title)) {
      setMyPlaylist([...myPlaylist, pl]);
    }
  };

  const handleRemove = (pl) => {
    setMyPlaylist(myPlaylist.filter((t) => t.title !== pl.title));
  };

  const filtered = allPlaylists.filter((pl) =>
    pl.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 24vh)",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "3rem 1rem",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "900px", padding: "2rem" }}>
      <div className="text-center">
        <div
          className="d-inline-block px-4 py-2 mb-3 rounded"
          style={{
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(153, 152, 152, 0.5)'
          }}
        >
          <h2 className="m-0 text-dark">🎵 Your Playlists</h2>
        </div>
      </div>


        {/* Search Bar */}
        <div className="d-flex justify-content-center mb-4">
          <InputGroup style={{ maxWidth: "400px" }}>
            <FormControl
              placeholder="Search playlists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary">🔍</Button>
          </InputGroup>
        </div>

        {/* Tabs */}
        <Tab.Container defaultActiveKey="all">
          <Nav variant="pills" className="justify-content-center mb-4">
            <Nav.Item>
              <Nav.Link eventKey="all">
                All Playlists{' '}
                <Badge bg="light" text="dark">
                  {filtered.length}
                </Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="mine">
                My Playlist{' '}
                <Badge bg="light" text="dark">
                  {myPlaylist.length}
                </Badge>
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* All Playlists: vertical scroll list */}
            <Tab.Pane eventKey="all">
              <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "hidden" }}>
                {filtered.map((pl, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ marginBottom: "1rem" }}
                  >
                    <Card
                      className="d-flex flex-row align-items-center shadow"
                      style={{
                        borderRadius: "0.75rem",
                        background: "#fff",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={pl.image}
                        alt={pl.title}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1 text-dark">{pl.title}</h6>
                      </div>
                      <Button
                        variant={
                          myPlaylist.find((t) => t.title === pl.title)
                            ? "success"
                            : "outline-primary"
                        }
                        className="me-3"
                        onClick={() => handleAdd(pl)}
                      >
                        {myPlaylist.find((t) => t.title === pl.title) ? (
                          <><FiCheck /> Added</>
                        ) : (
                          <><FiPlus /> Add</>
                        )}
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Tab.Pane>

            {/* My Playlist: vertical scroll list */}
            <Tab.Pane eventKey="mine">
              <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "hidden" }}>
                {myPlaylist.length === 0 ? (
                  <p className="text-center text-muted">No tracks added yet.</p>
                ) : (
                  myPlaylist.map((pl, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      style={{ marginBottom: "1rem" }}
                    >
                      <Card
                        className="d-flex flex-row align-items-center shadow"
                        style={{
                          borderRadius: "0.75rem",
                          background: "#fff",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={pl.image}
                          alt={pl.title}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1 text-dark">{pl.title}</h6>
                        </div>
                        <Button
                          variant="outline-danger"
                          className="me-3"
                          onClick={() => handleRemove(pl)}
                        >
                          <FiX /> Remove
                        </Button>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
}
