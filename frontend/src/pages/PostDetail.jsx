import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/api'
import './PostDetail.css'

export default function PostDetail() {
  const { id }   = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [post, setPost]         = useState(null)
  const [comments, setComments] = useState([])
  const [liked, setLiked]       = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comment, setComment]   = useState('')
  const [loading, setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/api/posts/${id}`),
          api.get(`/api/posts/${id}/comments`),
        ])
        setPost(postRes.data)
        setLikeCount(postRes.data.likeCount ?? 0)
        setComments(commentsRes.data)
      } catch {
        setError('Post not found')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleLike = async () => {
    if (!user) { navigate('/login'); return }
    try {
      const res = await api.post(`/api/posts/${id}/like`)
      setLiked(res.data.liked)
      setLikeCount(res.data.likeCount)
    } catch (err) { console.error(err) }
  }

  const handleComment = async e => {
    e.preventDefault()
    if (!comment.trim() || !user) return
    setSubmitting(true)
    try {
      const res = await api.post(`/api/posts/${id}/comments`, { content: comment })
      setComments(c => [...c, res.data])
      setComment('')
    } catch (err) { console.error(err) } finally {
      setSubmitting(false)
    }
  }

  const handleShare = async () => {
    try {
      const res = await api.get(`/api/posts/${id}/share`)
      await navigator.clipboard.writeText(res.data.url)
      alert('Link copied!')
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied!')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return
    try {
      await api.delete(`/api/posts/${id}`)
      navigate('/')
    } catch (err) { console.error(err) }
  }

  if (loading) return <div className="detail-loading">Loading…</div>
  if (error)   return <div className="alert alert-error">{error}</div>

  const date = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    : ''

  return (
    <div className="detail-page page-enter">

      {/* Back */}
      <button className="detail-back" onClick={() => navigate('/')}>
        ← Back
      </button>

      {/* Article */}
      <article className="detail-article">
        <header className="detail-header">
          <div className="detail-meta">
            <div className="detail-author">
              <div className="detail-avatar">
                {post.authorUsername?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="detail-author-name">{post.authorUsername}</div>
                <div className="detail-date">{date}</div>
              </div>
            </div>
          </div>
          <h1 className="detail-title display-title">{post.title}</h1>
        </header>

        <div className="detail-content">{post.content}</div>

        {/* Actions */}
        <div className="detail-actions">
          <button
            className={`detail-action-btn${liked ? ' detail-action-btn--liked' : ''}`}
            onClick={handleLike}
          >
            <span>{liked ? '♥' : '♡'}</span>
            <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
          </button>

          <button className="detail-action-btn" onClick={handleShare}>
            ↗ Share
          </button>

          {user?.username === post.authorUsername && (
            <button
              className="detail-action-btn detail-action-btn--danger"
              onClick={handleDelete}
            >
              ✕ Delete
            </button>
          )}
        </div>
      </article>

      {/* Comments */}
      <section className="comments-section">
        <div className="section-label">Discussion</div>
        <h2 className="comments-title">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h2>

        {/* Comment form */}
        {user ? (
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              className="input comment-input"
              placeholder="Share your thoughts…"
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={submitting || !comment.trim()}
            >
              {submitting ? <span className="spinner" /> : 'Post comment'}
            </button>
          </form>
        ) : (
          <div className="comment-login-prompt">
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>
              Sign in to comment
            </button>
          </div>
        )}

        {/* Comment list */}
        <div className="comment-list">
          {comments.map(c => (
            <div key={c.id} className="comment-item">
              <div className="comment-avatar">
                {c.author?.username?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="comment-body">
                <div className="comment-meta">
                  <span className="comment-name">{c.author?.username}</span>
                  <span className="comment-time">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric'
                        })
                      : ''}
                  </span>
                </div>
                <p className="comment-text">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}