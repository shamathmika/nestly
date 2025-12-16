import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "./ListingCard";
import "./../styles/home.css";

const apiBase = import.meta.env.VITE_API_BASE ?? "/api";

export default function Home() {
  const navigate = useNavigate();

  // search fields
  const [term, setTerm] = useState("");
  const [lease, setLease] = useState("");
  const [termError, setTermError] = useState(false);
  const [leaseError, setLeaseError] = useState(false);

  // featured listings
  const [featured, setFeatured] = useState([]);

  // community users
  const [users, setUsers] = useState([]);
  const carouselRef = useRef(null);

  // load featured listings
  useEffect(() => {
    Promise.all([
      fetch(`${apiBase}/listings/get-listings.php`).then((r) => r.json()),
      fetch(`${apiBase}/listings/get-top.php`, { credentials: "include" }).then(
        (r) => r.json()
      ),
    ])
      .then(async ([allListings, visitCounts]) => {
        const visitIds = Object.keys(visitCounts);

        if (visitIds.length > 0) {
          const sortedByVisits = visitIds
            .sort((a, b) => visitCounts[b] - visitCounts[a])
            .map((id) =>
              allListings.find((l) => String(l.id) === String(id))
            )
            .filter(Boolean)
            .slice(0, 3);

          if (sortedByVisits.length > 0) {
            setFeatured(sortedByVisits);
            return;
          }
        }

        let ratingData = [];

        for (let listing of allListings) {
          const reviews = await fetch(
            `${apiBase}/reviews/get-reviews.php?rental_id=${listing.id}`
          ).then((r) => r.json());

          if (reviews.length > 0) {
            const avg =
              reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

            ratingData.push({ listing, avg });
          }
        }

        ratingData.sort((a, b) => b.avg - a.avg);

        if (ratingData.length > 0) {
          setFeatured(ratingData.slice(0, 3).map((x) => x.listing));
          return;
        }

        setFeatured(allListings.slice(0, 3));
      })
      .catch((err) => console.error("Error loading featured:", err));
  }, []);

  // load users for community carousel
  useEffect(() => {
    fetch(`${apiBase}/get-community-users.php`)
      .then((r) => r.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error loading users:", err));
  }, []);

  // auto-scroll carousel
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const scrollAmount = 1; // px
    const interval = setInterval(() => {
      el.scrollLeft += scrollAmount;

      if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
        el.scrollLeft = 0; // loop to start
      }
    }, 30);

    return () => clearInterval(interval);
  }, [users]);

  // SEARCH HANDLER
  const handleSearch = () => {
    let hasError = false;

    if (!term) {
      setTermError(true);
      hasError = true;
    }
    if (!lease) {
      setLeaseError(true);
      hasError = true;
    }

    if (hasError) return;

    navigate(`/services?term=${term}&lease=${lease}`);
  };

  return (
    <main className="home">
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-card">
            <h1 className="hero-title">find your home away from home</h1>

            <div className="hero-form">

              <label className={termError ? "error-field" : ""}>
                Term
                <select
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value);
                    setTermError(false);
                  }}
                >
                  <option value="" disabled>Select term</option>
                  <option value="fall-2025">Fall 2025</option>
                  <option value="spring-2026">Spring 2026</option>
                  <option value="summer-2025">Summer 2025</option>
                  <option value="fall-2026">Fall 2026</option>
                </select>
              </label>

              <label className={leaseError ? "error-field" : ""}>
                Lease length
                <select
                  value={lease}
                  onChange={(e) => {
                    setLease(e.target.value);
                    setLeaseError(false);
                  }}
                >
                  <option value="" disabled>Select length</option>
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                </select>
              </label>

              <button onClick={handleSearch}>Search</button>

            </div>
          </div>
        </div>

        <div className="hero-image-container">
          <img
            src="https://images.unsplash.com/photo-1665686377065-08ba896d16fd?auto=format&fit=crop&w=2000"
            alt=""
            className="hero-bg-img"
          />
        </div>
      </section>

      {/* ================= FEATURED LISTINGS ================= */}
      <section className="section section--featured">
        <h2>Featured Listings</h2>
        <div className="cards">
          {featured.length === 0 ? (
            <p>No featured listings available.</p>
          ) : (
            featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          )}
        </div>
      </section>

      {/* ================= NEWS ================= */}
      <section className="section section--news">
        <h2>Latest News</h2>
        <div className="cards">
          <div className="card">Nestly launches roommate matching in 3 new cities.</div>
          <div className="card">New verified listings added near San Jose State University.</div>
          <div className="card">Now offering multilingual support for international students.</div>
        </div>
      </section>

      {/* ================= COMMUNITY USERS ================= */}
      <section className="section section--users">
        <h2>Meet Our Community</h2>

        <div className="user-carousel" ref={carouselRef}>
          {users.length === 0 ? (
            <p>No users available.</p>
          ) : (
            users.map((u) => (
              <div className="user-card" key={u.id}>
                {u.name}
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
