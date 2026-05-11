import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import './CreatePost.css'

export default function CreatePost() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ title: '', content: '' })
  const [error, setError]   = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/api/posts', form)
      navigate(`/posts/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  const wordCount = form.content.trim()
    ? form.content.trim().split(/\s+/).length
    : 0

  return (
    <div className="create-page page-enter">
      <div className="create-header">
        <div className="section-label">New story</div>
        <h1 className="display-title">Write something</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="create-form">
        <input
          className="create-title-input"
          type="text"
          name="title"
          placeholder="Your title here…"
          value={form.title}
          onChange={handleChange}
          maxLength={200}
        />

        <div className="create-editor-wrap">
          <textarea
            className="create-content-input"
            name="content"
            placeholder="Tell your story…"
            value={form.content}
            onChange={handleChange}
          />
          <div className="create-word-count">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </div>
        </div>

        <div className="create-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : '✦ Publish'}
          </button>
        </div>
      </form>
    </div>
  )
}