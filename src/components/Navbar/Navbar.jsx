import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import profile_img from '../../assets/profile_img.png'
import caret_icon from '../../assets/caret_icon.svg'
import { logout, auth, addToMyList } from '../../firebase'

const Navbar = () => {
  
  const navRef = useRef();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [comingSoon, setComingSoon] = useState([]);
  const navigate = useNavigate();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDhjNTM5Yzg5ODU2MDU2OGNjYjBiM2RkODQ0OGIzYyIsIm5iZiI6MTc3MDg4MzQzMi41ODgsInN1YiI6IjY5OGQ4OTY4Y2UxZWVhZjBmYzc4ZDllNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zg0jlmJAeNhmJPEAzVYNWF9f34zLhtFpJQKIKFBynNQ'
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;
      if (window.scrollY >= 80) {
        navRef.current.classList.add('nav-dark');
      } else {
        navRef.current.classList.remove('nav-dark');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=3', options)
      .then(res => res.json())
      .then(res => setComingSoon(res.results?.slice(0, 5) || []))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`https://api.themoviedb.org/3/search/multi?query=${searchQuery}&language=en-US&page=1`, options)
        .then(res => res.json())
        .then(res => setSearchResults(res.results?.slice(0, 6) || []))
        .catch(err => console.error(err));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (result) => {
    const type = result.media_type === 'tv' ? 'tv' : 'movie';
    navigate(`/player/${type}/${result.id}`);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  }

  const handleLogoClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div ref={navRef} className='navbar'>
      <div className="navbar-left">

        <img 
          src={logo} 
          alt="StreamVerse" 
          className='navbar-logo'
          onClick={handleLogoClick}
        />

        <ul>
          <li><NavLink to="/" className={({isActive}) => isActive ? 'active-link' : ''}>Home</NavLink></li>
          <li><NavLink to="/tv" className={({isActive}) => isActive ? 'active-link' : ''}>TV Shows</NavLink></li>
          <li><NavLink to="/movies" className={({isActive}) => isActive ? 'active-link' : ''}>Movies</NavLink></li>
          <li><NavLink to="/new" className={({isActive}) => isActive ? 'active-link' : ''}>New & Popular</NavLink></li>
          <li><NavLink to="/mylist" className={({isActive}) => isActive ? 'active-link' : ''}>My List</NavLink></li>
          <li><NavLink to="/anime" className={({isActive}) => isActive ? 'active-link' : ''}>Anime</NavLink></li> 
          <li><NavLink to="/language" className={({isActive}) => isActive ? 'active-link' : ''}>Browse by Language</NavLink></li>
          <li><NavLink to="/mood" className={({isActive}) => isActive ? 'active-link' : ''}> Mood</NavLink></li>
          <li><NavLink to="/surprise" className={({isActive}) => isActive ? 'active-link' : ''}> Surprise</NavLink></li>

        </ul>
      </div>
      <div className="navbar-right">

        {/* Search */}
        <div className="search-container">
          {!showSearch && (
            <img 
              src={search_icon} 
              alt="" 
              className='icons' 
              onClick={() => setShowSearch(true)} 
            />
          )}
          {showSearch && (
            <div className="search-box">
              <input
                type="text"
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                onBlur={() => {
                  setTimeout(() => {
                    setShowSearch(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }, 200);
                }}
              />
              {searchQuery.length >= 2 && (
                <div className="search-results">
                  {searchResults.filter(r => r.poster_path).length > 0 ? (
                    searchResults.map(result => (
                      result.poster_path && (
                        <div key={result.id} className="search-result-item">
                          <img
                            src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                            alt={result.title || result.name}
                            onClick={() => handleResultClick(result)}
                          />
                          <div className="search-result-info" onClick={() => handleResultClick(result)}>
                            <p className="search-result-title">{result.title || result.name}</p>
                            <p className="search-result-type">{result.media_type === 'tv' ? '📺 TV Show' : '🎬 Movie'}</p>
                          </div>
                          <button
                            className="search-add-btn"
                            onClick={async (e) => {
                              e.stopPropagation();
                              const user = auth.currentUser;
                              if(user) await addToMyList(user.uid, {
                                ...result,
                                type: result.media_type || 'movie'
                              });
                            }}
                          >➕</button>
                        </div>
                      )
                    ))
                  ) : (
                    <div className="search-no-results">
                      <p>😔 Sorry, no results found for "<strong>{searchQuery}</strong>"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <p className='children-btn' onClick={() => navigate('/kids')}>For Children</p>

        {/* Bell Notification */}
        <div className="bell-container">
          <img
            src={bell_icon}
            alt=""
            className='icons'
            onClick={() => setShowNotifications(!showNotifications)}
          />
          <span className="bell-badge">{comingSoon.length}</span>
          {showNotifications && (
            <div className="notification-dropdown">
              <h3>🍿 Coming Soon</h3>
              {comingSoon.map(movie => (
                <div key={movie.id} className="notification-item">
                  <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} />
                  <div className="notification-info">
                    <p className="notification-title">{movie.title}</p>
                    <p className="notification-date">📅 {movie.release_date}</p>
                    <p className="notification-rating">⭐ {movie.vote_average?.toFixed(1)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="navbar-profile">
          <img src={profile_img} alt="" className='profile' />
          <img src={caret_icon} alt="" />
          <div className="dropdown">
            <div className="dropdown-header">
              <img src={profile_img} alt="" className='dropdown-profile-img' />
              <div>
                <p className="dropdown-username">My Account</p>
                <p className="dropdown-email">{auth.currentUser?.email}</p>
              </div>
            </div>
            <div className="dropdown-divider"></div>
            <p className="dropdown-item" onClick={() => navigate('/mylist')}>❤️ My List</p>
            <p className="dropdown-item" onClick={() => navigate('/kids')}>👤 Switch Profile</p>
            <p className="dropdown-item" onClick={() => navigate('/account')}>⚙️ Account Settings</p>
            <p className="dropdown-item" onClick={() => navigate('/help')}>❓ Help & Support</p>
            <div className="dropdown-divider"></div>
            <p className="dropdown-item signout" onClick={() => logout()}>🚪 Sign Out</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Navbar