import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
            <Link to="/">Home</Link> | <Link to="/about">About</Link> |{" "}
            <Link to="/services">Services</Link> | <Link to="/news">News</Link>{" "}
            | <Link to="/contacts">Contacts</Link>
        </nav>
    );
}

export default Navbar;
