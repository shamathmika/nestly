import { useEffect, useState } from "react";
import ListingCard from "./ListingCard";
import "./../styles/home.css";

const apiBase = import.meta.env.VITE_API_BASE ?? "/api";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${apiBase}/listings/get-listings.php`).then((r) => r.json()),
      fetch(`${apiBase}/listings/get-top.php`, { credentials: "include" }).then(
        (r) => r.json()
      ),
    ])
      .then(async ([allListings, visitCounts]) => {
        const visitIds = Object.keys(visitCounts);

        // 1. CASE: Most visited listings exist
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

        // 2. CASE: No visits → fallback to best-rated listings
        let ratingData = [];

        for (let listing of allListings) {
          const reviews = await fetch(
            `${apiBase}/reviews/get-reviews.php?rental_id=${listing.id}`
          ).then((r) => r.json());

          if (reviews.length > 0) {
            const avgRating =
              reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            ratingData.push({ listing, avgRating });
          }
        }

        ratingData.sort((a, b) => b.avgRating - a.avgRating);

        if (ratingData.length > 0) {
          setFeatured(ratingData.slice(0, 3).map((obj) => obj.listing));
          return;
        }

        // 3. CASE: No ratings → fallback to first 3 listings
        setFeatured(allListings.slice(0, 3));
      })
      .catch((err) => console.error("Error loading featured listings:", err));
  }, []);

  return (
    <main className="home">
      {/* ========================================= */}
      {/* HERO SECTION — DO NOT TOUCH (AS REQUESTED) */}
      {/* ========================================= */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-card">
            <h1 className="hero-title">find your home away from home</h1>

            <div className="hero-form">
              <label>
                Term
                <select defaultValue="">
                  <option value="" disabled>Select term</option>
                  <option value="fall-2025">Fall 2025</option>
                  <option value="spring-2026">Spring 2026</option>
                  <option value="summer-2026">Summer 2026</option>
                </select>
              </label>

              <label>
                Lease length
                <select defaultValue="">
                  <option value="" disabled>Select length</option>
                  <option value="6-months">6 months</option>
                  <option value="12-months">12 months</option>
                </select>
              </label>

              <button>Search</button>
            </div>
          </div>
        </div>

        <div className="hero-image-container">
          <img
            src="https://images.unsplash.com/photo-1665686377065-08ba896d16fd?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2000"
            alt="Home background"
            className="hero-bg-img"
          />
        </div>
      </section>

      {/* ========================================= */}
      {/* FEATURED LISTINGS — UPDATED ONLY */}
      {/* ========================================= */}
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

      {/* NEWS SECTION — unchanged */}
      <section className="section section--news">
        <h2>Latest News</h2>
        <div className="cards">
          <div className="card">News 1</div>
          <div className="card">News 2</div>
          <div className="card">News 3</div>
        </div>
      </section>

      {/* USERS SECTION — unchanged */}
      <section className="section section--users">
        <h2>Meet Our Community</h2>
        <div className="user-carousel">
          <div className="user-card">Mary Smith</div>
          <div className="user-card">John Wang</div>
          <div className="user-card">Alex Bington</div>
          <div className="user-card">Sophia Ray</div>
          <div className="user-card">Emma Park</div>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Nestly • Your home away from home.</p>
      </footer>
    </main>
  );
}
