import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Reader from "./pages/Reader";
import Settings from "./pages/Settings";
import Library from "./pages/Library";
import Playlist from "./pages/Playlist";
import Layout from "./components/Layout";
import ReadingBook from "./pages/ReadingBook"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/reader"
          element={
            <Layout>
              <Reader />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
        <Route
          path="/Library"
          element={
            <Layout>
              <Library />
            </Layout>
          }
        />
        <Route
          path="/playlist"
          element={
            <Layout>
              <Playlist />
            </Layout>
          }
        />
        <Route
          path="/ReadingBook"
          element={
            <Layout>
              <ReadingBook />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
