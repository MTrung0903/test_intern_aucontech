import { useEffect, useState } from 'react';
import { getMyPosts, getAllPosts, deletePost, getPost, updatePost, searchPosts } from '../api/posts.js';
import {  useAuth } from '../auth/AuthContext.jsx';
import { Link } from 'react-router-dom';
import PostDetail from './PostDetail.jsx';
import './css/PostPage.css';


const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes} ${day}/${month}/${year} `;
};

export default function PostsPage() {
   const { token } = useAuth();
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  const [detailId, setDetailId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (isSearching && searchQuery.trim()) {
        res = await searchPosts(searchQuery.trim(), page, size);
      } else {
        res = tab === 'mine' ? await getMyPosts(page, size) : await getAllPosts(page, size);
      }
      setData(res);
    } catch (err) {
      setError(err?.response?.data || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [tab, page, size, isSearching, searchQuery]);

const onDelete = async (id, event) => {
    event.stopPropagation(); 
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      alert('Deleted');
      load();
    } catch (err) {
      alert(err?.response?.data || 'Delete failed');
    }
  };

  const openEdit = async (id, event) => {
    event.stopPropagation(); 
    setEditError(null);
    setEditingId(id);
    try {
      const p = await getPost(id);
      setEditForm({ title: p.title, content: p.content });
    } catch (err) {
      setEditError(err?.response?.data || 'Failed to load post');
    }
  };

  const closeEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', content: '' });
    setEditError(null);
  };

    const openDetail = (id) => {
    setDetailId(id);
  };

  const closeDetail = () => {
    setDetailId(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      setPage(0);
    } else {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setPage(0);
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setPage(0);
    setIsSearching(false);
    setSearchQuery('');
  };

  const CONTENT_MAX = 65535;
  const saveEdit = async () => {
    if (!editForm.title.trim()) { setEditError('Title is required'); return; }
    if (!editForm.content.trim()) { setEditError('Content is required'); return; }
    if (editForm.content.length > CONTENT_MAX) { setEditError(`Content exceeds ${CONTENT_MAX} characters`); return; }
    setEditLoading(true);
    setEditError(null);
    try {
      await updatePost(editingId, editForm);
      alert('Updated');
      closeEdit();
      load();
    } catch (err) {
      setEditError(err?.response?.data || 'Failed to update');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="posts-container">
      <h2>Posts</h2>
      
      {/* Search Form */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search posts by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
          {isSearching && (
            <button type="button" onClick={clearSearch} className="clear-search-button">
              Clear
            </button>
          )}
        </form>
      </div>

      <div className="tab-container">
        {token && 
        <button
          className="tab-button"
          onClick={() => handleTabChange('mine')}
          disabled={tab === 'mine' && !isSearching}
        >
          My Posts
        </button>
        }
        <button
          className="tab-button"
          onClick={() => handleTabChange('all')}
          disabled={tab === 'all' && !isSearching}
        >
          All Posts
        </button>
        <div className="new-post-link">
          <Link to="/posts/new">+ New Post</Link>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}
      {isSearching && searchQuery && (
        <div className="search-info">
          <p>Search results for: "<strong>{searchQuery}</strong>" ({data?.totalElements || 0} results)</p>
        </div>
      )}
      {!loading && data && (
        <>
          <ul className="posts-list">
            {data.content.map((p) => (
              <li key={p.id} className="post-item" onClick={() => openDetail(p.id)}>
                <div className="post-header">
                  <strong className="post-meta">author : {p.authorUsername}</strong>
                  
                  <small className="post-meta">{formatDate(p.createdAt)}</small>
                </div>
                <strong className="post-title" >{p.title}</strong>
                <p className="post-content">{p.content.slice(0, 160)}{p.content.length > 160 ? '…' : ''}</p>
                {!isSearching && tab === 'mine' && (
                  <div className="post-actions">
                    <button className="action-button" onClick={(e) => openEdit(p.id, e)}>Edit</button>
                    <button className="action-button" onClick={(e) => onDelete(p.id, e)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="pagination">
            <button
              className="pagination-button"
              disabled={page <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Prev
            </button>
            <span className="pagination-info">Page {data.number + 1} / {data.totalPages || 1}</span>
            <button
              className="pagination-button"
              disabled={data.number + 1 >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
            <select
              className="pagination-select"
              value={size}
              onChange={(e) => { setSize(parseInt(e.target.value)); setPage(0); }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </>
      )}

      {editingId !== null && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Edit Post</h3>
            {editError && <div className="error-message">{editError}</div>}
            <div className="edit-form">
              <label>Title</label>
              <input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
              <label>Content</label>
              <textarea
                rows={10}
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              />
              <div className={`char-count ${editForm.content.length > CONTENT_MAX ? 'exceeded' : ''}`}>
                {editForm.content.length} / {CONTENT_MAX}
              </div>
            </div>
            <div className="edit-actions">
              <button className="edit-button" onClick={closeEdit} disabled={editLoading}>
                Cancel
              </button>
              <button className="edit-button" onClick={saveEdit} disabled={editLoading}>
                {editLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {detailId !== null && (
        <PostDetail postId={detailId} onClose={closeDetail} formatDate={formatDate} />
      )}
    </div>
  );
}