import { useEffect, useState } from "react";
import ListingCard from "./ListingCard";
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
        const idStrings = ids.map((id) => String(id));

        const filtered = allListings.filter((p) =>
          idStrings.includes(String(p.id))
        );

        const ordered = idStrings
          .map((id) => filtered.find((p) => String(p.id) === id))
          .filter(Boolean);

        setListings(ordered);
      })
      .catch((err) => console.error("Error loading recent:", err));
  }, []);

  return (
    <div>
      <h2>Last 5 Visited Listings</h2>

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
