import { Link, NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import nestly from "../assets/nest.svg";
import { useUser } from "../context/UserContext";

function Navbar() {
    const { user, openAuthModal, logout } = useUser();

    return (
        <header className="nb">
            <div className="nb__inner">
                <Link to="/" className="nb__brand">
                    <img src={nestly} alt="nestly logo" />
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

                    {/* Right side: Login or Profile */}
                    <div className="nb__auth">
                        {!user ? (
                            <button
                                className="nb__login-btn"
                                onClick={openAuthModal}
                            >
                                Login / Sign Up
                            </button>
                        ) : (
                            <div className="nb__profile">
                                <span className="nb__profile-name">
                                    Hi, {user.name.split(" ")[0]}
                                </span>

                                {/* Hover dropdown */}
                                <div className="nb__dropdown">
                                    <button
                                        className="nb__dropdown-btn"
                                        onClick={logout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
