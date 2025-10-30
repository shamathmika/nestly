import { useEffect, useState } from "react";

const apiBase = import.meta.env.VITE_API_BASE ?? "/api";

export default function AllUsers() {
    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${apiBase}/company/get-all-users.php`)
            .then((res) => res.json())
            .then((data) => setCompanies(data))
            .catch((err) => {
                console.error("Error loading users:", err);
                setError("Failed to load users.");
            });
    }, []);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (companies.length === 0) return <p>Loading users...</p>;

    return (
        <div>
            <h2>All Users from Sister Companies</h2>
            {companies.map((c, i) => (
                <div key={i} style={{ marginTop: "1.5rem" }}>
                    <h3>{c.company}</h3>
                    <ul>
                        {c.users && c.users.length > 0 ? (
                            c.users.map((u, j) => <li key={j}>{u}</li>)
                        ) : (
                            <li>No users found</li>
                        )}
                    </ul>
                </div>
            ))}
        </div>
    );
}
