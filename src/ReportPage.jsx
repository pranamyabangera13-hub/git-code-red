import { Link } from 'react-router-dom';
import ReportForm from './ReportForm';
import './App.css';

export default function ReportPage() {
  return (
    <div className="app">
      <nav className="navbar">
        <Link className="logo" to="/">
          <span className="logo-icon">S</span>
          SAHAYA
        </Link>

        <Link to="/" className="nav-button">
          Back to Home
        </Link>
      </nav>

      <main>
        <ReportForm />
      </main>

      <footer>
        <Link className="logo" to="/">SAHAYA</Link>
        <p>Built with compassion. Designed to connect people with care.</p>
      </footer>
    </div>
  );
}