import React, { useEffect, useRef, useState } from 'react'
import './TitleCards.css'
import cards_data from '../../assets/cards/Cards_data'
import { Link } from 'react-router-dom'
import { auth, addToMyList } from '../../firebase'

const TitleCards = ({title, category}) => {

  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDhjNTM5Yzg5ODU2MDU2OGNjYjBiM2RkODQ0OGIzYyIsIm5iZiI6MTc3MDg4MzQzMi41ODgsInN1YiI6IjY5OGQ4OTY4Y2UxZWVhZjBmYzc4ZDllNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zg0jlmJAeNhmJPEAzVYNWF9f34zLhtFpJQKIKFBynNQ'
    }
  };

  const getPage = () => {
    switch(category) {
      case 'top_rated':    return 1;
      case 'popular':      return 2;
      case 'upcoming':     return 3;
      case 'now_playing':  return 4;
      default:             return 1;
    }
  }

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  }

  useEffect(() => {
    const page = getPage();
    fetch(`https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=en-US&page=${page}`, options)
      .then(res => res.json())
      .then(res => setApiData(res.results || cards_data))
      .catch(err => {
        console.error(err);
        setApiData(cards_data);
      });

    const cr = cardsRef.current;
    if(cr) cr.addEventListener('wheel', handleWheel);
    return () => { if(cr) cr.removeEventListener('wheel', handleWheel); }
  }, [category])

  return (
    <div className='title-cards'>
      <h2>{title ? title : "Popular on StreamVearse"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => {
          const titleText = card?.title || card?.original_title || card?.name;
          const imgSrc = card?.backdrop_path
            ? `https://image.tmdb.org/t/p/w500${card.backdrop_path}`
            : card?.image;
          return (
            <div className="card" key={index}>
              <Link to={`/player/movie/${card.id || ''}`}>
                <img src={imgSrc} alt={titleText || ''} />
                <p>{titleText}</p>
              </Link>
              <button
                className="add-to-list-btn"
                onClick={async (e) => {
                  e.preventDefault();
                  const user = auth.currentUser;
                  if (user) {
                    await addToMyList(user.uid, {...card, type: 'movie'});
                  }
                }}
              >➕</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TitleCards