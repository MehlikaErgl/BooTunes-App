// src/pages/Settings.jsx

import React, { useContext } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { UserSettingsContext } from "../context/UserSettingsContext";

export default function Settings() {
  const { settings, updateSettings } = useContext(UserSettingsContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSettings({ ...settings, [name]: value });
  };

  const handleSave = () => {
    alert("Settings saved!");
  };

  return (
    <Container className="py-4" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">⚙️ Settings</h3>

      <Form.Group className="mb-3">
        <Form.Label>Font Size</Form.Label>
        <Form.Select
          name="fontSize"
          value={settings.fontSize}
          onChange={handleChange}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Font Family</Form.Label>
        <Form.Select
          name="fontFamily"
          value={settings.fontFamily}
          onChange={handleChange}
        >
          <option value="Georgia">Georgia</option>
          <option value="Arial">Arial</option>
          <option value="Merriweather">Merriweather</option>
          <option value="Times New Roman">Times New Roman</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Line Height</Form.Label>
        <Form.Select
          name="lineHeight"
          value={settings.lineHeight}
          onChange={handleChange}
        >
          <option value="1.5">1.5</option>
          <option value="1.8">1.8</option>
          <option value="2.0">2.0</option>
        </Form.Select>
      </Form.Group>

      <Button onClick={handleSave} variant="primary">Save Settings</Button>
    </Container>
  );
}
