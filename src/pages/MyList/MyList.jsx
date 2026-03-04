import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, getMyList, removeFromMyList } from '../../firebase'
import './MyList.css'
import Navbar from '../../components/Navbar/Navbar'
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop'


const MyList = () => {

  const [myList, setMyList] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  const fetchList = async () => {
    const user = auth.currentUser;
    if (user) {
      const list = await getMyList(user.uid);
      setMyList(list);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchList();
  }, []);

  const handleRemove = async (itemId) => {
    const user = auth.currentUser;
    if (user) {
      await removeFromMyList(user.uid, itemId);
      setMyList(prev => prev.filter(item => item.itemId !== itemId));
    }
  }

  return (
    <div className='mylist-container'>
      <Navbar/>

      <div className="mylist-content">
        <h1>❤️ My List</h1>

        {loading ? (
          <div className="mylist-loading"><p>Loading...</p></div>
        ) : myList.length === 0 ? (
          <div className="mylist-empty">
            <p>😔 Your list is empty!</p>
            <p>Add movies and TV shows by clicking the ➕ button</p>
            <button onClick={() => navigate('/')}>Browse Content</button>
          </div>
        ) : (
          <div className="mylist-grid">
            {myList.map(item => (
              <div key={item.docId} className="mylist-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                  alt={item.title}
                  onClick={() => navigate(`/player/${item.type}/${item.itemId}`)}
                />
                <div className="mylist-card-info">
                  <p className="mylist-card-title">{item.title}</p>
                  <p className="mylist-card-type">{item.type === 'tv' ? '📺 TV Show' : '🎬 Movie'}</p>
                  <p className="mylist-card-rating">⭐ {item.rating?.toFixed(1)}</p>
                  <button className="mylist-remove-btn" onClick={() => handleRemove(item.itemId)}>
                    ✖ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ScrollToTop/>background: linear-gradient(135deg, #00d4ff, #0099cc);
    </div>
  )
}

export default MyList