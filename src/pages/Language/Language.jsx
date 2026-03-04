import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Language.css'
import { auth, addToMyList } from '../../firebase'
import Navbar from '../../components/Navbar/Navbar'
import Skeleton from '../../components/Skeleton/Skeleton'
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop'


const languages = [
  { name: 'English', code: 'en', flag: '🇺🇸' },
  { name: 'Hindi', code: 'hi', flag: '🇮🇳' },
  { name: 'Marathi', code: 'mr', flag: '🇮🇳' },
  { name: 'Tamil', code: 'ta', flag: '🇮🇳' },
  { name: 'Telugu', code: 'te', flag: '🇮🇳' },
  { name: 'Korean', code: 'ko', flag: '🇰🇷' },
  { name: 'Japanese', code: 'ja', flag: '🇯🇵' },
  { name: 'Spanish', code: 'es', flag: '🇪🇸' },
  { name: 'French', code: 'fr', flag: '🇫🇷' },
  { name: 'Arabic', code: 'ar', flag: '🇸🇦' },
]

const Language = () => {

  const [selectedLang, setSelectedLang] = useState(null)
  const [movies, setMovies] = useState([])
  const [tvShows, setTvShows] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDhjNTM5Yzg5ODU2MDU2OGNjYjBiM2RkODQ0OGIzYyIsIm5iZiI6MTc3MDg4MzQzMi41ODgsInN1YiI6IjY5OGQ4OTY4Y2UxZWVhZjBmYzc4ZDllNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zg0jlmJAeNhmJPEAzVYNWF9f34zLhtFpJQKIKFBynNQ`
    }
  };

  const fetchByLanguage = async (langCode) => {
    setLoading(true);
    setMovies([]);
    setTvShows([]);

    const moviesRes = await fetch(
      `https://api.themoviedb.org/3/discover/movie?with_original_language=${langCode}&sort_by=popularity.desc&page=1`,
      options
    );
    const moviesData = await moviesRes.json();
    setMovies(moviesData.results || []);

    const tvRes = await fetch(
      `https://api.themoviedb.org/3/discover/tv?with_original_language=${langCode}&sort_by=popularity.desc&page=1`,
      options
    );
    const tvData = await tvRes.json();
    setTvShows(tvData.results || []);
    setLoading(false);
  }

  const handleLanguageClick = (lang) => {
    setSelectedLang(lang);
    fetchByLanguage(lang.code);
  }

  const renderRow = (data, type) => (
    <div className="lang-row">
      {data.map(item => (
        <div key={item.id} className="lang-card-wrapper">
          <img
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={item.title || item.name}
            onClick={() => navigate(`/player/${type}/${item.id}`)}
          />
          <button className="lang-add-btn" onClick={async () => {
            const user = auth.currentUser;
            if(user) await addToMyList(user.uid, {...item, type});
          }}>➕</button>
        </div>
      ))}
    </div>
  )

  return (
    <div className='language-container'>
      <Navbar/>

      <div className="language-content">
        <h1>🌍 Browse by Language</h1>

        <div className="language-buttons">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`lang-btn ${selectedLang?.code === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageClick(lang)}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>

        {!selectedLang && (
          <div className="lang-placeholder">
            <p>👆 Select a language to browse content</p>
          </div>
        )}

        {loading && (
          <>
            <Skeleton count={8}/>
            <Skeleton count={8}/>
          </>
        )}

        {selectedLang && !loading && (
          <>
            <h2>🎬 {selectedLang.flag} {selectedLang.name} Movies</h2>
            {movies.length > 0 ? renderRow(movies, 'movie') : <p className="lang-empty">No movies found</p>}

            <h2>📺 {selectedLang.flag} {selectedLang.name} TV Shows</h2>
            {tvShows.length > 0 ? renderRow(tvShows, 'tv') : <p className="lang-empty">No TV shows found</p>}
          </>
        )}
      </div>
      <ScrollToTop/>
    </div>
  )
}

export default Language