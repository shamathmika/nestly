import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const apiBase = import.meta.env.VITE_API_BASE ?? "/backend";

export default function ServiceDetail() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);

    useEffect(() => {
        fetch(`${apiBase}/listings/get-listings.php`)
            .then((res) => res.json())
            .then((data) => {
                const found = data.find((p) => p.id === id);
                setListing(found || null);
            })
            .catch((err) => console.error("Error loading listing:", err));
    }, [id]);

    if (!listing) return <p>Loading...</p>;

    return (
        <div>
            <h2>{listing.title}</h2>
            <img
                src={listing.img}
                alt={listing.title}
                width="600"
                style={{ borderRadius: "8px" }}
            />
            <p>
                <strong>Address:</strong> {listing.address}
            </p>
            <p>
                <strong>Rent:</strong> ${listing.rent} / month
            </p>
            <p>
                <strong>Beds/Baths:</strong> {listing.beds} bd / {listing.baths}{" "}
                ba
            </p>
            <p style={{ maxWidth: "700px" }}>{listing.longDesc}</p>
            <h4>Amenities</h4>
            <ul>
                {listing.amenities.map((a, i) => (
                    <li key={i}>{a}</li>
                ))}
            </ul>

            <p style={{ marginTop: "1rem" }}>
                <Link to="/services">← Back to Listings</Link>
            </p>
        </div>
    );
}
