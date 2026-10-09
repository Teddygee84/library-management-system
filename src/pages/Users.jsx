import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import './Users.css';

function Users() {
  // Seed data goes directly into the fallback value
  const seedUsers = [
    {
      id: 1,
      name: 'Molapo',
      membershipId: '1',
      role: 'Admin',
      password: 'Dash',
    },
  ];

  const [users, setUsers] = useLocalStorage('users', seedUsers);
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', null);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const emptyForm = { name: '', membershipId: '', role: 'Member', password: '' };
  const [form, setForm] = useState(emptyForm);

  // ===== LOGIN VIEW =====
  if (!currentUser) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <div className="brand-mark">CL</div>
          <h1>Community Library</h1>
          <p className="login-sub">Library Management System</p>

          <form
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              const membershipId = e.target.membership.value.trim();
              const user = users.find(
                (u) => u.membershipId.toLowerCase() === membershipId.toLowerCase()
              );
              if (!user) return alert('No user found with that Membership ID');
              setCurrentUser(user);
            }}
          >
            <label>Membership ID</label>
            <input name="membership" placeholder="e.g. ADM001" required />
            <label>Password</label>
            <input name="password" type="password" placeholder="Enter password" />
            <button className="primary-btn full" type="submit">Sign In</button>
          </form>

          <div className="demo-hint">
            <strong>Demo admin:</strong> 1 / Dash
          </div>
        </div>
      </div>
    );
  }

  // ===== ADMIN VIEW =====
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(q) ||
      u.membershipId?.toLowerCase().includes(q);
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setForm({ ...user, password: '' });
    setEditing(user.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setEditing(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.membershipId.trim()) {
      return alert('Name and Membership ID are required');
    }

    // Check duplicate membership ID
    const duplicate = users.find(
      (u) =>
        u.membershipId.toLowerCase() === form.membershipId.toLowerCase() &&
        u.id !== editing
    );
    if (duplicate) return alert('Membership ID already exists');

    if (editing) {
      setUsers(
        users.map((u) => (u.id === editing ? { ...u, ...form, id: editing } : u))
      );
      if (currentUser.id === editing) {
        setCurrentUser({ ...currentUser, ...form, id: editing });
      }
    } else {
      const newUser = { ...form, id: Date.now() };
      setUsers([...users, newUser]);
    }
    closeModal();
  };

  const deleteUser = (id) => {
    if (id === currentUser.id) {
      return alert("You can't delete yourself while logged in");
    }
    if (window.confirm('Delete this user?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const logout = () => setCurrentUser(null);

  return (
    <>
      <div className="page-actions">
        <div>
          <h3>User Management</h3>
          <p>Manage library members and administrator accounts.</p>
        </div>
        <div className="page-actions-right">
          <span className="whoami">
            Logged in: <strong>{currentUser.name}</strong>
          </span>
          <button className="primary-btn" onClick={openAdd}>Add New User</button>
          <button className="danger-outline" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="panel">
        <div className="toolbar">
          <input
            type="search"
            placeholder="Search by name or membership ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All roles</option>
            <option>Admin</option>
            <option>Librarian</option>
            <option>Member</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Membership ID</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4">No users match your search.</td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.membershipId}</td>
                    <td>
                      <span className="role-tag">{u.role}</span>
                    </td>
                    <td>
                      <button
                        className="icon-btn edit"
                        onClick={() => openEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => deleteUser(u.id)}
                      >
                        Delete
                      </button>
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
          <div
            className="modal-card small-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h3>{editing ? 'Edit User' : 'Add New User'}</h3>
                <p>
                  {editing ? 'Update user details.' : 'Create a library account.'}
                </p>
              </div>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="field full-field">
                <label>Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="field full-field">
                <label>Membership ID</label>
                <input
                  name="membershipId"
                  value={form.membershipId}
                  onChange={handleChange}
                />
              </div>
              <div className="field full-field">
                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option>Member</option>
                  <option>Librarian</option>
                  <option>Admin</option>
                </select>
              </div>
              <div className="field full-field">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Default: library123"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-actions full-field">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Users;