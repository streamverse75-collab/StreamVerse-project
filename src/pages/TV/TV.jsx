import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './TV.css'
import { auth, addToMyList } from '../../firebase'
import Navbar from '../../components/Navbar/Navbar'
import Skeleton from '../../components/Skeleton/Skeleton'
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop'

const TV = () => {

  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [onAir, setOnAir] = useState([])
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
      const popularRes = await fetch('https://api.themoviedb.org/3/tv/popular?language=en-US&page=1', options);
      const popularData = await popularRes.json();
      setPopular(popularData.results);

      const topRatedRes = await fetch('https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1', options);
      const topRatedData = await topRatedRes.json();
      setTopRated(topRatedData.results);

      const onAirRes = await fetch('https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1', options);
      const onAirData = await onAirRes.json();
      setOnAir(onAirData.results);

      setPageLoading(false);
    };
    fetchData();
  }, []);

  const renderRow = (data) => (
    <div className="row">
      {data.map(show => (
        <div key={show.id} className="tv-card-wrapper">
          <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name}
            onClick={() => navigate(`/player/tv/${show.id}`)} />
          <button className="tv-add-btn" onClick={async () => {
            const user = auth.currentUser;
            if(user) await addToMyList(user.uid, {...show, type:'tv'});
          }}>➕</button>
        </div>
      ))}
    </div>
  )

  return (
    <div className='tv-container'>
      <Navbar/>
      <div className="tv-content">
        <h1 className='tv-title'>TV Shows</h1>

        <h2>Popular TV Shows</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(popular)}

        <h2>Top Rated TV Shows</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(topRated)}

        <h2>Currently Airing</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(onAir)}
      </div>
      <ScrollToTop/>background: linear-gradient(135deg, #00d4ff, #0099cc);
    </div>
  )
}

export default TV 