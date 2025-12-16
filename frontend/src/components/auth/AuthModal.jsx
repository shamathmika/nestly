import { useState } from "react";
import { useUser } from "../../context/UserContext";
import "../../styles/AuthModal.css"; // we'll add this below

export default function AuthModal() {
    const { isAuthModalOpen, closeAuthModal, login, signup } = useUser();
    const [mode, setMode] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    if (!isAuthModalOpen) return null;

    const handleSubmit = async () => {
        setError("");

        if (mode === "login") {
            const result = await login(email, password);
            if (result.error) setError(result.error);
        } else {
            const result = await signup(name, email, password);
            if (result.error) setError(result.error);
        }
    };

    const startGoogleLogin = async () => {
        const res = await fetch("/backend/auth/google-login.php");
        const data = await res.json();
        if (data.authUrl) window.location.href = data.authUrl;
    };

    return (
        <div className="auth-overlay">
            <div className="auth-modal">
                <button className="auth-close" onClick={closeAuthModal}>
                    ✕
                </button>

                <h2>{mode === "login" ? "Welcome back" : "Create an account"}</h2>

                {mode === "signup" && (
                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="auth-error">{error}</p>}

                <button className="auth-submit" onClick={handleSubmit}>
                    {mode === "login" ? "Login" : "Sign Up"}
                </button>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                <button className="auth-google" onClick={startGoogleLogin}>
                    Continue with Google
                </button>

                <p className="auth-switch">
                    {mode === "login" ? (
                        <>
                            Don't have an account?
                            <span onClick={() => setMode("signup")}> Sign up</span>
                        </>
                    ) : (
                        <>
                            Already have an account?
                            <span onClick={() => setMode("login")}> Login</span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
