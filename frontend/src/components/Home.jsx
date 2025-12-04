import "./../styles/home.css";

export default function Home() {
  return (
    <main className="home">
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


      <section className="section section--featured">
        <h2>Featured Listings</h2>
        <div className="cards">
          <div className="card">Listing 1</div>
          <div className="card">Listing 2</div>
          <div className="card">Listing 3</div>
        </div>
      </section>

      <section className="section section--news">
        <h2>Latest News</h2>
        <div className="cards">
          <div className="card">News 1</div>
          <div className="card">News 2</div>
          <div className="card">News 3</div>
        </div>
      </section>

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
