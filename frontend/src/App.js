import './App.css';
import './pages/css/Navbar.css';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PostsPage from './pages/PostPage.jsx';
import PostFormPage from './pages/PostFormPage.jsx';
import { AuthProvider, useAuth } from './auth/AuthContext.jsx';

import { RxAvatar } from "react-icons/rx";
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
const username = token ? jwtDecode(token).sub : null;
  return (
<nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-link">Home</Link>
        {token && <Link to="/posts/new" className="nav-link">New Post</Link>}
      </div>
      <div className="nav-right">
        {token ? (
          <>
            <div className="user-info">
              <RxAvatar className="nav-avatar" />
              <p className="username">{username || 'User'}</p>
            </div>
            <button
              className="nav-button"
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <div className="App-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/posts"
              element={
                <ProtectedRoute>
                  <PostsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/new"
              element={
                <ProtectedRoute>
                  <PostFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <PostFormPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}