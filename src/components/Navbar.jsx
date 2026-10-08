import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <h1>📚 Community Library</h1>
      <div className="nav-links">
        <NavLink to="/" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/books" className={linkClass}>Books</NavLink>
        <NavLink to="/transactions" className={linkClass}>Transactions</NavLink>
        <NavLink to="/users" className={linkClass}>Users</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;