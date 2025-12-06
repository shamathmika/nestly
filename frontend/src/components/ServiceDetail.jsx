import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const apiBase = import.meta.env.VITE_API_BASE ?? "/api";

export default function ServiceDetail() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${apiBase}/listings/get-listings.php`)
            .then((res) => res.json())
            .then((data) => {
                const found = data.find((p) => String(p.id) === String(id));
                setListing(found || null);
            })
            .catch((err) => {
                console.error("Error loading listing:", err);
                setError("Failed to load listing details.");
            });

        if (id) {
            fetch(`${apiBase}/listings/set-visit.php?id=${id}`, {
                credentials: "include",
            }).catch((err) => console.warn("Visit tracking failed:", err));
        }
    }, [id]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!listing) return <p>Loading...</p>;

    return (
        <div style={{ marginBottom: "2rem" }}>
            <h2>{listing.title}</h2>

            <img
                src={listing.image_url}
                alt={listing.title}
                width="600"
                style={{ borderRadius: "8px", marginBottom: "1rem" }}
            />

            <p>
                <strong>Address:</strong> {listing.address}
            </p>

            <p>
                <strong>Rent:</strong> ${listing.rent} / month
            </p>

            <p>
                <strong>Beds/Baths:</strong> {listing.bedrooms} bd /{" "}
                {listing.bathrooms} ba
            </p>

            <p style={{ maxWidth: "700px", lineHeight: "1.5em" }}>
                {listing.description}
            </p>

            <h4>Amenities</h4>
            <ul>
                {listing.amenities.map((a, i) => (
                    <li key={i}>{a}</li>
                ))}
            </ul>

            <div style={{ marginTop: "1.5rem" }}>
                <Link to="/services">← Back to Listings</Link> |{" "}
                <Link to="/services/recent">Last 5 Visited</Link> |{" "}
                <Link to="/services/top">Most Visited</Link>
            </div>
        </div>
    );
}
