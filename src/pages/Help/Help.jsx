import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './Help.css'

const faqs = [
  { q: "How do I add movies to My List?", a: "Click the ➕ button on any movie or TV show card to add it to your personal My List." },
  { q: "How do I change my password?", a: "Go to Account Settings → Change Password. Enter your current password and set a new one." },
  { q: "Why can't I play some videos?", a: "Some titles may not have trailers available on YouTube. Try another title." },
  { q: "How do I cancel my subscription?", a: "Go to Account Settings → Subscription to manage your plan." },
  { q: "How do I switch to Kids mode?", a: "Click 'For Children' in the navbar or go to Switch Profile in the dropdown menu." },
  { q: "How do I browse by language?", a: "Click 'Browse by Language' in the navbar and select your preferred language." },
  { q: "How do I delete my account?", a: "Go to Account Settings → Delete Account. Enter your password to confirm." },
  { q: "How do I update my profile picture?", a: "Go to Account Settings → Profile Picture and click 'Change Picture'." },
]

const Help = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name || !email || !message) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setName(''); setEmail(''); setMessage('');
  }

  return (
    <div className="help-container">
      <Navbar/>
      <div className="help-content">

        <div className="help-hero">
          <h1>❓ Help & Support</h1>
          <p>How can we help you today?</p>
        </div>

        {/* Quick Links */}
        <div className="help-quick-links">
          <div className="help-quick-card" onClick={() => navigate('/account')}>
            <span>⚙️</span>
            <p>Account Settings</p>
          </div>
          <div className="help-quick-card" onClick={() => navigate('/mylist')}>
            <span>❤️</span>
            <p>My List</p>
          </div>
          <div className="help-quick-card" onClick={() => navigate('/kids')}>
            <span>🧒</span>
            <p>Kids Zone</p>
          </div>
          <div className="help-quick-card" onClick={() => navigate('/language')}>
            <span>🌍</span>
            <p>Browse Languages</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="help-section">
          <h2>📋 Frequently Asked Questions</h2>
          <div className="help-faqs">
            {faqs.map((faq, i) => (
              <div key={i} className={`help-faq ${openFaq === i ? 'open' : ''}`}>
                <div className="help-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span>{openFaq === i ? '▲' : '▼'}</span>
                </div>
                {openFaq === i && (
                  <div className="help-faq-a">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="help-section">
          <h2>📧 Contact Us</h2>
          {submitted ? (
            <div className="help-success">
              ✅ Message sent! We'll get back to you soon.
            </div>
          ) : (
            <div className="help-form">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="help-input"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="help-input"
              />
              <textarea
                placeholder="Describe your issue..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="help-input help-textarea"
                rows={4}
              />
              <button className="help-submit-btn" onClick={handleSubmit}>
                📨 Send Message
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Help