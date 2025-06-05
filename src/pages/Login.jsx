import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  InputGroup,
  FormControl,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import bgImage from "../assets/background.jpg";

export default function Login() {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState({ text: "", variant: "" });

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
        localStorage.setItem("username", data.username);
        navigate("/home");
      } else {
        setMessage({ text: data.message || "Login failed", variant: "danger" });
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage({ text: "Server error", variant: "danger" });
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
        setMessage({ text: "Registration successful. Redirecting to login...", variant: "success" });
        setTimeout(() => {
          setMessage({ text: "", variant: "" });
          setShowSignUp(false);
        }, 2000);
      } else {
        setMessage({ text: data.message || "Registration failed", variant: "danger" });
      }
    } catch (err) {
      console.error("Register error:", err);
      setMessage({ text: "Server error", variant: "danger" });
    }
  };

  const inputStyle = isDark
    ? {
        backgroundColor: "#d9d9d9", // açık gri
        color: "#001f3f", // lacivert yazı
        border: "1px solid #444",
      }
    : {};

    const cardStyle = {
      borderRadius: "1rem",
      backdropFilter: "blur(16px)",
      backgroundColor: isDark ? "rgba(0, 31, 63, 0.6)" : "rgba(255,255,255,0.85)", // lacivert şeffaf
      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
      border: isDark ? "1px solid rgba(255,255,255,0.2)" : "2px solid #001f3f",
      color: isDark ? "#f0f0f0" : "#222",
      padding: "2rem",
      maxWidth: "440px",
      width: "100%",
      minHeight: "570px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
    

  const loginButtonStyle = isDark
    ? {
        backgroundColor: "#d9d9d9",
        borderColor: "#d9d9d9",
        color: "#001f3f",
        fontWeight: "bold",
      }
    : {
        backgroundColor: "#001f3f",
        borderColor: "#001f3f",
        color: "#fff",
        fontWeight: "bold",
      };

  return (
    <div
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
          background: isDark ? "rgba(0, 15, 40, 0.75)" : "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(3px)", // burada blur ekledik
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "1rem",
        }}
      >
        <Card className="text-center w-100 border-0" style={cardStyle}>
          <div className="w-100" style={{ maxWidth: 360 }}>
          <Card.Title
  className="mb-4"
  style={{
    fontSize: "2.2rem",
    fontWeight: "bold",
    color: isDark ? "#ffffff" : "#001f3f",
    textShadow: isDark ? "0 0 8px rgba(255,255,255,0.3)" : "1px 1px 2px rgba(0,0,0,0.2)",
  }}
>
  BooTunes 🎵📖
</Card.Title>


            {message.text && (
              <Alert variant={message.variant} className="py-2">
                {message.text}
              </Alert>
            )}

            {!showSignUp ? (
              <motion.div key="signin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                        autoComplete="off"
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
                  <Button type="submit" className="w-100 mb-2" size="lg" style={loginButtonStyle}>
                    Login
                  </Button>
                </Form>
                <p className="mt-3">
                  Don’t have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0"
                    style={isDark ? { color: "#66b3ff" } : {}}
                    onClick={() => {
                      setMessage({ text: "", variant: "" });
                      setShowSignUp(true);
                    }}
                  >
                    Sign Up
                  </Button>
                </p>
              </motion.div>
            ) : (
              <motion.div key="signup" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                      autoComplete="new-password"
                      style={inputStyle}
                    />
                  </Form.Group>
                  <Button type="submit" className="w-100 mb-2" size="lg" style={loginButtonStyle}>
                    Register
                  </Button>
                </Form>
                <p className="mt-3">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 text-primary"
                    onClick={() => {
                      setMessage({ text: "", variant: "" });
                      setShowSignUp(false);
                    }}
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
