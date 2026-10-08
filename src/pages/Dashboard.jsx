import useLocalStorage from '../hooks/useLocalStorage';
import './Dashboard.css';

function Dashboard() {
  const [books] = useLocalStorage('books', []);
  const [users] = useLocalStorage('users', []);

  const lowStock = books.filter((b) => b.quantity < 2);
  const totalCopies = books.reduce((sum, b) => sum + b.quantity, 0);

  return (
    <div className="page">
      <h2>Dashboard</h2>

      <div className="stats">
        <div className="stat-card">
          <h3>{books.length}</h3>
          <p>Unique Titles</p>
        </div>
        <div className="stat-card">
          <h3>{totalCopies}</h3>
          <p>Total Copies</p>
        </div>
        <div className="stat-card">
          <h3>{users.length}</h3>
          <p>Users</p>
        </div>
        <div className="stat-card warning">
          <h3>{lowStock.length}</h3>
          <p>Low Stock</p>
        </div>
      </div>

      <h3 className="section-title">Book Availability</h3>

      {books.length === 0 ? (
        <p className="empty-msg">No books available. Add some on the Books page.</p>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <div
              key={book.id}
              className={`book-card ${book.quantity < 2 ? 'low-stock' : ''}`}
            >
              <h4>{book.title}</h4>
              <p className="author">{book.author}</p>
              <p className="genre">{book.genre}</p>
              <p className="qty">Available: {book.quantity}</p>
              {book.quantity < 2 && <span className="badge">⚠ Low Stock</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;