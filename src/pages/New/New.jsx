import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './New.css'
import { auth, addToMyList } from '../../firebase'
import Navbar from '../../components/Navbar/Navbar'
import Skeleton from '../../components/Skeleton/Skeleton'
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop'
const New = () => {

  const [trendingMovies, setTrendingMovies] = useState([])
  const [trendingTV, setTrendingTV] = useState([])
  const [newReleases, setNewReleases] = useState([])
  const [comingSoon, setComingSoon] = useState([])
  const [pageLoading, setPageLoading] = useState(true)

  const navigate = useNavigate();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDhjNTM5Yzg5ODU2MDU2OGNjYjBiM2RkODQ0OGIzYyIsIm5iZiI6MTc3MDg4MzQzMi41ODgsInN1YiI6IjY5OGQ4OTY4Y2UxZWVhZjBmYzc4ZDllNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zg0jlmJAeNhmJPEAzVYNWF9f34zLhtFpJQKIKFBynNQ`
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const trendMovRes = await fetch('https://api.themoviedb.org/3/trending/movie/week?language=en-US', options);
      const trendMovData = await trendMovRes.json();
      setTrendingMovies(trendMovData.results);

      const trendTVRes = await fetch('https://api.themoviedb.org/3/trending/tv/week?language=en-US', options);
      const trendTVData = await trendTVRes.json();
      setTrendingTV(trendTVData.results);

      const newRelRes = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options);
      const newRelData = await newRelRes.json();
      setNewReleases(newRelData.results);

      const usedIds = new Set([
        ...trendMovData.results.map(m => m.id),
        ...newRelData.results.map(m => m.id),
      ]);

      const comingSoonRes = await fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=2', options);
      const comingSoonData = await comingSoonRes.json();
      setComingSoon(comingSoonData.results.filter(m => !usedIds.has(m.id)));

      setPageLoading(false);
    };
    fetchData();
  }, []);

  const renderRow = (data, type = 'movie') => (
    <div className="new-row">
      {data.map(item => (
        <div key={item.id} className="new-card-wrapper">
          <div className="new-card" onClick={() => navigate(`/player/${type}/${item.id}`)}>
            <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} />
            <div className="new-card-info">
              <p className="new-card-title">{item.title || item.name}</p>
              <p className="new-card-rating">⭐ {item.vote_average?.toFixed(1)}</p>
            </div>
          </div>
          <button className="new-add-btn" onClick={async () => {
            const user = auth.currentUser;
            if(user) await addToMyList(user.uid, {...item, type});
          }}>➕</button>
        </div>
      ))}
    </div>
  )

  return (
    <div className='new-container'>
      <Navbar/>
      <div className="new-content">
        <h1>🔥 New & Popular</h1>

        <h2>📈 Trending Movies This Week</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(trendingMovies, 'movie')}

        <h2>📺 Trending TV Shows This Week</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(trendingTV, 'tv')}

        <h2>🎬 New Releases</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(newReleases, 'movie')}

        <h2>🍿 Coming Soon</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(comingSoon, 'movie')}
      </div>
      <ScrollToTop/>background: linear-gradient(135deg, #00d4ff, #0099cc);
    </div>
  )
}

export default New