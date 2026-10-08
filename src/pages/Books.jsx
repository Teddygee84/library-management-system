import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import BookForm from '../components/BookForm';
import './Books.css';

function Books() {
  const [books, setBooks] = useLocalStorage('books', []);
  const [editingBook, setEditingBook] = useState(null);

  // Add a new book
  const addBook = (book) => {
    const newBook = { ...book, id: Date.now() };
    setBooks([...books, newBook]);
  };

  // Update an existing book
  const updateBook = (updated) => {
    setBooks(books.map((b) => (b.id === updated.id ? updated : b)));
    setEditingBook(null);
  };

  // Delete a book
  const deleteBook = (id) => {
    if (window.confirm('Delete this book?')) {
      setBooks(books.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="page">
      <h2>Book Management</h2>

      <BookForm
        key={editingBook ? editingBook.id : 'new'}
        initialData={editingBook}
        onSubmit={editingBook ? updateBook : addBook}
      />

      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>Qty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan="6">No books yet. Add one above.</td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>{book.quantity}</td>
                <td>
                  <button onClick={() => setEditingBook(book)}>Update</button>
                  <button onClick={() => deleteBook(book.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Books;