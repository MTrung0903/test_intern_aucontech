import { useState } from 'react';
import { login } from '../api/auth.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import './css/LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: doLogin } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(form);
      doLogin(res.token);
      navigate('/posts');
    } catch (err) {
      setError(err?.response?.data || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={onSubmit} className="login-form">
        <div className="form-group">
          <label>Username</label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <p className="register-link">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}