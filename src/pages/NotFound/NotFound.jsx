import React from 'react'
import { useNavigate } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-code">404</div>
        <div className="notfound-glow"></div>
        <h2 className="notfound-title">Lost in the Universe</h2>
        <p className="notfound-desc">
          The page you're looking for has drifted into another galaxy. 🌌
        </p>
        <div className="notfound-btns">
          <button className="notfound-btn" onClick={() => navigate('/')}>
            🏠 Go Home
          </button>
          <button className="notfound-btn-outline" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
        <div className="notfound-stars">
          {Array(20).fill(0).map((_, i) => (
            <div key={i} className="notfound-star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
            }}></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotFound