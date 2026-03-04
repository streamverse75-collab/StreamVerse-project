import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Kids.css'
import { auth, addToMyList } from '../../firebase'
import Skeleton from '../../components/Skeleton/Skeleton'
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop'

const Kids = () => {

  const [animated, setAnimated] = useState([])
  const [family, setFamily] = useState([])
  const [kidsTV, setKidsTV] = useState([])
  const [adventure, setAdventure] = useState([])
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
      const animatedRes = await fetch('https://api.themoviedb.org/3/discover/movie?with_genres=16&language=en-US&page=1', options);
      const animatedData = await animatedRes.json();
      setAnimated(animatedData.results);

      const familyRes = await fetch('https://api.themoviedb.org/3/discover/movie?with_genres=10751&language=en-US&page=1', options);
      const familyData = await familyRes.json();
      const usedIds = new Set(animatedData.results.map(m => m.id));
      setFamily(familyData.results.filter(m => !usedIds.has(m.id)));
      familyData.results.forEach(m => usedIds.add(m.id));

      const kidsTVRes = await fetch('https://api.themoviedb.org/3/discover/tv?with_genres=10762&language=en-US&page=1', options);
      const kidsTVData = await kidsTVRes.json();
      setKidsTV(kidsTVData.results);

      const adventureRes = await fetch('https://api.themoviedb.org/3/discover/movie?with_genres=12&language=en-US&page=2', options);
      const adventureData = await adventureRes.json();
      setAdventure(adventureData.results.filter(m => !usedIds.has(m.id)));

      setPageLoading(false);
    };
    fetchData();
  }, []);

  const renderRow = (data, type = 'movie') => (
    <div className="kids-row">
      {data.map(item => (
        <div key={item.id} className="kids-card-wrapper">
          <img
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={item.title || item.name}
            onClick={() => navigate(`/player/${type}/${item.id}`)}
          />
          <button className="kids-add-btn" onClick={async () => {
            const user = auth.currentUser;
            if(user) await addToMyList(user.uid, {...item, type});
          }}>➕</button>
        </div>
      ))}
    </div>
  )

  return (
    <div className='kids-container'>

      {/* Kids Custom Header instead of Navbar */}
      <div className="kids-header">
        <h1 className="kids-header-logo">🧒 Kids Zone</h1>
        <button className="kids-exit-btn" onClick={() => navigate('/')}>
          ✕ Exit Kids
        </button>
      </div>

      <div className="kids-content">

        <h2>🎬 Animated Movies</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(animated, 'movie')}

        <h2>👨‍👩‍👧 Family Movies</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(family, 'movie')}

        <h2>📺 Kids TV Shows</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(kidsTV, 'tv')}

        <h2>🌍 Adventure Movies</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(adventure, 'movie')}

      </div>
      <ScrollToTop/>
    </div>
  )
}

export default Kids