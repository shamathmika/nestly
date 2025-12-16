import { useEffect, useState } from "react";
import ListingCard from "./ListingCard";
import { Link } from "react-router-dom";
import "./../styles/home.css";

const apiBase = import.meta.env.VITE_API_BASE ?? "/api";

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

      <div className="cards">
        {listings.map((p) => (
          <ListingCard key={p.id} listing={p} />
        ))}
      </div>
    </div>
  );
}
