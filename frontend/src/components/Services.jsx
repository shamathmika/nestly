import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const apiBase = import.meta.env.VITE_API_BASE ?? "/backend";

export default function Services() {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        fetch(`${apiBase}/listings/get-listings.php`)
            .then((res) => res.json())
            .then((data) => setListings(data))
            .catch((err) => console.error("Error loading listings:", err));
    }, []);

    return (
        <div>
            <div style={{ marginTop: "2rem" }}>
                <Link to="/services/recent">Last 5 Visited</Link> |{" "}
                <Link to="/services/top">Most Visited</Link>
            </div>
            <h2>Available Rentals</h2>
            {listings.length === 0 ? (
                <p>Loading listings...</p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "1rem",
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
        </div>
    );
}
