import { Link, NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import nestly from "../assets/nest.svg";

function Navbar() {
    return (
        <header className="nb">
            <div className="nb__inner">
                <Link to="/" className="nb__brand">
                    <img src={nestly} />
                    nestly
                </Link>
                <nav className="nb__nav">
                    <NavLink to="/" end className="nb__link">
                        Home
                    </NavLink>
                    <NavLink to="/about" className="nb__link">
                        About
                    </NavLink>
                    <NavLink to="/services" className="nb__link">
                        Services
                    </NavLink>
                    <NavLink to="/news" className="nb__link">
                        News
                    </NavLink>
                    <NavLink to="/contacts" className="nb__link">
                        Contacts
                    </NavLink>
                    <NavLink to="/allusers" className="nb__link">
                        All Users
                    </NavLink>
                    <NavLink to="/admin" className="nb__btn">
                        Admin
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
