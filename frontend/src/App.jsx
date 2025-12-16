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

import { UserProvider } from "./context/UserContext";
import AuthModal from "./components/auth/AuthModal";
import AdditionalInfoModal from "./components/auth/AdditionalInfoModal";

function App() {
    return (
        <UserProvider>
            <div className="App">
                <Navbar />

                <AuthModal />
                <AdditionalInfoModal />

                <div className="page-container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/news" element={<News />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/services/:id" element={<ServiceDetail />} />
                        <Route
                            path="/services/recent"
                            element={<RecentServices />}
                        />
                        <Route path="/services/top" element={<TopServices />} />
                        <Route path="/allusers" element={<AllUsers />} />
                    </Routes>
                </div>
            </div>
        </UserProvider>
    );
}

export default App;
