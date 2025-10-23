import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const apiBase = import.meta.env.VITE_API_BASE ?? "/backend";

export default function RecentServices() {
    const [listings, setListings] = useState([]);
    const [recentIds, setRecentIds] = useState([]);

    useEffect(() => {
        // Load both recent IDs and listings data
        Promise.all([
            fetch(`${apiBase}/listings/get-recent.php`, {
                credentials: "include",
            }).then((r) => r.json()),
            fetch(`${apiBase}/listings/get-listings.php`).then((r) => r.json()),
        ])
            .then(([ids, allListings]) => {
                const filtered = allListings.filter((p) => ids.includes(p.id));
                // keep order of cookie (recent first)
                const ordered = ids
                    .map((id) => filtered.find((p) => p.id === id))
                    .filter(Boolean);
                setListings(ordered);
                setRecentIds(ids);
            })
            .catch((err) =>
                console.error("Error loading recent listings:", err)
            );
    }, []);

    return (
        <div>
            <h2>Last 5 Visited Listings</h2>

            {listings.length === 0 ? (
                <p>No recent listings yet.</p>
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
