import { useState, useEffect } from "react";

const apiBase = import.meta.env.VITE_API_BASE ?? "/backend";

function Admin() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const res = await fetch(`${apiBase}/admin/get-users.php`, {
            credentials: "include",
        });

        if (res.status === 403) {
            setIsLoggedIn(false);
            return;
        }

        const data = await res.json();
        setUsers(data);
        setIsLoggedIn(true);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await fetch(`${apiBase}/admin/login.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (data.success) {
            fetchUsers();
            setLoginError("");
        } else {
            setLoginError(data.message || "Login failed");
        }
    };

    const handleLogout = async () => {
        await fetch(`${apiBase}/admin/logout.php`, {
            credentials: "include",
        });
        setIsLoggedIn(false);
        setUsers([]);
        setUsername("");
        setPassword("");
    };

    if (!isLoggedIn) {
        return (
            <div>
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <br />
                    <br />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    <br />
                    <button type="submit">Login</button>
                </form>
                <p style={{ color: "red" }}>{loginError}</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Admin Panel</h2>
            <p>
                Logged in as <strong>admin</strong>
            </p>
            <h3>Current Users:</h3>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Admin;
