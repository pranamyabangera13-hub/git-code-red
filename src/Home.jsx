import { Link } from 'react-router-dom';
import './App.css';

export default function Home() {
return (
<div className="app">
<nav className="navbar">
<Link className="logo" to="/">
<span className="logo-icon">S</span>
SAHAYA
</Link>

    <div className="nav-links">
      <a href="#home">Home</a>
      <a href="#about">About Us</a>
      <a href="#help">How It Works</a>
    </div>

    <Link to="/report" className="nav-button">
      Report a Case
    </Link>
  </nav>

  <main>
    <section className="hero" id="home">
      <div className="hero-content">
        <span className="eyebrow">
          EVERY LIFE DESERVES CARE
        </span>

        <h1>
          A little care can
          <br />
          change a <span>life.</span>
        </h1>

        <p>
          Help connect vulnerable people with the care,
          shelter, and support they deserve. One report
          can be the beginning of a new hope.
        </p>

        <div className="hero-actions">
          <Link to="/report" className="primary-button">
            Report Someone in Need →
          </Link>

          <a href="#help" className="secondary-button">
            Learn How It Works
          </a>
        </div>

        <div className="trust-note">
          <span>♡</span>
          Compassion starts with noticing.
        </div>
      </div>

      <div className="hero-art">
        <img
          className="hero-photo"
          src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=85"
          alt="Community members coming together to help others"
        />
      </div>
    </section>

    <section className="mission" id="about">
      <div>
        <span className="section-label">OUR MISSION</span>
        <h2>Notice a need. Make a difference.</h2>
      </div>

      <p>
        SAHAYA brings communities and support organizations
        together to help people who may be lost, abandoned,
        or in need of assistance.
      </p>
    </section>

    <section className="steps" id="help">
      <span className="section-label">
        SIMPLE STEPS, REAL IMPACT
      </span>

      <h2>Helping starts with you.</h2>

      <div className="step-grid">
        <article className="step-card">
          <div className="step-icon">♡</div>
          <h3>01. Notice</h3>
          <p>
            See someone who may need care or support in a
            public place.
          </p>
        </article>

        <article className="step-card">
          <div className="step-icon">＋</div>
          <h3>02. Report</h3>
          <p>
            Share the situation and location through our
            reporting form.
          </p>
        </article>

        <article className="step-card">
          <div className="step-icon">✧</div>
          <h3>03. Connect</h3>
          <p>
            Appropriate support organizations can review
            reports and coordinate assistance.
          </p>
        </article>
      </div>
    </section>
  </main>

  <footer>
    <Link className="logo" to="/">SAHAYA</Link>
    <p>
      Built with compassion. Designed to connect people with care.
    </p>
    <span>© 2026 SAHAYA · Community Care Initiative</span>
  </footer>
</div>

);
}