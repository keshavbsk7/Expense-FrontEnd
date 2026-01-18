import { useEffect, useState } from "react";
import "../CSS/Profile.css";

function Profile() {
  const userId = localStorage.getItem("userId");

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    profileImage: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load profile details
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(
          `https://expense-backend-rxqo.onrender.com/user/${userId}`
        );
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const handleChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Upload profile image
  const uploadProfileImage = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const res = await fetch(
        `https://expense-backend-rxqo.onrender.com/upload-profile-image/${userId}`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error("Upload failed");

      setProfile(prev => ({
        ...prev,
        profileImage: data.imageUrl
      }));
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Save profile details
  const saveProfile = async () => {
    try {
      setSaving(true);

      const res = await fetch(
        `https://expense-backend-rxqo.onrender.com/user/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile)
        }
      );

      if (!res.ok) throw new Error("Save failed");

      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <h3 style={{ textAlign: "center" }}>Loading profile...</h3>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2 className="profile-title">My Profile</h2>

        {/* Profile Image */}
        <div className="profile-image">
          <img
            src={
              profile.profileImage ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(profile.name || "User")
            }
            alt="Profile"
          />

          <label className="upload-btn">
            {uploading ? "Uploading..." : "Change Photo"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => uploadProfileImage(e.target.files[0])}
            />
          </label>
        </div>

        {/* Name */}
        <div className="field">
          <label>Name</label>
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
          />
        </div>

        {/* Username */}
        <div className="field">
          <label>Username</label>
          <input
            name="username"
            value={profile.username}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="field">
          <label>Email</label>
          <input
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </div>

        <button
          className="primary-btn"
          onClick={saveProfile}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default Profile;
