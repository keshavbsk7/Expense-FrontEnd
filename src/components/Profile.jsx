import { useEffect, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import "../CSS/Profile.css";
import { FaTimes, FaMinusCircle, FaPlusCircle } from "react-icons/fa";

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

  // Crop States
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(
          `https://expense-backend-rxqo.onrender.com/user/${userId}`
        );
        const data = await res.json();
        setProfile(data);
      } catch {
        console.log("Load failed");
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

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // When user selects image
  const handleFileSelect = (file) => {
    if (!file) return;
    setCropImage(URL.createObjectURL(file));
  };

  // Upload Cropped Image
  const uploadCroppedImage = async () => {
    try {
      const croppedBlob = await getCroppedImg(
        cropImage,
        croppedAreaPixels
      );

      const formData = new FormData();
      formData.append("image", croppedBlob, "profile.jpg");

      setUploading(true);

      const res = await fetch(
        `https://expense-backend-rxqo.onrender.com/upload-profile-image/${userId}`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();

      setProfile(prev => ({
        ...prev,
        profileImage: data.imageUrl
      }));

      setCropImage(null);
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      await fetch(
        `https://expense-backend-rxqo.onrender.com/user/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile)
        }
      );

      alert("Profile updated");
    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

if (loading) {
  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="skeleton skeleton-title"></div>

        <div className="profile-image">
          <div className="skeleton skeleton-avatar"></div>
        </div>

        <div className="skeleton skeleton-input"></div>
        <div className="skeleton skeleton-input"></div>
        <div className="skeleton skeleton-input"></div>

        <div className="skeleton skeleton-button"></div>
      </div>
    </div>
  );
}



  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>My Profile</h2>

        {/* Profile Image */}
        <div className="profile-image">
          <img
            src={
              profile.profileImage ||
              `https://ui-avatars.com/api/?name=${profile.name}`
            }
            alt="Profile"
          />

          <label className="upload-btn">
            Change Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
          </label>
        </div>

        {/* Crop Modal */}
       {cropImage && (
  <div className="premium-modal">

    <div className="premium-card">

      {/* Header */}
      <div className="premium-header">
        <h3>Upload Image</h3>
        <button
          className="icon-btn"
          onClick={() => setCropImage(null)}
        >
          ✕
        </button>
      </div>

      {/* Crop Area */}
      <div className="crop-area-only">
        <Cropper
          image={cropImage}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      {/* Zoom Slider */}
      <div className="premium-slider">
        <span>-</span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(e.target.value)}
        />
        <span>+</span>
      </div>

      {/* Footer */}
      <div className="premium-footer">
        <button
          className="btn-secondary"
          onClick={() => setCropImage(null)}
        >
          Cancel
        </button>

        <button
          className="btn-primary"
          onClick={uploadCroppedImage}
        >
          {uploading ? "Saving..." : "Save"}
        </button>
      </div>

    </div>
  </div>
)}




        {/* Fields */}
        <input name="name" value={profile.name} onChange={handleChange} />
        <input name="username" value={profile.username} onChange={handleChange} />
        <input name="email" value={profile.email} onChange={handleChange} />

        <button onClick={saveProfile} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default Profile;
