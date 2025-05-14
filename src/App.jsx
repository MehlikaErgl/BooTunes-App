import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Reader from "./pages/Reader";
import Settings from "./pages/Settings";
import Library from "./pages/Library";
import Playlist from "./pages/Playlist";
import Layout from "./components/Layout";
import ReadingBook from "./pages/ReadingBook";

function App() {
  return (
    <Router>
      <MobileRedirectHandler />
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

// 🔁 Mobil cihaz yönlendirme kontrolü
function MobileRedirectHandler() {
  const location = useLocation();

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      // İOS mu Android mi kontrolü
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);

      // Uygulamanızın App Store ve Google Play bağlantılarını buraya koyun:
      const playStoreUrl = "https://play.google.com/store/apps/details?id=your.package.name";
      const appStoreUrl = "https://apps.apple.com/app/idXXXXXXXXXX";

      if (isIOS) {
        window.location.href = appStoreUrl;
      } else if (isAndroid) {
        window.location.href = playStoreUrl;
      }
    }
  }, [location.pathname]);

  return null;
}
