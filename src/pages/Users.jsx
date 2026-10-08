import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import './Users.css';

function Users() {
  const [users, setUsers] = useLocalStorage('users', []);
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', null);

  const [form, setForm] = useState({ name: '', membershipId: '', role: 'member' });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.membershipId.trim()) {
      return alert('Name and Membership ID are required');
    }

    if (editingId) {
      // Update existing user
      setUsers(users.map((u) => (u.id === editingId ? { ...u, ...form } : u)));
      setEditingId(null);
    } else {
      // Add new user
      const newUser = { ...form, id: Date.now() };
      setUsers([...users, newUser]);
    }

    setForm({ name: '', membershipId: '', role: 'member' });
  };

  const editUser = (user) => {
    setForm({ name: user.name, membershipId: user.membershipId, role: user.role });
    setEditingId(user.id);
  };

  const deleteUser = (id) => {
    if (window.confirm('Delete this user?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const login = (user) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  // ===== LOGIN VIEW (not logged in) =====
  if (!currentUser) {
    return (
      <div className="page">
        <h2>Login</h2>
        <p className="hint">Select a user to log in as:</p>

        {users.length === 0 ? (
          <p className="empty-msg">No users yet. Create one below.</p>
        ) : (
          <ul className="user-list">
            {users.map((u) => (
              <li key={u.id}>
                <div>
                  <strong>{u.name}</strong>{' '}
                  <span className="role-tag">{u.role}</span>
                  <br />
                  <small>ID: {u.membershipId}</small>
                </div>
                <button onClick={() => login(u)}>Login</button>
              </li>
            ))}
          </ul>
        )}

        <h3 className="section-title">Create New User</h3>
        <form className="user-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="membershipId"
            placeholder="Membership ID"
            value={form.membershipId}
            onChange={handleChange}
          />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="member">Member</option>
            <option value="librarian">Librarian</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Add User</button>
        </form>
      </div>
    );
  }

  // ===== ADMIN VIEW (logged in) =====
  return (
    <div className="page">
      <div className="user-header">
        <div>
          <h2>User Management</h2>
          <p>
            Logged in as: <strong>{currentUser.name}</strong>{' '}
            <span className="role-tag">{currentUser.role}</span>
          </p>
        </div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <form className="user-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="membershipId"
          placeholder="Membership ID"
          value={form.membershipId}
          onChange={handleChange}
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="member">Member</option>
          <option value="librarian">Librarian</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">{editingId ? 'Save Changes' : 'Add User'}</button>
        {editingId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setEditingId(null);
              setForm({ name: '', membershipId: '', role: 'member' });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Membership ID</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4">No users yet.</td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.membershipId}</td>
                <td><span className="role-tag">{u.role}</span></td>
                <td>
                  <button onClick={() => editUser(u)}>Update</button>
                  <button onClick={() => deleteUser(u.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Users;