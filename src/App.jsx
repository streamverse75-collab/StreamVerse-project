import React, { useEffect, useState } from 'react'
import Home from './pages/Home/Home'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Player from './pages/Player/Player'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { ToastContainer } from 'react-toastify'
import TV from './pages/TV/TV'
import Movies from './pages/Movies/Movies'
import Kids from './pages/Kids/Kids'
import New from './pages/New/New'
import MyList from './pages/MyList/MyList'
import Language from './pages/Language/Language'
import Account from './pages/Account/Account'
import Anime from './pages/Anime/Anime'
import NotFound from './pages/NotFound/NotFound'
import Help from './pages/Help/Help'
import Mood from './pages/Mood/Mood'
import Surprise from './pages/Surprise/Surprise'

const App = () => {

  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (window.location.pathname === '/login') {
          navigate('/');
        }
      } else {
        navigate('/login');
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0015, #0d0030, #0a001a)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.5rem',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTop: '3px solid #00d4ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}/>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        ✨ Loading StreamVerse...
      </div>
    );
  }

  return (
    <div>
      <ToastContainer theme="dark"/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/player/:type/:id' element={<Player/>}/>
        <Route path='/kids' element={<Kids/>}/>
        <Route path='/tv' element={<TV/>}/>
        <Route path='/movies' element={<Movies/>}/>
        <Route path='/new' element={<New/>}/>
        <Route path='/mylist' element={<MyList/>}/>
        <Route path='/anime' element={<Anime/>}/>
        <Route path='/language' element={<Language/>}/>
        <Route path='/account' element={<Account/>}/>
        <Route path='/help' element={<Help/>}/>
        <Route path='/mood' element={<Mood/>}/>
        <Route path='/surprise' element={<Surprise/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </div>
  )
}

export default App