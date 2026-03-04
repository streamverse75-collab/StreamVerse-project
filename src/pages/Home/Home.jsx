import React, { useState } from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import hero_banner from '../../assets/hero_banner.jpg'
import play_icon from '../../assets/play_icon.png'
import info_icon from '../../assets/info_icon.png'
import TitleCards from '../../components/TitileCards/TitleCards'
import Footer from '../../components/Footer/Footer'
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop'
import { useNavigate } from 'react-router-dom'
import ContinueWatching from "../../components/ContinueWatching/ContinueWatching";

const Home = () => {

  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className='home'>
      <Navbar/>
      <div className="hero">
        <img src={hero_banner} alt="" className='banner-img' />
        <div className="hero-caption">

          <div className="hero-badge">
            <span className="badge-icon">⚡</span>
            <span>STREAMVERSE ORIGINAL</span>
          </div>

          <h1 className="hero-title-text">REALM OF<br/>ETERNITY</h1>

          <p>In a world where magic and destiny collide, one soul must rise above darkness to reclaim what was lost — before the stars themselves go silent forever.</p>

          <div className="hero-btns">
            {/* Play - Indian National Anthem on YouTube */}
            <button className='btn' onClick={() => window.open('https://youtu.be/HtMF973tXIY?si=Dt3alpZEIssC4iSe', '_blank')}>
              <img src={play_icon} alt="" />Play
            </button>

            {/* More Info - Project Info Modal */}
            <button className='btn dark-btn' onClick={() => setShowInfo(true)}>
              <img src={info_icon} alt="" />More Info
            </button>
          </div>

        </div>
      </div>

      {/* Project Info Modal */}
      {showInfo && (
        <div className="info-overlay" onClick={() => setShowInfo(false)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <button className="info-close" onClick={() => setShowInfo(false)}>✕</button>

            <div className="info-header">
              <div className="info-badge">⚡ STREAMVERSE ORIGINAL</div>
              <h2 className="info-title">REALM OF ETERNITY</h2>
            </div>

            <div className="info-body">
              <div className="info-tags">
                <span>🎓 Final Year Project</span>
                <span>⚛️ React.js</span>
                <span>🔥 Firebase</span>
                <span>🎬 TMDB API</span>
              </div>

              <p className="info-desc">
                StreamVerse is a full-stack Netflix-inspired streaming platform built as a Final Year Project. It features real movie data, authentication, and a stunning cosmic UI.
              </p>

              <div className="info-features">
                <h4>✨ Features</h4>
                <div className="info-features-grid">
                  <div className="info-feature-item">🔐 Firebase Auth</div>
                  <div className="info-feature-item">🎬 TMDB API</div>
                  <div className="info-feature-item">❤️ My List</div>
                  <div className="info-feature-item">🔔 Notifications</div>
                  <div className="info-feature-item">🌍 10 Languages</div>
                  <div className="info-feature-item">👑 Subscription</div>
                  <div className="info-feature-item">⚙️ Account Settings</div>
                  <div className="info-feature-item">🧒 Kids Zone</div>
                  <div className="info-feature-item">🔍 Search</div>
                  <div className="info-feature-item">📱 Responsive</div>
                </div>
              </div>

              <div className="info-built-by">
                <p>🚀 Built with React.js + Firebase + TMDB API</p>
                <p>🎨 Designed with a Cosmic Purple Theme</p>
              </div>
            </div>

          </div>
        </div>
      )}

      <div className="more-cards">
        <ContinueWatching/>
        <TitleCards title={"Popular on StreamVerse"} category={"now_playing"}/>
        <TitleCards title={"Blockbuster Movies"} category={"top_rated"}/>
        <TitleCards title={"Only on StreamVerse"} category={"popular"}/>
        <TitleCards title={"Upcoming"} category={"upcoming"}/>
        <TitleCards title={"Topics for you"} category={"now_playing"}/>
      </div>
      <Footer/>
      <ScrollToTop/>
    </div>
  )
}

export default Home