import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import './Transactions.css';

function Transactions() {
  const [books, setBooks] = useLocalStorage('books', []);
  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [currentUser] = useLocalStorage('currentUser', null);

  const [bookId, setBookId] = useState('');
  const [type, setType] = useState('add');
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const book = books.find((b) => b.id === Number(bookId));
    if (!book) return alert('Please select a book');

    const amount = Number(qty);
    if (amount <= 0) return alert('Quantity must be greater than 0');

    if (type === 'borrow' && book.quantity < amount) {
      return alert(`Not enough stock. Only ${book.quantity} available.`);
    }

    const newQuantity = type === 'borrow' ? book.quantity - amount : book.quantity + amount;
    setBooks(books.map((b) => (b.id === book.id ? { ...b, quantity: newQuantity } : b)));

    const tx = {
      id: Date.now(),
      bookTitle: book.title,
      type,
      amount,
      note: note.trim(),
      by: currentUser ? currentUser.name : 'Guest',
      date: new Date().toLocaleString(),
    };
    setTransactions([tx, ...transactions]);

    setBookId('');
    setType('add');
    setQty(1);
    setNote('');
  };

  const clearHistory = () => {
    if (window.confirm('Clear all transaction history? This cannot be undone.')) {
      setTransactions([]);
    }
  };

  return (
    <>
      <div className="page-actions">
        <div>
          <h3>Stock Transactions</h3>
          <p>Add new stock or record borrowed copies.</p>
        </div>
      </div>

      <div className="transaction-layout">
        {/* Record Transaction */}
        <div className="panel">
          <h3 className="panel-title">Record Transaction</h3>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field full-field">
              <label>Book</label>
              <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
                <option value="">-- Select Book --</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.quantity} in stock)
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Transaction Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="add">Add Stock</option>
                <option value="borrow">Borrow / Deduct</option>
              </select>
            </div>

            <div className="field">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </div>

            <div className="field full-field">
              <label>Note</label>
              <input
                type="text"
                placeholder="Optional note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button className="primary-btn full-field" type="submit">
              Save Transaction
            </button>
          </form>
        </div>

        {/* Transaction History */}
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Transaction History</h3>
              <p>Complete stock movement log</p>
            </div>
            {transactions.length > 0 && (
              <button className="danger-outline" onClick={clearHistory}>
                Clear History
              </button>
            )}
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Book</th>
                  <th>Type</th>
                  <th>Qty.</th>
                  <th>Note</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan="6">No transactions yet.</td></tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id}>
                      <td className="small-td">{t.date}</td>
                      <td>{t.bookTitle}</td>
                      <td>
                        <span className={`tx-badge ${t.type}`}>
                          {t.type === 'borrow' ? 'Borrow' : 'Add'}
                        </span>
                      </td>
                      <td>{t.amount}</td>
                      <td>{t.note || '—'}</td>
                      <td>{t.by}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Transactions;