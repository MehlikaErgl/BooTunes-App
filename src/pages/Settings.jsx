import React, { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("username", username);
    alert("Settings saved successfully!");
  };

  return (
    <div className="text-white">
      <h2 className="text-center mb-4" style={{ fontSize: "2rem", textShadow: "1px 1px #000" }}>
        ⚙️ Settings
      </h2>

      <Row className="g-4 justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <Form onSubmit={handleSave}>
              <h5 className="mb-3">👤 Profile Settings</h5>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <h5 className="mb-3">🎶 Music Preferences</h5>
              <Form.Group className="mb-3">
                <Form.Label>Preferred Genre</Form.Label>
                <Form.Select>
                  <option>Lo-fi</option>
                  <option>Classical</option>
                  <option>Jazz</option>
                  <option>Instrumental</option>
                </Form.Select>
              </Form.Group>

              <h5 className="mb-3">🌙 Display</h5>
              <Form.Check
                type="switch"
                id="darkMode"
                label="Enable Dark Mode"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />

              <Button type="submit" variant="primary" className="mt-3 w-100">
                Save Settings
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Settings;
