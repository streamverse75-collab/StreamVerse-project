import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase'
import { updatePassword, updateProfile, deleteUser, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail } from 'firebase/auth'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import Navbar from '../../components/Navbar/Navbar'
import './Account.css'

const Account = () => {

  const navigate = useNavigate();
  const fileRef = useRef();

  const [displayName, setDisplayName] = useState('');
  const [firestoreName, setFirestoreName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [profilePic, setProfilePic] = useState(auth.currentUser?.photoURL || null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  // Payment states
  const [showPayment, setShowPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  useEffect(() => {
    const fetchName = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", auth.currentUser?.uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const name = snapshot.docs[0].data().name;
          setFirestoreName(name);
          setDisplayName(name);
        }
      } catch (error) {
        console.error("Failed to fetch name", error);
      }
    };
    fetchName();
  }, []);

  const handleChangeName = async () => {
    if (!displayName.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      const q = query(collection(db, "users"), where("uid", "==", auth.currentUser?.uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        await updateDoc(doc(db, "users", snapshot.docs[0].id), { name: displayName });
      }
      setFirestoreName(displayName);
      toast.success("Display name updated! ✅");
    } catch (error) {
      toast.error("Failed to update name");
    }
    setLoading(false);
  }

  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast.error("Enter your current password!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      toast.success("Password updated! ✅");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error("Current password is incorrect!");
    }
    setLoading(false);
  }

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, auth.currentUser?.email);
      toast.success(`Password reset email sent to ${auth.currentUser?.email} 📧`);
    } catch (error) {
      toast.error("Failed to send reset email");
    }
  }

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      setProfilePic(reader.result);
      try {
        await updateProfile(auth.currentUser, { photoURL: reader.result });
        toast.success("Profile picture updated! ✅");
      } catch (error) {
        toast.error("Failed to update profile picture");
      }
    };
    reader.readAsDataURL(file);
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Enter your password to confirm!");
      return;
    }
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, deletePassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteUser(auth.currentUser);
      toast.success("Account deleted!");
      navigate('/login');
    } catch (error) {
      toast.error("Incorrect password!");
    }
    setLoading(false);
  }

  const handleFakePayment = () => {
    if (!cardNumber || !cardName || !expiry || !cvv) {
      toast.error("Please fill all card details!");
      return;
    }
    if (cardNumber.length < 16) {
      toast.error("Enter a valid 16 digit card number!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setShowPayment(false);
      toast.success("🎉 Welcome to StreamVerse Premium!");
    }, 2000);
  }

  return (
    <div className='account-container'>
      <Navbar/>

      <div className="account-content">
        <h1>⚙️ Account Settings</h1>

        <div className="account-layout">

          {/* Sidebar */}
          <div className="account-sidebar">
            <p className={activeSection === 'profile' ? 'active' : ''} onClick={() => setActiveSection('profile')}>
              🖼️ Profile Picture
            </p>
            <p className={activeSection === 'name' ? 'active' : ''} onClick={() => setActiveSection('name')}>
              ✏️ Display Name
            </p>
            <p className={activeSection === 'password' ? 'active' : ''} onClick={() => setActiveSection('password')}>
              🔒 Change Password
            </p>
            <p className={activeSection === 'subscription' ? 'active' : ''} onClick={() => setActiveSection('subscription')}>
              👑 Subscription
            </p>
            <p className={activeSection === 'delete' ? 'active' : ''} onClick={() => setActiveSection('delete')}>
              🗑️ Delete Account
            </p>
          </div>

          {/* Main Content */}
          <div className="account-main">

            {/* Profile Picture */}
            {activeSection === 'profile' && (
              <div className="account-section">
                <h2>🖼️ Profile Picture</h2>
                <div className="profile-pic-section">
                  <img
                    src={profilePic || 'https://via.placeholder.com/100'}
                    alt="Profile"
                    className="account-profile-pic"
                  />
                  <div>
                    <p className="account-name">{firestoreName || 'User'}</p>
                    <p className="account-email">{auth.currentUser?.email}</p>
                    <button className="account-btn" onClick={() => fileRef.current.click()}>
                      📷 Change Picture
                    </button>
                    <input
                      type="file"
                      ref={fileRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleProfilePicChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Display Name */}
            {activeSection === 'name' && (
              <div className="account-section">
                <h2>✏️ Display Name</h2>
                <p className="account-hint">Current: <span>{firestoreName || 'Not set'}</span></p>
                <input
                  type="text"
                  placeholder="Enter new display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="account-input"
                />
                <button className="account-btn" onClick={handleChangeName} disabled={loading}>
                  {loading ? 'Saving...' : '✅ Save Name'}
                </button>
              </div>
            )}

            {/* Change Password */}
            {activeSection === 'password' && (
              <div className="account-section">
                <h2>🔒 Change Password</h2>
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="account-input"
                />
                <p className="forgot-password-link" onClick={handleForgotPassword}>
                  🔑 Forgot current password? Send reset email
                </p>
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="account-input"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="account-input"
                />
                <button className="account-btn" onClick={handleChangePassword} disabled={loading}>
                  {loading ? 'Updating...' : '🔒 Update Password'}
                </button>
              </div>
            )}

            {/* Subscription */}
            {activeSection === 'subscription' && (
              <div className="account-section">
                <h2>👑 Subscription Plan</h2>

                {subscribed ? (
                  <div className="subscribed-card">
                    <div className="subscribed-badge">⭐ PREMIUM PLAN</div>
                    <h3>🎉 You are a Premium Member!</h3>
                    <ul className="subscription-features">
                      <li>✅ Full movie streaming</li>
                      <li>✅ HD & 4K quality</li>
                      <li>✅ Watch on all devices</li>
                      <li>✅ Download for offline</li>
                      <li>✅ No ads</li>
                    </ul>
                    <p className="subscribed-thankyou">Thank you for supporting StreamVerse 💙</p>
                  </div>

                ) : !showPayment ? (
                  <div className="subscription-card">
                    <div className="subscription-badge">FREE PLAN</div>
                    <p className="subscription-desc">You are currently on the <strong>Free Plan</strong></p>
                    <ul className="subscription-features">
                      <li>✅ Access to all trailers</li>
                      <li>✅ Search movies & TV shows</li>
                      <li>✅ My List feature</li>
                      <li>✅ Browse by language</li>
                      <li>✅ Kids Zone</li>
                    </ul>
                    <div className="subscription-premium">
                      <h3>⭐ Upgrade to Premium</h3>
                      <div className="plan-options">
                        <div
                          className={`plan-option ${selectedPlan === 'monthly' ? 'selected' : ''}`}
                          onClick={() => setSelectedPlan('monthly')}
                        >
                          <p className="plan-name">Monthly</p>
                          <p className="plan-price">₹199<span>/mo</span></p>
                        </div>
                        <div
                          className={`plan-option ${selectedPlan === 'yearly' ? 'selected' : ''}`}
                          onClick={() => setSelectedPlan('yearly')}
                        >
                          <p className="plan-name">Yearly</p>
                          <p className="plan-price">₹999<span>/yr</span></p>
                          <p className="plan-save">Save 58%!</p>
                        </div>
                      </div>
                      <ul>
                        <li>🎬 Full movie streaming</li>
                        <li>📺 HD & 4K quality</li>
                        <li>📱 Watch on all devices</li>
                        <li>⬇️ Download for offline</li>
                      </ul>
                      <button className="account-btn premium-btn" onClick={() => setShowPayment(true)}>
                        👑 Upgrade Now — {selectedPlan === 'monthly' ? '₹199/mo' : '₹999/yr'}
                      </button>
                    </div>
                  </div>

                ) : (
                  <div className="payment-form">
                    <h3>💳 Payment Details</h3>
                    <p className="payment-plan-info">
                      Plan: <span>{selectedPlan === 'monthly' ? 'Monthly — ₹199' : 'Yearly — ₹999'}</span>
                    </p>
                    <div className="card-preview">
                      <p className="card-preview-number">
                        {cardNumber ? cardNumber.replace(/(.{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                      </p>
                      <div className="card-preview-bottom">
                        <p>{cardName || 'CARD HOLDER'}</p>
                        <p>{expiry || 'MM/YY'}</p>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Card Holder Name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="account-input"
                      maxLength={25}
                    />
                    <input
                      type="text"
                      placeholder="Card Number (16 digits)"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      className="account-input"
                      maxLength={16}
                    />
                    <div className="payment-row">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                          setExpiry(val);
                        }}
                        className="account-input"
                        maxLength={5}
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="account-input"
                        maxLength={3}
                      />
                    </div>
                    <div className="payment-buttons">
                      <button className="account-btn" onClick={handleFakePayment} disabled={loading}>
                        {loading ? '⏳ Processing...' : `💳 Pay ${selectedPlan === 'monthly' ? '₹199' : '₹999'}`}
                      </button>
                      <button className="account-btn cancel-btn" onClick={() => setShowPayment(false)}>
                        ✖ Cancel
                      </button>
                    </div>
                    <p className="payment-note">🔒 This is a demo payment — no real charges will be made</p>
                  </div>
                )}
              </div>
            )}

            {/* Delete Account */}
            {activeSection === 'delete' && (
              <div className="account-section">
                <h2>🗑️ Delete Account</h2>
                <div className="delete-warning">
                  ⚠️ This action is <strong>permanent</strong> and cannot be undone! All your data including My List will be deleted.
                </div>
                <input
                  type="password"
                  placeholder="Enter your password to confirm"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="account-input"
                />
                <button className="account-btn delete-btn" onClick={handleDeleteAccount} disabled={loading}>
                  {loading ? 'Deleting...' : '🗑️ Delete My Account'}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Account