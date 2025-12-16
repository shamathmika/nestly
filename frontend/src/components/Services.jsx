import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import ListingCard from "./ListingCard";
import "./../styles/home.css";

const apiBase = import.meta.env.VITE_API_BASE ?? "/api";

export default function Services() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const selectedTerm = params.get("term") || "";
  const selectedLease = params.get("lease") || "";

  const [term, setTerm] = useState(selectedTerm);
  const [lease, setLease] = useState(selectedLease);
  const [listings, setListings] = useState([]);

  const search = () => {
    if (!term || !lease) return;
    navigate(`/services?term=${term}&lease=${lease}`);
  };

  useEffect(() => {
    if (selectedTerm && selectedLease) {
      fetch(
        `${apiBase}/listings/search.php?term=${selectedTerm}&lease=${selectedLease}`
      )
        .then((r) => r.json())
        .then((data) => setListings(data))
        .catch((err) => console.error("Search error:", err));
      return;
    }

    fetch(`${apiBase}/listings/get-listings.php`)
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch((err) => console.error("Load listings error:", err));
  }, [selectedTerm, selectedLease]);

  return (
    <div className="services-page">

      <h2>Available Rentals</h2>

      {/* SEARCH BAR */}
      <div className="services-search">
        
        <label>
          Term
          <select value={term} onChange={(e) => setTerm(e.target.value)}>
            <option value="" disabled>Select term</option>
            <option value="fall-2025">Fall 2025</option>
            <option value="spring-2026">Spring 2026</option>
            <option value="summer-2025">Summer 2025</option>
            <option value="fall-2026">Fall 2026</option>
          </select>
        </label>

        <label>
          Lease Length
          <select value={lease} onChange={(e) => setLease(e.target.value)}>
            <option value="" disabled>Select length</option>
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="12">12 months</option>
            <option value="24">24 months</option>
          </select>
        </label>

        <button className="services-search-btn" onClick={search}>
          Search
        </button>

      </div>

      {/* RESULTS */}
      <div className="cards">
        {listings.length === 0 ? (
          <p className="no-results">No results to display.</p>
        ) : (
          listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        )}
      </div>

    </div>
  );
}
