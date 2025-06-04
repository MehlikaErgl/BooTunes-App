import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Spinner } from "react-bootstrap";

export default function Settings() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mevcut kullanıcı bilgilerini localStorage'dan al
    const storedUsername = localStorage.getItem("username") || "";
    const storedEmail = localStorage.getItem("email") || "";
    setUsername(storedUsername);
    setEmail(storedEmail);
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      alert("❌ Şifreler uyuşmuyor.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Kullanıcı ID bulunamadı. Lütfen tekrar giriş yapın.");
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

      if (!res.ok) throw new Error("Sunucu hatası");

      const updatedUser = await res.json();
      localStorage.setItem("username", updatedUser.username);
      localStorage.setItem("email", updatedUser.email);

      alert("✅ Profil başarıyla güncellendi!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("🔴 Güncelleme hatası:", err);
      alert("❌ Profil güncellenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">👤 Hesap Ayarları</h3>
      <Card className="p-4 shadow-sm">
        <Form onSubmit={handleProfileUpdate}>
          <Form.Group className="mb-3">
            <Form.Label>Kullanıcı Adı</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Yeni Şifre (opsiyonel)</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Yeni şifre"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Yeni Şifre (tekrar)</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Yeni şifreyi tekrar girin"
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Güncelleniyor...
              </>
            ) : (
              "Değişiklikleri Kaydet"
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
