import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/background.png";

function Login() {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const username = email.split("@")[0]; // basit kullanıcı adı
    localStorage.setItem("username", username);
    navigate("/home");
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    alert("Sign Up Successful! You can now log in.");
    setShowSignUp(false); // Login ekranına geri dön
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card style={{ width: "22rem" }} className="p-4 shadow-lg">
        <h3 className="text-center mb-3 text-primary">BooTunes 🎵📖</h3>
        {!showSignUp ? (
          <>
            <h5 className="text-center mb-3">Sign In</h5>
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Control type="email" placeholder="Email" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control type="password" placeholder="Password" required />
              </Form.Group>
              <Button type="submit" className="w-100 mb-2" variant="primary">
                Login
              </Button>
            </Form>
            <p className="text-center">
              Don't have an account?{" "}
              <span
                className="text-success"
                style={{ cursor: "pointer" }}
                onClick={() => setShowSignUp(true)}
              >
                Sign Up
              </span>
            </p>
          </>
        ) : (
          <>
            <h5 className="text-center mb-3">Sign Up</h5>
            <Form onSubmit={handleSignUp}>
              <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Full Name" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control type="email" placeholder="Email" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control type="password" placeholder="Password" required />
              </Form.Group>
              <Button type="submit" className="w-100 mb-2" variant="success">
                Register
              </Button>
            </Form>
            <p className="text-center">
              Already have an account?{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => setShowSignUp(false)}
              >
                Sign In
              </span>
            </p>
          </>
        )}
      </Card>
    </div>
  );
}

export default Login;
