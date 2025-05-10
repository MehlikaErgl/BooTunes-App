import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMusic,
  FiList,
  FiSettings,
  FiEdit2,
  FiMail,
  FiLock,
} from "react-icons/fi";

export default function Settings() {
  const [theme, setTheme] = useState(document.body.dataset.theme || "light");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [genre, setGenre] = useState(localStorage.getItem("genre") || "Lo-fi");
  const [summaryPreference, setSummaryPreference] = useState(localStorage.getItem("summaryPref") || "short");
  const [playlistType, setPlaylistType] = useState(localStorage.getItem("playlistType") || "general");
  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isDark = theme === "dark";

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.body.dataset.theme;
      setTheme(currentTheme);
    });
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const cardStyle = {
    borderRadius: "1rem",
    backgroundColor: isDark ? "rgba(51, 46, 46, 0.4)" : "#fff",
    backdropFilter: "blur(10px)",
    color: isDark ? "#eee" : "#222",
  };

  const inputStyle = isDark
    ? { backgroundColor: "#6a6a6a", color: "#eee", border: "1px solid #555" }
    : {};

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("genre", genre);
    localStorage.setItem("summaryPref", summaryPreference);
    localStorage.setItem("playlistType", playlistType);
    alert("Settings saved successfully!");
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setUsername(newUsername);
    setEmail(newEmail);
    localStorage.setItem("username", newUsername);
    localStorage.setItem("email", newEmail);
    alert("Profile updated successfully!");
    setShowModal(false);
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-start py-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: 650 }}
      >
        <Card className="p-4 shadow-lg position-relative" style={cardStyle}>
          <h2 className="mb-4 d-flex justify-content-between align-items-center">
            <span><FiSettings className="me-2 text-primary" /> App Settings</span>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowModal(true)}
            >
              <FiEdit2 className="me-1" /> Edit Profile
            </Button>
          </h2>

          <Form onSubmit={handleSave}>
            <h5 className={`mb-3 ${isDark ? "text-light" : "text-dark"}`}>
              <FiUser className="me-2" /> Profile Info
            </h5>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={username} disabled style={inputStyle} />
            </Form.Group>

            <h5 className={`mb-3 ${isDark ? "text-light" : "text-dark"}`}>
              <FiMusic className="me-2" /> Music Preferences
            </h5>
            <InputGroup className="mb-3">
              <InputGroup.Text>Genre</InputGroup.Text>
              <Form.Select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                style={inputStyle}
              >
                <option>Lo-fi</option>
                <option>Classical</option>
                <option>Jazz</option>
                <option>Instrumental</option>
              </Form.Select>
            </InputGroup>

            <Form.Group className="mb-3">
              <Form.Label><FiList className="me-2" /> Playlist Type</Form.Label>
              <Form.Select
                value={playlistType}
                onChange={(e) => setPlaylistType(e.target.value)}
                style={inputStyle}
              >
                <option value="general">General Playlist</option>
                <option value="personal">My Playlist</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>📄 Summary Type</Form.Label>
              <Form.Select
                value={summaryPreference}
                onChange={(e) => setSummaryPreference(e.target.value)}
                style={inputStyle}
              >
                <option value="short">Short Summary</option>
                <option value="detailed">Detailed Summary</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 mt-2" size="lg">
              Save Changes
            </Button>
          </Form>
        </Card>
      </motion.div>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
        style={{ backdropFilter: "blur(6px)" }}
      >
        <Modal.Header closeButton className={isDark ? "bg-dark text-light" : ""}>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "bg-dark text-light" : ""}>
          <Form onSubmit={handleProfileUpdate}>
            <Form.Group className="mb-3">
              <Form.Label><FiUser className="me-2" />Username</Form.Label>
              <Form.Control
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                style={inputStyle}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><FiMail className="me-2" />Email</Form.Label>
              <Form.Control
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><FiLock className="me-2" />New Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label><FiLock className="me-2" />Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Update Profile
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
