import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { useTheme } from '../context/useTheme';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const borrowedCount = useAppSelector((state) => state.books.borrowedBooks.length);

  return (
    <header className="app-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">📚</span>
          <span className="brand-title">Mini Library</span>
        </Link>

        <nav className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Tra Cứu Sách
          </Link>
          <Link
            to="/stats"
            className={`nav-link ${location.pathname === '/stats' ? 'active' : ''}`}
          >
            Thống Kê
          </Link>
        </nav>

        <div className="navbar-actions">
          <span className="borrow-badge" title="Số lượng sách bạn đang mượn">
            Đang mượn: <strong>{borrowedCount}/3</strong>
          </span>

          <button
            type="button"
            className="btn-theme-toggle"
            onClick={toggleTheme}
            aria-label="Chuyển chế độ giao diện"
          >
            {theme === 'light' ? '🌙 Tối' : '☀️ Sáng'}
          </button>
        </div>
      </div>
    </header>
  );
}
