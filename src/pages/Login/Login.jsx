import React, { useState } from 'react'
import './Login.css'
import logo from '../../assets/logo.png'
import { login, signup } from '../../firebase'
import StreamVerse_spinner from '../../assets/netflix_spinner.gif'

const Login = () => {

  const [signState, setSignSate] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const user_auth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (signState === "Sign In") {
      const result = await login(email, password);
      if (!result.success) {
        setLoading(false);
        setErrorMessage(result.error);
      }
    } else {
      if (!name.trim()) {
        setErrorMessage("Please enter your name");
        setLoading(false);
        return;
      }
      const result = await signup(name, email, password);
      if (!result.success) {
        setLoading(false);
        setErrorMessage(result.error);
      }
    }
  }

  return (
    loading ? (
      <div className='login-spinner'>
        <img src={StreamVerse_spinner} alt="" />
      </div>
    ) : (
      <div className='login'>

        {/* Background Stars Effect */}
        <div className="login-bg">
          <div className="stars"></div>
        </div>

        {/* Logo */}
        <img src={logo} className='login-logo' alt="" />

        {/* Form Card */}
        <div className="login-form">

          {/* Top glow line */}
          <div className="form-glow-line"></div>

          <h1>{signState}</h1>
          <p className="login-subtitle">
            {signState === "Sign In" ? "Welcome back to StreamVerse 🎬" : "Join StreamVerse today 🚀"}
          </p>

          {errorMessage && (
            <div className="error-message">
              ⚠️ {errorMessage}
            </div>
          )}

          <form>
            {signState === "Sign Up" && (
              <div className="input-group">
                <span className="input-icon">👤</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder='Your name'
                />
              </div>
            )}

            <div className="input-group">
              <span className="input-icon">📧</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder='Email address'
              />
            </div>

            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder='Password'
              />
            </div>

            <button onClick={user_auth} type='submit'>
              {signState === "Sign In" ? "🚀 Sign In" : "✨ Create Account"}
            </button>

            <div className="form-help">
              <div className="remember">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember Me</label>
              </div>
              <p className="need-help">Need Help?</p>
            </div>
          </form>

          <div className="form-switch">
            {signState === "Sign In" ? (
              <p>New to StreamVerse?
                <span onClick={() => { setSignSate("Sign Up"); setErrorMessage(""); }}>
                  Sign Up Now
                </span>
              </p>
            ) : (
              <p>Already have an account?
                <span onClick={() => { setSignSate("Sign In"); setErrorMessage(""); }}>
                  Sign In Now
                </span>
              </p>
            )}
          </div>

        </div>
      </div>
    )
  )
}

export default Login