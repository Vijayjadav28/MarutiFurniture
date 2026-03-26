import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { auth, db } from "../../libs/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RiAdminFill } from "react-icons/ri";
import "./Profile.css";

/* 🔐 Admin emails */
const ADMIN_EMAILS = [
  "vijayjadav2863@gmail.com",
  "marutifurniture@gmail.com",
];

function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const isAdmin =
    currentUser && ADMIN_EMAILS.includes(currentUser.email);

  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  /* 🔄 Fetch user data */
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      setLoading(true);
      try {
        setProfile((prev) => ({
          ...prev,
          displayName: currentUser.displayName || "",
          email: currentUser.email || "",
        }));

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile((prev) => ({
            ...prev,
            ...docSnap.data(),
          }));
        }
      } catch (error) {
        toast.error("Failed to load profile data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  /* ✏️ Handle input */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* 💾 Save profile */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (profile.displayName !== currentUser.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: profile.displayName,
        });
      }

      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userRef,
        {
          displayName: profile.displayName,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          zipCode: profile.zipCode,
          country: profile.country,
          lastUpdated: new Date(),
        },
        { merge: true }
      );

      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* 🚪 Logout */
  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("isAdmin");
      navigate("/signin");
    } catch {
      toast.error("Failed to log out");
    }
  };

  if (loading && !profile.email) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      {/* 🔰 Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.displayName
            ? profile.displayName.charAt(0).toUpperCase()
            : "U"}
        </div>

        <div>
          <h3>
            {profile.displayName || "User"}
            {isAdmin && (
              <RiAdminFill
                title="Admin"
                style={{ color: "crimson", marginLeft: "6px" }}
              />
            )}
          </h3>
          <p>{profile.email}</p>
        </div>
      </div>

      {/*  Edit  */}
      {editMode ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="displayName"
              value={profile.displayName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input value={profile.email} disabled />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              value={profile.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <input
              name="city"
              placeholder="City"
              value={profile.city}
              onChange={handleInputChange}
            />
            <input
              name="state"
              placeholder="State"
              value={profile.state}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <input
              name="zipCode"
              placeholder="ZIP Code"
              value={profile.zipCode}
              onChange={handleInputChange}
            />
            <input
              name="country"
              placeholder="Country"
              value={profile.country}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        /*  View */
        <div className="profile-details">
          <p><b>Phone:</b> {profile.phone || "Not set"}</p>
          <p>
            <b>Address:</b>{" "}
            {profile.address
              ? `${profile.address}, ${profile.city}, ${profile.state} ${profile.zipCode}, ${profile.country}`
              : "Not set"}
          </p>

          <div className="profile-actions">
            <button
              className="edit-btn"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>

            <button
              className="edit-btn"
              style={{ background: "#218838" }}
              onClick={() => navigate("/orders")}
            >
              My Orders
            </button>

            {isAdmin && (
              <button
                className="edit-btn"
                style={{ background: "#218838" }}
                onClick={() => navigate("/profile/admin/admindashboard")}
              >
                Admin Dashboard
              </button>
            )}

            <button
              className="profile-logout-btn"
              onClick={handleLogout}
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
