import React, { useEffect, useState } from 'react'
import './Player.css'
import { useParams, useNavigate } from 'react-router-dom';
import { auth, addToContinueWatching } from '../../firebase'

const Player = () => {

  const {type, id} = useParams();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState(null);
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDhjNTM5Yzg5ODU2MDU2OGNjYjBiM2RkODQ0OGIzYyIsIm5iZiI6MTc3MDg4MzQzMi41ODgsInN1YiI6IjY5OGQ4OTY4Y2UxZWVhZjBmYzc4ZDllNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zg0jlmJAeNhmJPEAzVYNWF9f34zLhtFpJQKIKFBynNQ'
    }
  };

  useEffect(() => {
    if(!id) return;
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`, options).then(r => r.json()),
      fetch(`https://api.themoviedb.org/3/${type}/${id}?language=en-US`, options).then(r => r.json())
    ])
    .then(([videoRes, movieRes]) => {
      if(!videoRes.results || videoRes.results.length === 0) {
        throw new Error('No videos found');
      }
      const trailer = videoRes.results.find(v => v.type === "Trailer" && v.site === "YouTube");
      const videoData = trailer || videoRes.results[0];
      setApiData(videoData);
      setMovieData(movieRes);

      // Save to Continue Watching
      if(auth.currentUser) {
        addToContinueWatching(auth.currentUser.uid, {
          id: id,
          title: movieRes.title || movieRes.name,
          poster_path: movieRes.poster_path,
          type: type
        });
      }

      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [id]);

  return (
    <div className='player'>

      {/* Background blur poster */}
      {movieData?.backdrop_path && (
        <div className="player-bg" style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movieData.backdrop_path})`
        }}></div>
      )}

      {/* Top Bar */}
      <div className="player-topbar">
        <button className="player-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="player-topbar-info">
          <span className="player-topbar-title">
            {movieData?.title || movieData?.name || 'StreamVerse Player'}
          </span>
          <span className="player-topbar-type">
            {type === 'tv' ? '📺 TV Show' : '🎬 Movie'}
          </span>
        </div>
        <div className="player-topbar-logo">⚡ StreamVerse</div>
      </div>

      {/* Main Content */}
      <div className="player-main">
        {loading ? (
          <div className='player-loading'>
            <div className="player-spinner"></div>
            <p>Loading video...</p>
          </div>
        ) : error ? (
          <div className='player-error'>
            <p>😔 {error}</p>
            <button onClick={() => navigate(-1)}>← Go Back</button>
          </div>
        ) : apiData?.key ? (
          <div className="player-content">
            {/* Video */}
            <div className="player-video-wrapper">
              <iframe
                width='100%'
                height='100%'
                src={`https://www.youtube.com/embed/${apiData.key}?autoplay=1&rel=0`}
                title='trailer'
                frameBorder='0'
                allowFullScreen
                allow="autoplay; encrypted-media"
              ></iframe>
            </div>

            {/* Movie Info Below Video */}
            <div className="player-info-bar">
              <div className="player-info-left">
                <h2 className="player-movie-title">
                  {movieData?.title || movieData?.name}
                </h2>
                <div className="player-meta">
                  {movieData?.vote_average && (
                    <span className="player-rating">⭐ {movieData.vote_average.toFixed(1)}</span>
                  )}
                  {(movieData?.release_date || movieData?.first_air_date) && (
                    <span className="player-year">
                      📅 {(movieData.release_date || movieData.first_air_date).split('-')[0]}
                    </span>
                  )}
                  {movieData?.runtime && (
                    <span className="player-runtime">🕐 {movieData.runtime} min</span>
                  )}
                  {movieData?.number_of_seasons && (
                    <span className="player-seasons">
                      📺 {movieData.number_of_seasons} Season{movieData.number_of_seasons > 1 ? 's' : ''}
                    </span>
                  )}
                  <span className="player-video-type">🎞️ {apiData.type}</span>
                </div>
                {movieData?.genres && (
                  <div className="player-genres">
                    {movieData.genres.map(g => (
                      <span key={g.id} className="player-genre-tag">{g.name}</span>
                    ))}
                  </div>
                )}
                {movieData?.overview && (
                  <p className="player-overview">{movieData.overview}</p>
                )}
              </div>

              {movieData?.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movieData.poster_path}`}
                  alt={movieData.title || movieData.name}
                  className="player-poster"
                />
              )}
            </div>
          </div>
        ) : (
          <div className='player-error'>
            <p>😔 No video available</p>
            <button onClick={() => navigate(-1)}>← Go Back</button>
          </div>
        )}
      </div>

    </div>
  )
}

export default Player 