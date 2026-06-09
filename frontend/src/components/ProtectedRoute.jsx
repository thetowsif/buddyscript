import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data?.user || null))
      .catch(() => setUser(null))
  }, [])

  if (user === undefined) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
