import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { auth, db } from '../../libs/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Profile.css';

function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  

  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);


  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        setLoading(true);
        try {
      
          setProfile(prev => ({
            ...prev,
            displayName: currentUser.displayName || '',
            email: currentUser.email || ''
          }));

      
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile(prev => ({
              ...prev,
              ...docSnap.data()
            }));
          }
        } catch (error) {
          toast.error('Failed to load profile data');
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
     
      if (profile.displayName !== currentUser.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: profile.displayName
        });
      }

     
      const userRef = doc(db, 'users', currentUser.uid);
      
      await setDoc(userRef, {
        displayName: profile.displayName,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        zipCode: profile.zipCode,
        country: profile.country,
        lastUpdated: new Date()
      }, { merge: true });

      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/signin');
    } catch (error) {
      toast.error('Failed to log out');
      console.error('Logout error:', error);
    }
  };

  if (loading && !profile.email) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h3>{profile.displayName || 'User'}</h3>
          <p>{profile.email}</p>
        </div>
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="displayName"
              value={profile.displayName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>State/Province</label>
              <input
                type="text"
                name="state"
                value={profile.state}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ZIP/Postal Code</label>
              <input
                type="text"
                name="zipCode"
                value={profile.zipCode}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={profile.country}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => setEditMode(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Full Name:</span>
            <span className="detail-value">{profile.displayName || 'Not set'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{profile.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{profile.phone || 'Not set'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Address:</span>
            <span className="detail-value">
              {profile.address 
                ? `${profile.address}, ${profile.city}, ${profile.state} ${profile.zipCode}, ${profile.country}`
                : 'Not set'
              }
            </span>
          </div>

          <div className="profile-actions">
            <button 
              onClick={() => setEditMode(true)}
              className="edit-btn"
            >
              Edit Profile
            </button>
            <button 
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;