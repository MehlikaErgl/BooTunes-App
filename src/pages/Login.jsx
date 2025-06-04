import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import bgImage from "../assets/background.png";

export default function Login() {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.body.setAttribute("data-theme", storedTheme);
  }, []);

  const isDark = theme === "dark";

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("email", data.email);
        localStorage.setItem("username", data.username); // ✅ ÖNEMLİ: backend'den dönmeli!
        alert("Giriş başarılı ✅");
        navigate("/home");
      } else {
        alert(data.message || "Giriş başarısız");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Sunucu hatası");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.signEmail.value;
    const password = e.target.signPassword.value;

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Kayıt başarılı ✅ Giriş yapabilirsiniz");
        setShowSignUp(false);
      } else {
        alert(data.message || "Kayıt başarısız");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Sunucu hatası");
    }
  };

  const inputStyle = isDark
    ? { backgroundColor: "#6a6a6a", color: "#eee", border: "1px solid #444" }
    : {};

  const cardStyle = {
    borderRadius: "1rem",
    backdropFilter: "blur(10px)",
    backgroundColor: isDark ? "rgba(30,30,30,0.85)" : "rgba(255,255,255,0.85)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    maxWidth: "440px",
    minHeight: "550px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    color: isDark ? "#eee" : "#222",
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center px-3"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isDark ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.5)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ zIndex: 1, width: "100%" }}
      >
        <Card className="p-4 text-center w-100 border-0" style={cardStyle}>
          <div className="w-100" style={{ maxWidth: 360 }}>
            <Card.Title className="mb-4 display-6 text-primary">
              BooTunes 🎵📖
            </Card.Title>

            {!showSignUp ? (
              <motion.div key="signin">
                <h5 className="mb-3">Sign In</h5>
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Email address"
                      required
                      style={inputStyle}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <FormControl
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        required
                        style={inputStyle}
                      />
                      <Button
                        variant={isDark ? "outline-light" : "outline-secondary"}
                        onClick={() => setShowPassword((s) => !s)}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                  <Button type="submit" className="w-100 mb-2" size="lg">
                    Login
                  </Button>
                </Form>
                <p className="mt-3">
                  Don’t have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 text-success"
                    onClick={() => setShowSignUp(true)}
                  >
                    Sign Up
                  </Button>
                </p>
              </motion.div>
            ) : (
              <motion.div key="signup">
                <h5 className="mb-3">Create Account</h5>
                <Form onSubmit={handleSignUp}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Username"
                      required
                      style={inputStyle}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      name="signEmail"
                      placeholder="Email address"
                      required
                      style={inputStyle}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="password"
                      name="signPassword"
                      placeholder="Password"
                      required
                      style={inputStyle}
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    className="w-100 mb-2"
                    size="lg"
                    variant="success"
                  >
                    Register
                  </Button>
                </Form>
                <p className="mt-3">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 text-primary"
                    onClick={() => setShowSignUp(false)}
                  >
                    Sign In
                  </Button>
                </p>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
