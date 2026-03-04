import React from 'react'
import './Footer.css'
import youtube_icon from '../../assets/youtube_icon.png'
import twitter_icon from '../../assets/twitter_icon.png'
import instagram_icon from '../../assets/instagram_icon.png'
import facebook_icon from '../../assets/facebook_icon.png'

const Footer = () => {
  return (
    <div className='footer'>

      {/* Top Section */}
      <div className="footer-top">
        <div className="footer-brand">
          <h2 className="footer-logo">🎬 StreamVerse</h2>
          <p className="footer-tagline">Your universe of entertainment. Anytime, Anywhere.</p>
          <div className="footer-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src={facebook_icon} alt="Facebook" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <img src={instagram_icon} alt="Instagram" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <img src={twitter_icon} alt="Twitter" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <img src={youtube_icon} alt="YouTube" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="footer-links">
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>About Us</li>
              <li>Investor Relations</li>
              <li>Jobs</li>
              <li>Media Center</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Audio Description</li>
              <li>Gift Cards</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li>Terms of Use</li>
              <li>Privacy Policy</li>
              <li>Legal Notices</li>
              <li>Cookie Preferences</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="footer-divider"></div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p className="copyright-text">© 2024 StreamVerse, Inc. All rights reserved.</p>
        <p className="footer-made">Made with ❤️ for entertainment lovers</p>
      </div>

    </div>
  )
}

export default Footer