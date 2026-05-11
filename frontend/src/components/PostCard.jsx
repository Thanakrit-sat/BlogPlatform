import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/api'
import './PostCard.css'

export default function PostCard({ post, onLikeToggle }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0)
  const [liking, setLiking] = useState(false)

  const handleLike = async (e) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    if (liking) return
    setLiking(true)
    try {
      const res = await api.post(`/api/posts/${post.id}/like`)
      setLiked(res.data.liked)
      setLikeCount(res.data.likeCount)
      onLikeToggle?.()
    } catch (err) {
      console.error(err)
    } finally {
      setLiking(false)
    }
  }

  const handleShare = async (e) => {
    e.stopPropagation()
    try {
      const res = await api.get(`/api/posts/${post.id}/share`)
      await navigator.clipboard.writeText(res.data.url)
      alert('Link copied!')
    } catch {
      await navigator.clipboard.writeText(window.location.origin + '/posts/' + post.id)
      alert('Link copied!')
    }
  }

  const date = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })
    : ''

  return (
    <article
      className="post-card"
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      {/* Meta */}
      <div className="post-card-meta">
        <div className="post-card-author">
          <div className="post-card-avatar">
            {post.authorUsername?.[0]?.toUpperCase()}
          </div>
          <span>{post.authorUsername}</span>
        </div>
        <span className="post-card-date">{date}</span>
      </div>

      {/* Content */}
      <h2 className="post-card-title">{post.title}</h2>
      <p className="post-card-excerpt">
        {post.content?.length > 160
          ? post.content.slice(0, 160) + '…'
          : post.content}
      </p>

      {/* Footer */}
      <div className="post-card-footer">
        <div className="post-card-actions">
          <button
            className={`post-action-btn${liked ? ' post-action-btn--liked' : ''}`}
            onClick={handleLike}
            disabled={liking}
          >
            <span>{liked ? '♥' : '♡'}</span>
            <span>{likeCount}</span>
          </button>

          <button className="post-action-btn" onClick={handleShare}>
            <span>↗</span>
            <span>Share</span>
          </button>
        </div>

        <div className="post-card-comments">
          <span>◎</span>
          <span>{post.commentCount ?? 0} comments</span>
        </div>
      </div>
    </article>
  )
}