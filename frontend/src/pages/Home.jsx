import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import api from '../api/api'
import './Home.css'

export default function Home() {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchPosts = async () => {
    try {
      const res = await api.get('/api/posts')
      setPosts(res.data)
    } catch {
      setError('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [])

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="home-header">
        <div className="section-label">Latest stories</div>
        <h1 className="display-title home-title">What's new<br />on Pencraft</h1>
      </div>

      {/* States */}
      {loading && (
        <div className="home-loading">
          {[1,2,3].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton-meta" />
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-body" />
            </div>
          ))}
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div className="home-empty">
          <div className="home-empty-icon">✦</div>
          <p>No posts yet. Be the first to write something.</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard key={post.id} post={post} onLikeToggle={fetchPosts} />
          ))}
        </div>
      )}
    </div>
  )
}