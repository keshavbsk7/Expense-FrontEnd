import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { useEffect, useState } from "react";
import LogoutModal from "./LogoutModal";

function Navbar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("name");

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  // Load profile image
  useEffect(() => {
    if (!userId) return;

    fetch(`https://expense-backend-rxqo.onrender.com/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.profileImage) {
          setProfileImage(data.profileImage);
        }
      })
      .catch(() => {});
  }, [userId]);

  return (
    <>
      <nav className="navbar">
        <h3 className="logo">Expense Tracker</h3>

        <ul className="nav-links">
          <li>
            <Link to="/home" className="nav-item-btn">Home</Link>
          </li>

          <li>
            <Link to="/view-expenses" className="nav-item-btn">
              View Expense Details
            </Link>
          </li>

          <li>
            <button className="logout-btn" onClick={openLogoutModal}>
              Logout
            </button>
          </li>

          {/* PROFILE AVATAR */}
          <li>
            <div
              className="nav-profile-avatar"
              onClick={() => navigate("/profile")}
              title="Profile"
            >
              <img
                src={
                  profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(username || "User")}`
                }
                alt="Profile"
              />
            </div>
          </li>
        </ul>
      </nav>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
        username={username}
      />
    </>
  );
}

export default Navbar;
