import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { FiUser, FiMusic, FiMoon, FiSun } from "react-icons/fi";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("darkMode")) || false
  );
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || ""
  );
  const [genre, setGenre] = useState(
    () => localStorage.getItem("genre") || "Lo-fi"
  );

  useEffect(() => {
    document.body.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("username", username);
    localStorage.setItem("genre", genre);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    alert("Settings saved successfully!");
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-start py-5"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: 600 }}
      >
        <Card
          className="p-4 shadow-lg"
          style={{ borderRadius: "1rem" }}
        >
          <h2 className="text-center mb-4">
            <FiUser size={28} className="me-2 text-primary" />
            Profile & Settings
          </h2>
          <Form onSubmit={handleSave}>
            {/* Profile Section */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h5 className="text-dark mb-3">
                <FiUser className="me-2" /> User Profile
              </h5>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
            </motion.div>

            {/* Music Preferences */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h5 className="text-dark mb-3">
                <FiMusic className="me-2" /> Music Preferences
              </h5>
              <InputGroup className="mb-3">
                <InputGroup.Text>Genre</InputGroup.Text>
                <Form.Select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                >
                  <option>Lo-fi</option>
                  <option>Classical</option>
                  <option>Jazz</option>
                  <option>Instrumental</option>
                </Form.Select>
              </InputGroup>
            </motion.div>

            {/* Display Settings */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h5 className="text-dark mb-3">
                <FiMoon className="me-2" /> Display Mode
              </h5>
              <ToggleButtonGroup
                type="radio"
                name="theme"
                value={darkMode ? "dark" : "light"}
                onChange={(val) => setDarkMode(val === "dark")}
                className="mb-4"
              >
                <ToggleButton id="tbtn-light" value="light">
                  <FiSun className="me-1" /> Light
                </ToggleButton>
                <ToggleButton id="tbtn-dark" value="dark">
                  <FiMoon className="me-1" /> Dark
                </ToggleButton>
              </ToggleButtonGroup>
            </motion.div>

            <Button
              type="submit"
              variant="primary"
              className="w-100 mt-3"
              size="lg"
            >
              Save Changes
            </Button>
          </Form>
        </Card>
      </motion.div>
    </Container>
  );
}