import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost, getPost, updatePost } from '../api/posts.js';
import './css/PostFormPage.css';

export default function PostFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // MySQL TEXT max length is 65,535 bytes; assume utf-8 ~ 65,535 chars upper bound
  const CONTENT_MAX = 65535;

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      try {
        const p = await getPost(Number(id));
        setForm({ title: p.title, content: p.content });
      } catch (err) {
        setError(err?.response?.data || 'Failed to load post');
      }
    };
    load();
  }, [id, isEdit]);

  const validate = () => {
    if (!form.title.trim()) return 'Title is required';
    if (!form.content.trim()) return 'Content is required';
    if (form.content.length > CONTENT_MAX) return `Content exceeds ${CONTENT_MAX} characters`;
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await updatePost(Number(id), form);
        alert('Updated');
      } else {
        await createPost(form);
        alert('Created');
      }
      navigate('/posts');
    } catch (err) {
      setError(err?.response?.data || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate('/posts');
  };

  return (
    <div className="post-form-container">
      <h2>{isEdit ? 'Edit Post' : 'New Post'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={onSubmit} className="post-form">
        <div className="form-group">
          <label>Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            rows={10}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <div className={`char-count ${form.content.length > CONTENT_MAX ? 'exceeded' : ''}`}>
            {form.content.length} / {CONTENT_MAX}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="form-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="form-button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}