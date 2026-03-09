import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Movies.css'
import { auth, addToMyList } from '../../firebase'
import Navbar from '../../components/Navbar/Navbar'
import Skeleton from '../../components/Skeleton/Skeleton'
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop'

const Movies = () => {

  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [trending, setTrending] = useState([])
  const [action, setAction] = useState([])
  const [comedy, setComedy] = useState([])
  const [horror, setHorror] = useState([])
  const [scifi, setScifi] = useState([])
  const [romance, setRomance] = useState([])
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
      const [
        popularData, topRatedData, trendingData, upcomingData,
        nowPlayingData, actionData, comedyData, horrorData, scifiData, romanceData
      ] = await Promise.all([
        fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options).then(r => r.json()),
        fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options).then(r => r.json()),
        fetch('https://api.themoviedb.org/3/trending/movie/week?language=en-US', options).then(r => r.json()),
        fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=2', options).then(r => r.json()),
        fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=2', options).then(r => r.json()),
        fetch('https://api.themoviedb.org/3/discover/movie?with_genres=28&language=en-US&page=1', options).then(r => r.json()),
        fetch('https://api.themoviedb.org/3/discover/movie?with_genres=35&language=en-US&page=1', options).then(r => r.json()),
        fetch('https://api.themoviedb.org/3/discover/movie?with_genres=27&language=en-US&page=1', options).then(r => r.json()),
        fetch('https://api.themoviedb.org/3/discover/movie?with_genres=878&language=en-US&page=1', options).then(r => r.json()),
        fetch('https://api.themoviedb.org/3/discover/movie?with_genres=10749&language=en-US&page=1', options).then(r => r.json()),
      ]);

      setPopular(popularData.results);
      setTopRated(topRatedData.results);
      setTrending(trendingData.results);
      setUpcoming(upcomingData.results);
      setNowPlaying(nowPlayingData.results);
      setAction(actionData.results);
      setComedy(comedyData.results);
      setHorror(horrorData.results);
      setScifi(scifiData.results);
      setRomance(romanceData.results);
      setPageLoading(false);
    };
    fetchData();
  }, []);

  const renderRow = (data, type = 'movie') => (
  <div className="row">
    {data.slice(0, 15).map(movie => (
      movie.poster_path && (
        <div key={movie.id} className="movie-card-wrapper">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            onClick={() => navigate(`/player/${type}/${movie.id}`)}
          />
          <button className="movie-add-btn" onClick={async () => {
            const user = auth.currentUser;
            if(user) await addToMyList(user.uid, {...movie, type});
          }}>➕</button>
        </div>
      )
    ))}
  </div>
)

  return (
    <div className='movies-container'>
      <Navbar/>
      <div className="movies-content">
        <h1 className='movies-title'>Movies</h1>

        <h2>Trending This Week</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(trending)}

        <h2>Popular Movies</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(popular)}

        <h2>Top Rated</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(topRated)}

        <h2>Now Playing</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(nowPlaying)}

        <h2>Upcoming</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(upcoming)}

        <h2>Action</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(action)}

        <h2>Comedy</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(comedy)}

        <h2>Horror</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(horror)}

        <h2>Sci-Fi</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(scifi)}

        <h2>Romance</h2>
        {pageLoading ? <Skeleton count={8}/> : renderRow(romance)}

      </div>
      <ScrollToTop/>
    </div>
  )
}

export default Movies