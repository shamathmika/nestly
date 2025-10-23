import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const apiBase = import.meta.env.VITE_API_BASE ?? "/backend";

export default function TopServices() {
    const [topData, setTopData] = useState({});
    const [listings, setListings] = useState([]);

    useEffect(() => {
        Promise.all([
            fetch(`${apiBase}/listings/get-top.php`, {
                credentials: "include",
            }).then((r) => r.json()),
            fetch(`${apiBase}/listings/get-listings.php`).then((r) => r.json()),
        ])
            .then(([counts, allListings]) => {
                setTopData(counts);
                const ids = Object.keys(counts);
                const filtered = allListings.filter((p) => ids.includes(p.id));
                // Order by descending view count
                const ordered = ids
                    .map((id) => filtered.find((p) => p.id === id))
                    .filter(Boolean);
                setListings(ordered);
            })
            .catch((err) => console.error("Error loading top listings:", err));
    }, []);

    return (
        <div>
            <h2>Most Visited Listings</h2>

            {listings.length === 0 ? (
                <p>No visits yet.</p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "1rem",
                        marginTop: "1.5rem",
                    }}
                >
                    {listings.map((p) => (
                        <div
                            key={p.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "1rem",
                            }}
                        >
                            <img
                                src={p.img}
                                alt={p.title}
                                style={{
                                    width: "100%",
                                    height: "180px",
                                    objectFit: "cover",
                                    borderRadius: "6px",
                                }}
                            />
                            <h3>{p.title}</h3>
                            <p style={{ fontSize: "0.9rem" }}>{p.shortDesc}</p>
                            <p style={{ fontSize: "0.85rem", color: "#555" }}>
                                {topData[p.id]} visit
                                {topData[p.id] > 1 ? "s" : ""}
                            </p>
                            <Link to={`/services/${p.id}`}>View Details</Link>
                        </div>
                    ))}
                </div>
            )}

            <p style={{ marginTop: "2rem" }}>
                <Link to="/services">← Back to Listings</Link>
            </p>
        </div>
    );
}
