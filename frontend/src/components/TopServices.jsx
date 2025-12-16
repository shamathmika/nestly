import { useEffect, useState } from "react";
import ListingCard from "./ListingCard";
import { Link } from "react-router-dom";

const apiBase = import.meta.env.VITE_API_BASE ?? "/api";

export default function TopServices() {
  const [listings, setListings] = useState([]);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    Promise.all([
      fetch(`${apiBase}/listings/get-top.php`, {
        credentials: "include",
      }).then((r) => r.json()),
      fetch(`${apiBase}/listings/get-listings.php`).then((r) => r.json()),
    ])
      .then(([countData, allListings]) => {
        setCounts(countData);

        const ids = Object.keys(countData);

        const ordered = ids
          .sort((a, b) => countData[b] - countData[a])
          .map((id) =>
            allListings.find((listing) => String(listing.id) === id)
          )
          .filter(Boolean);

        setListings(ordered);
      })
      .catch((err) => console.error("Error loading top listings:", err));
  }, []);

  return (
    <div>
      <h2>Most Visited Listings</h2>

      <div className="cards">
        {listings.map((p) => (
          <ListingCard key={p.id} listing={p} />
        ))}
      </div>

      <p style={{ marginTop: "2rem" }}>
        <Link to="/services">← Back to Listings</Link>
      </p>
    </div>
  );
}
