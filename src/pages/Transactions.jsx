import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import './Transactions.css';

function Transactions() {
  const [books, setBooks] = useLocalStorage('books', []);
  const [transactions, setTransactions] = useLocalStorage('transactions', []);

  const [selectedBookId, setSelectedBookId] = useState('');
  const [amount, setAmount] = useState(1);
  const [type, setType] = useState('borrow');

  const handleSubmit = (e) => {
    e.preventDefault();

    const book = books.find((b) => b.id === Number(selectedBookId));
    if (!book) return alert('Please select a book');

    const qty = Number(amount);
    if (qty <= 0) return alert('Amount must be greater than 0');

    if (type === 'borrow' && book.quantity < qty) {
      return alert(`Not enough stock. Only ${book.quantity} available.`);
    }

    // Update book stock
    const newQuantity = type === 'borrow' ? book.quantity - qty : book.quantity + qty;
    setBooks(
      books.map((b) => (b.id === book.id ? { ...b, quantity: newQuantity } : b))
    );

    // Log the transaction
    const tx = {
      id: Date.now(),
      bookTitle: book.title,
      type,
      amount: qty,
      date: new Date().toLocaleString(),
    };
    setTransactions([tx, ...transactions]);

    // Reset form
    setSelectedBookId('');
    setAmount(1);
    setType('borrow');
  };

  return (
    <div className="page">
      <h2>Transactions</h2>

      <form className="tx-form" onSubmit={handleSubmit}>
        <select
          value={selectedBookId}
          onChange={(e) => setSelectedBookId(e.target.value)}
        >
          <option value="">-- Select Book --</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} ({b.quantity} in stock)
            </option>
          ))}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="borrow">Borrow (Deduct)</option>
          <option value="add">Add Stock</option>
        </select>

        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button type="submit">Record</button>
      </form>

      <h3 className="section-title">Transaction History</h3>

      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Book</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="4">No transactions yet.</td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.bookTitle}</td>
                <td>
                  <span className={`tx-badge ${t.type}`}>
                    {t.type === 'borrow' ? 'Borrowed' : 'Added'}
                  </span>
                </td>
                <td>{t.amount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;