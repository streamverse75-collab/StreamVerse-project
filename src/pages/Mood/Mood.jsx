import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Skeleton from '../../components/Skeleton/Skeleton'
import { auth, addToMyList } from '../../firebase'
import './Mood.css'

const moods = [
  { emoji: '😂', label: 'Happy', genres: '35', color: '#ffdd57' },
  { emoji: '😢', label: 'Sad', genres: '18', color: '#74b9ff' },
  { emoji: '😱', label: 'Scared', genres: '27', color: '#fd79a8' },
  { emoji: '🤩', label: 'Excited', genres: '28', color: '#ff7675' },
  { emoji: '😍', label: 'Romantic', genres: '10749', color: '#e84393' },
  { emoji: '🤔', label: 'Curious', genres: '9648', color: '#a29bfe' },
  { emoji: '😎', label: 'Cool', genres: '878', color: '#00d4ff' },
  { emoji: '🧘', label: 'Relaxed', genres: '99', color: '#55efc4' },
]

const Mood = () => {
  const [selectedMood, setSelectedMood] = useState(null)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDhjNTM5Yzg5ODU2MDU2OGNjYjBiM2RkODQ0OGIzYyIsIm5iZiI6MTc3MDg4MzQzMi41ODgsInN1YiI6IjY5OGQ4OTY4Y2UxZWVhZjBmYzc4ZDllNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zg0jlmJAeNhmJPEAzVYNWF9f34zLhtFpJQKIKFBynNQ`
    }
  }

  const handleMoodClick = async (mood) => {
    setSelectedMood(mood)
    setLoading(true)
    setMovies([])
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${mood.genres}&sort_by=popularity.desc&page=1`,
      options
    )
    const data = await res.json()
    setMovies(data.results || [])
    setLoading(false)
  }

  return (
    <div className="mood-container">
      <Navbar/>
      <div className="mood-content">
        <div className="mood-hero">
          <h1>🎯 What's Your Mood?</h1>
          <p>Pick how you're feeling and we'll find the perfect movie for you!</p>
        </div>

        <div className="mood-grid">
          {moods.map(mood => (
            <div
              key={mood.label}
              className={`mood-card ${selectedMood?.label === mood.label ? 'selected' : ''}`}
              style={{ '--mood-color': mood.color }}
              onClick={() => handleMoodClick(mood)}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <p className="mood-label">{mood.label}</p>
            </div>
          ))}
        </div>

        {selectedMood && (
          <div className="mood-results">
            <h2>
              {selectedMood.emoji} Perfect movies for when you're feeling
              <span style={{ color: selectedMood.color }}> {selectedMood.label}</span>
            </h2>
            {loading ? <Skeleton count={8}/> : (
              <div className="mood-row">
                {movies.filter(m => m.poster_path).map(movie => (
                  <div key={movie.id} className="mood-movie-card">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      onClick={() => navigate(`/player/movie/${movie.id}`)}
                    />
                    <button className="mood-add-btn" onClick={async () => {
                      const user = auth.currentUser;
                      if(user) await addToMyList(user.uid, {...movie, type: 'movie'});
                    }}>➕</button>
                    <p className="mood-movie-title">{movie.title}</p>
                    <p className="mood-movie-rating">⭐ {movie.vote_average?.toFixed(1)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Mood