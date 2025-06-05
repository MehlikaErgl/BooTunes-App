import React, { useState, useEffect } from "react";
import { Container, Form, Button, Spinner, Alert } from "react-bootstrap";

export default function Settings({ theme }) {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    const storedEmail = localStorage.getItem("email") || "";
    setUsername(storedUsername);
    setEmail(storedEmail);
  }, []);

  const isDark = theme === "dark";

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      showMessage("❌ Passwords do not match.", "danger");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      showMessage("User ID not found. Please log in again.", "danger");
      return;
    }

    const updateData = { username, email };
    if (newPassword.trim()) {
      updateData.password = newPassword;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error("Server error");

      const updatedUser = await res.json();
      localStorage.setItem("username", updatedUser.username);
      localStorage.setItem("email", updatedUser.email);

      showMessage("✅ Profile updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("🔴 Update error:", err);
      showMessage("❌ Profile update failed. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    color: isDark ? "#fff" : "#001f3f",
    fontWeight: "bold",
  };

  const inputStyle = {
    backgroundColor: isDark ? "#eee" : "#fff",
    color: "#001f3f",
    border: "1px solid #ccc",
  };

  const containerStyle = {
    color: isDark ? "#fff" : "#001f3f",
  };

  const titleStyle = {
    color: isDark ? "#fff" : "#001f3f",
    fontWeight: "bold",
    
  };

  const buttonStyle = {
    backgroundColor: isDark ? "#fff" : "#001f3f",
    color: isDark ? "#001f3f" : "#fff",
    borderColor: isDark ? "#fff" : "#001f3f",
    fontWeight: "bold",
  };

  return (
    <Container className="py-4" style={{ maxWidth: "600px", ...containerStyle }}>
      <h3 className="mb-4 text-center" style={titleStyle}>
        ⚙️ Settings
      </h3>

      {message && (
        <Alert variant={messageType} className="text-center py-2">
          {message}
        </Alert>
      )}

      <Form onSubmit={handleProfileUpdate}>
        <Form.Group className="mb-3">
          <Form.Label style={labelStyle}>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={labelStyle}>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={labelStyle}>New Password (optional)</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            style={inputStyle}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label style={labelStyle}>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            style={inputStyle}
          />
        </Form.Group>

        <Button type="submit" className="w-100" style={buttonStyle} disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </Form>
    </Container>
  );
}
