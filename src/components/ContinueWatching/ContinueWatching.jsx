import React, { useEffect, useRef, useState } from 'react'
import './ContinueWatching.css'
import { Link } from 'react-router-dom'
import { auth, getContinueWatching, removeFromContinueWatching } from '../../firebase'

const ContinueWatching = () => {
  const [items, setItems] = useState([])
  const listRef = useRef()

  const handleWheel = (event) => {
    event.preventDefault()
    if (listRef.current) listRef.current.scrollLeft += event.deltaY
  }

  useEffect(() => {
    const fetchList = async () => {
      if (auth.currentUser) {
        const data = await getContinueWatching(auth.currentUser.uid)
        setItems(data)
      }
    }
    fetchList()
    const cr = listRef.current
    if (cr) cr.addEventListener('wheel', handleWheel)
    return () => { if (cr) cr.removeEventListener('wheel', handleWheel) }
  }, [])

  if (!items || items.length === 0) return null

  return (
    <div className="continue-watching">
      <h2>Continue Watching</h2>
      <div className="cw-list" ref={listRef}>
        {items.map(item => (
          <div className="cw-card" key={item.id}>
            <Link to={`/player/${item.type}/${item.movieId}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title}
              />
              <p>{item.title}</p>
            </Link>
            <button
              className="cw-remove"
              onClick={async (e) => {
                e.preventDefault()
                await removeFromContinueWatching(item.id)
                setItems(items.filter(i => i.id !== item.id))
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContinueWatching
