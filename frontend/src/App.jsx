import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Services from "./components/Services";
import News from "./components/News";
import Contacts from "./components/Contacts";
import Admin from "./components/Admin";

function App() {
    return (
        <div className="App">
            <Navbar />

            <div style={{ padding: "20px" }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
