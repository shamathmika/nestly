import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const apiBase = import.meta.env.VITE_API_BASE ?? "/api";

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
                if (!counts || typeof counts !== "object") {
                    console.error("Unexpected top counts payload:", counts);
                    setTopData({});
                    setListings([]);
                    return;
                }

                setTopData(counts);

                // keys in counts are likely strings ("1", "2", ...)
                const idStrings = Object.keys(counts);

                // filter listings whose id is in counts
                const filtered = allListings.filter((p) =>
                    idStrings.includes(String(p.id))
                );

                // Order ids by descending view count
                const orderedIds = [...idStrings].sort(
                    (a, b) => (counts[b] ?? 0) - (counts[a] ?? 0)
                );

                const orderedListings = orderedIds
                    .map((idStr) =>
                        filtered.find((p) => String(p.id) === idStr)
                    )
                    .filter(Boolean);

                setListings(orderedListings);
            })
            .catch((err) =>
                console.error("Error loading top listings:", err)
            );
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

                            <p style={{ fontSize: "0.85rem", color: "#555" }}>
                                {topData[String(p.id)] ?? 0} visit
                                {(topData[String(p.id)] ?? 0) > 1 ? "s" : ""}
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
