import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import './Books.css';

function Books() {
  const [books, setBooks] = useLocalStorage('books', []);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Form state
  const emptyForm = { title: '', author: '', genre: '', isbn: '', quantity: '' };
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const genres = [...new Set(books.map((b) => b.genre).filter(Boolean))];

  const filteredBooks = books.filter((b) => {
    const q = search.toLowerCase();
    const matchesSearch =
      b.title?.toLowerCase().includes(q) ||
      b.author?.toLowerCase().includes(q) ||
      b.genre?.toLowerCase().includes(q) ||
      b.isbn?.toLowerCase().includes(q);
    const matchesGenre = !genreFilter || b.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (book) => {
    setForm({ ...book });
    setEditing(book.id);
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setEditing(null);
    setErrors({});
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title required';
    if (!form.author.trim()) errs.author = 'Author required';
    if (!form.genre.trim()) errs.genre = 'Genre required';
    if (!form.isbn.trim()) errs.isbn = 'ISBN required';
    if (form.quantity === '' || Number(form.quantity) < 0)
      errs.quantity = 'Quantity must be 0 or more';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    const payload = { ...form, quantity: Number(form.quantity) };

    if (editing) {
      setBooks(books.map((b) => (b.id === editing ? { ...payload, id: editing } : b)));
    } else {
      setBooks([...books, { ...payload, id: Date.now() }]);
    }
    closeModal();
  };

  const deleteBook = (id) => {
    if (window.confirm('Delete this book?')) {
      setBooks(books.filter((b) => b.id !== id));
    }
  };

  return (
    <>
      <div className="page-actions">
        <div>
          <h3>Book Management</h3>
          <p>Add, edit or remove library books.</p>
        </div>
        <button className="primary-btn" onClick={openAdd}>Add New Book</button>
      </div>

      <div className="panel">
        <div className="toolbar">
          <input
            type="search"
            placeholder="Search by title, author, genre or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>In Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr><td colSpan="7">No books match your search.</td></tr>
              ) : (
                filteredBooks.map((b) => (
                  <tr key={b.id}>
                    <td>{b.title}</td>
                    <td>{b.author}</td>
                    <td>{b.genre}</td>
                    <td>{b.isbn}</td>
                    <td>{b.quantity}</td>
                    <td>
                      {b.quantity < 2
                        ? <span className="status-low">Low Stock</span>
                        : <span className="status-ok">Available</span>}
                    </td>
                    <td>
                      <button className="icon-btn edit" onClick={() => openEdit(b)}>Edit</button>
                      <button className="icon-btn delete" onClick={() => deleteBook(b.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{editing ? 'Edit Book' : 'Add New Book'}</h3>
                <p>Enter the book information below.</p>
              </div>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>

            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="field full-field">
                <label>Title</label>
                <input name="title" value={form.title} onChange={handleChange} />
                {errors.title && <span className="error">{errors.title}</span>}
              </div>
              <div className="field">
                <label>Author</label>
                <input name="author" value={form.author} onChange={handleChange} />
                {errors.author && <span className="error">{errors.author}</span>}
              </div>
              <div className="field">
                <label>Genre</label>
                <input name="genre" value={form.genre} onChange={handleChange} />
                {errors.genre && <span className="error">{errors.genre}</span>}
              </div>
              <div className="field">
                <label>ISBN</label>
                <input name="isbn" value={form.isbn} onChange={handleChange} />
                {errors.isbn && <span className="error">{errors.isbn}</span>}
              </div>
              <div className="field">
                <label>Initial Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={handleChange}
                />
                {errors.quantity && <span className="error">{errors.quantity}</span>}
              </div>

              <div className="modal-actions full-field">
                <button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="primary-btn">Save Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Books;