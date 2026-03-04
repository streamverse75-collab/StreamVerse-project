import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Anime.css'
import { auth, addToMyList } from '../../firebase'
import Navbar from '../../components/Navbar/Navbar'
import Skeleton from '../../components/Skeleton/Skeleton'
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop'

const Anime = () => {

  const [trending, setTrending] = useState([])
  const [topRated, setTopRated] = useState([])
  const [action, setAction] = useState([])
  const [romance, setRomance] = useState([])
  const [fantasy, setFantasy] = useState([])
  const [movies, setMovies] = useState([])
  const [newSeason, setNewSeason] = useState([])
  const [dubbed, setDubbed] = useState([])
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

      const trendingRes = await fetch(
        'https://api.themoviedb.org/3/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=1',
        options
      );
      const trendingData = await trendingRes.json();
      setTrending(trendingData.results);

      const topRatedRes = await fetch(
        'https://api.themoviedb.org/3/discover/tv?with_genres=16&with_original_language=ja&sort_by=vote_average.desc&vote_count.gte=500&page=1',
        options
      );
      const topRatedData = await topRatedRes.json();
      setTopRated(topRatedData.results);

      const actionRes = await fetch(
        'https://api.themoviedb.org/3/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=2',
        options
      );
      const actionData = await actionRes.json();
      setAction(actionData.results);

      const romanceRes = await fetch(
        'https://api.themoviedb.org/3/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=3',
        options
      );
      const romanceData = await romanceRes.json();
      setRomance(romanceData.results);

      const fantasyRes = await fetch(
        'https://api.themoviedb.org/3/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=4',
        options
      );
      const fantasyData = await fantasyRes.json();
      setFantasy(fantasyData.results);

      const moviesRes = await fetch(
        'https://api.themoviedb.org/3/discover/movie?with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=1',
        options
      );
      const moviesData = await moviesRes.json();
      setMovies(moviesData.results);

      const newSeasonRes = await fetch(
        'https://api.themoviedb.org/3/discover/tv?with_genres=16&with_original_language=ja&sort_by=first_air_date.desc&page=1',
        options
      );
      const newSeasonData = await newSeasonRes.json();
      setNewSeason(newSeasonData.results);

      const dubbedRes = await fetch(
        'https://api.themoviedb.org/3/discover/tv?with_genres=16&with_original_language=ja&sort_by=vote_count.desc&page=1',
        options
      );
      const dubbedData = await dubbedRes.json();
      setDubbed(dubbedData.results);

      setPageLoading(false);
    };
    fetchData();
  }, []);

  const renderRow = (data, type = 'tv') => (
    <div className="anime-row">
      {data.filter(item => item.poster_path).map(item => (
        <div key={item.id} className="anime-card-wrapper">
          <img
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={item.title || item.name}
            onClick={() => navigate(`/player/${type}/${item.id}`)}
          />
          <button className="anime-add-btn" onClick={async () => {
            const user = auth.currentUser;
            if(user) await addToMyList(user.uid, {...item, type});
          }}>➕</button>
        </div>
      ))}
    </div>
  )

  return (
    <div className='anime-container'>
      <Navbar/>
      <div className="anime-content">

        <div className="anime-hero">
          <h1 className="anime-title">⛩️ Anime</h1>
          <p className="anime-subtitle">Explore the world of Japanese animation</p>
        </div>

        <h2>🔥 Trending Anime</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(trending, 'tv')}

        <h2>🏆 Top Rated Anime</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(topRated, 'tv')}

        <h2>💥 Action Anime</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(action, 'tv')}

        <h2>💕 Romance Anime</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(romance, 'tv')}

        <h2>🔮 Fantasy Anime</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(fantasy, 'tv')}

        <h2>🎬 Anime Movies</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(movies, 'movie')}

        <h2>🆕 New Season Anime</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(newSeason, 'tv')}

        <h2>🎌 Most Watched Anime</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(dubbed, 'tv')}

      </div>
      <ScrollToTop/>
    </div>
  )
}

export default Anime