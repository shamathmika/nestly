import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const apiBase = import.meta.env.VITE_API_BASE ?? "/api";

export default function RecentServices() {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        Promise.all([
            fetch(`${apiBase}/listings/get-recent.php`, {
                credentials: "include",
            }).then((r) => r.json()),
            fetch(`${apiBase}/listings/get-listings.php`).then((r) => r.json()),
        ])
            .then(([ids, allListings]) => {
                if (!Array.isArray(ids)) {
                    console.error("Unexpected recent IDs payload:", ids);
                    setListings([]);
                    return;
                }

                // Normalize all IDs to strings
                const idStrings = ids.map((id) => String(id));

                // Keep only listings whose id is in recent list
                const filtered = allListings.filter((p) =>
                    idStrings.includes(String(p.id))
                );

                // Preserve recent order (most recent first)
                const ordered = idStrings
                    .map((idStr) =>
                        filtered.find((p) => String(p.id) === idStr)
                    )
                    .filter(Boolean);

                setListings(ordered);
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
                                src={p.image_url}
                                alt={p.title}
                                style={{
                                    width: "100%",
                                    height: "180px",
                                    objectFit: "cover",
                                    borderRadius: "6px",
                                }}
                            />
                            <h3>{p.title}</h3>
                            <p style={{ fontSize: "0.9rem" }}>
                                {p.description?.substring(0, 80)}...
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
