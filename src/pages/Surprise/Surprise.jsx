import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import { auth, addToMyList } from '../../firebase'
import './Surprise.css'

const categories = [
  { label: 'Action', genre: '28', emoji: '💥' },
  { label: 'Comedy', genre: '35', emoji: '😂' },
  { label: 'Horror', genre: '27', emoji: '😱' },
  { label: 'Romance', genre: '10749', emoji: '💕' },
  { label: 'Sci-Fi', genre: '878', emoji: '🚀' },
  { label: 'Mystery', genre: '9648', emoji: '🔍' },
  { label: 'Fantasy', genre: '14', emoji: '🔮' },
  { label: 'Animation', genre: '16', emoji: '🎨' },
]

const Surprise = () => {
  const [spinning, setSpinning] = useState(false)
  const [movie, setMovie] = useState(null)
  const [spinDeg, setSpinDeg] = useState(0)
  const [picked, setPicked] = useState(null)
  const [added, setAdded] = useState(false)
  const navigate = useNavigate()

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDhjNTM5Yzg5ODU2MDU2OGNjYjBiM2RkODQ0OGIzYyIsIm5iZiI6MTc3MDg4MzQzMi41ODgsInN1YiI6IjY5OGQ4OTY4Y2UxZWVhZjBmYzc4ZDllNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zg0jlmJAeNhmJPEAzVYNWF9f34zLhtFpJQKIKFBynNQ`
    }
  }

  const handleSpin = async () => {
    if (spinning) return
    setSpinning(true)
    setMovie(null)
    setAdded(false)

    // Random spin degrees 1440-2880 (4-8 full rotations)
    const randomIdx = Math.floor(Math.random() * categories.length)
    const segmentDeg = 360 / categories.length
    const targetDeg = spinDeg + 1440 + (360 - randomIdx * segmentDeg)
    setSpinDeg(targetDeg)

    // Wait for spin animation to finish
    setTimeout(async () => {
      const category = categories[randomIdx]
      setPicked(category)

      // Random page 1-5
      const page = Math.floor(Math.random() * 5) + 1
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${category.genre}&sort_by=popularity.desc&page=${page}`,
        options
      )
      const data = await res.json()
      const results = data.results?.filter(m => m.poster_path) || []
      const randomMovie = results[Math.floor(Math.random() * results.length)]
      setMovie(randomMovie)
      setSpinning(false)
    }, 4000)
  }

  const handleAddToList = async () => {
    const user = auth.currentUser
    if (user && movie) {
      await addToMyList(user.uid, {...movie, type: 'movie'})
      setAdded(true)
    }
  }

  // Build wheel segments
  const segmentAngle = 360 / categories.length

  return (
    <div className="surprise-container">
      <Navbar/>
      <div className="surprise-content">

        <div className="surprise-hero">
          <h1>🎲 Surprise Me!</h1>
          <p>Can't decide what to watch? Let the wheel decide for you!</p>
        </div>

        <div className="surprise-main">
          {/* Wheel */}
          <div className="wheel-wrapper">
            <div className="wheel-pointer">▼</div>
            <div
              className="wheel"
              style={{ transform: `rotate(${spinDeg}deg)` }}
            >
              {categories.map((cat, i) => (
                <div
                  key={cat.label}
                  className="wheel-segment"
                  style={{
                    transform: `rotate(${i * segmentAngle}deg)`,
                    background: `hsl(${i * (360 / categories.length)}, 70%, 35%)`
                  }}
                >
                  <span className="wheel-segment-label">
                    {cat.emoji} {cat.label}
                  </span>
                </div>
              ))}
              <div className="wheel-center">🎬</div>
            </div>

            <button
              className={`spin-btn ${spinning ? 'spinning' : ''}`}
              onClick={handleSpin}
              disabled={spinning}
            >
              {spinning ? '🌀 Spinning...' : '🎲 SPIN!'}
            </button>
          </div>

          {/* Result */}
          <div className="surprise-result">
            {!movie && !spinning && (
              <div className="surprise-placeholder">
                <p>🎯 Spin the wheel to get a random movie!</p>
                <p className="surprise-hint">We'll pick a random movie from the selected genre</p>
              </div>
            )}

            {spinning && (
              <div className="surprise-loading">
                <div className="surprise-spinner"></div>
                <p>Finding your perfect movie...</p>
              </div>
            )}

            {movie && !spinning && (
              <div className="surprise-movie" key={movie.id}>
                <div className="surprise-picked-badge">
                  {picked?.emoji} {picked?.label} Movie
                </div>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="surprise-poster"
                />
                <h2 className="surprise-movie-title">{movie.title}</h2>
                <div className="surprise-movie-meta">
                  <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                  <span>📅 {movie.release_date?.split('-')[0]}</span>
                </div>
                <p className="surprise-overview">
                  {movie.overview?.slice(0, 150)}...
                </p>
                <div className="surprise-btns">
                  <button
                    className="surprise-play-btn"
                    onClick={() => navigate(`/player/movie/${movie.id}`)}
                  >
                    ▶ Watch Now
                  </button>
                  <button
                    className={`surprise-add-btn ${added ? 'added' : ''}`}
                    onClick={handleAddToList}
                  >
                    {added ? '✅ Added!' : '➕ My List'}
                  </button>
                  <button
                    className="surprise-again-btn"
                    onClick={handleSpin}
                  >
                    🎲 Spin Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Surprise