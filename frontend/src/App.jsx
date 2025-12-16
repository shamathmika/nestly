// src/App.jsx
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Services from "./components/Services";
import News from "./components/News";
import Contacts from "./components/Contacts";
import Admin from "./components/Admin";
import ServiceDetail from "./components/ServiceDetail";
import RecentServices from "./components/RecentServices";
import TopServices from "./components/TopServices";
import AllUsers from "./components/AllUsers";

import AuthModal from "./components/auth/AuthModal";
import AdditionalInfoModal from "./components/auth/AdditionalInfoModal";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <div className="App">
        {/* NAVBAR (uses useUser) */}
        <Navbar />

        {/* MODALS (controlled by context) */}
        <AuthModal />
        <AdditionalInfoModal />

        {/* PAGE CONTENT */}
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/services/recent" element={<RecentServices />} />
            <Route path="/services/top" element={<TopServices />} />
            <Route path="/news" element={<News />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/allusers" element={<AllUsers />} />
          </Routes>
        </div>

        {/* GLOBAL STICKY FOOTER */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} Nestly • Your home away from home.</p>
        </footer>
      </div>
    </UserProvider>
  );
}
