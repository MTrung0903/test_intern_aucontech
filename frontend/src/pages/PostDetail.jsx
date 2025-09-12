import { useEffect, useState } from 'react';
import { getPost } from '../api/posts.js';
import './css/PostDetail.css';

export default function PostDetail({ postId, onClose, formatDate }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const p = await getPost(postId);
        setPost(p);
      } catch (err) {
        setError(err?.response?.data || 'Failed to load post details');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [postId]);

  return (
    <div className="detail-modal">
      <div className="detail-modal-content">
        <h3>Post Details</h3>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <p className="loading-message">Loading post...</p>
        ) : post ? (
          <div className="detail-content">
            <h4 className="detail-title">{post.title}</h4>
            <p className="detail-meta">By {post.authorUsername} at {formatDate(post.createdAt)}</p>
            <p className="detail-text">{post.content}</p>
          </div>
        ) : null}
        <div className="detail-actions">
          <button className="detail-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}