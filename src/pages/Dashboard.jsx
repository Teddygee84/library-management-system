import useLocalStorage from '../hooks/useLocalStorage';
import './Dashboard.css';

function Dashboard() {
  const [books] = useLocalStorage('books', []);
  const [users] = useLocalStorage('users', []);
  const [transactions] = useLocalStorage('transactions', []);

  const lowStock = books.filter((b) => b.quantity < 2);
  const totalCopies = books.reduce((sum, b) => sum + b.quantity, 0);

  return (
    <div className="dashboard">
      {/* Stat cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">T</span>
          <div>
            <small>Total Titles</small>
            <strong>{books.length}</strong>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">C</span>
          <div>
            <small>Total Copies</small>
            <strong>{totalCopies}</strong>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">L</span>
          <div>
            <small>Low Stock</small>
            <strong>{lowStock.length}</strong>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">M</span>
          <div>
            <small>Members</small>
            <strong>{users.length}</strong>
          </div>
        </div>
      </div>

      <div className="section-grid">
        {/* Availability panel */}
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Current Availability</h3>
              <p>Books currently held by the library</p>
            </div>
            <a className="secondary-btn" href="/books">Manage Books</a>
          </div>

          <div className="table-wrap">
            {books.length === 0 ? (
              <p className="empty-msg">No books yet. Add some on the Books page.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>ISBN</th>
                    <th>Available</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>{book.isbn}</td>
                      <td>{book.quantity}</td>
                      <td>
                        {book.quantity < 2 ? (
                          <span className="status-low">Low Stock</span>
                        ) : (
                          <span className="status-ok">Available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent activity panel */}
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Recent Activity</h3>
              <p>Latest stock transactions</p>
            </div>
          </div>

          <div className="activity-list">
            {transactions.length === 0 ? (
              <p className="empty-msg">No activity yet.</p>
            ) : (
              transactions.slice(0, 8).map((t) => (
                <div key={t.id} className="activity-item">
                  <span className={`dot ${t.type}`}></span>
                  <div>
                    <strong>{t.bookTitle}</strong>
                    <small>
                      {t.type === 'borrow' ? 'Borrowed' : 'Added'} {t.amount} • {t.date}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;