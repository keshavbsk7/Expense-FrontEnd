import { NavLink, useNavigate } from "react-router-dom";

//import "../App.css";

import "../CSS/Navbar.css";
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
const [showDropdown, setShowDropdown] = useState(false);
const [showNavbar, setShowNavbar] = useState(true);
const [lastScrollY, setLastScrollY] = useState(window.scrollY);

  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };
  useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      // scrolling DOWN
      setShowNavbar(false);
    } else {
      // scrolling UP
      setShowNavbar(true);
    }

    setLastScrollY(currentScrollY);
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, [lastScrollY]);

useEffect(() => {
  const handleClick = () => setShowDropdown(false);
  window.addEventListener("click", handleClick);

  return () => window.removeEventListener("click", handleClick);
}, []);

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
      <nav className={`premium-navbar ${showNavbar ? "nav-visible" : "nav-hidden"}`}>
        <h3
  className="logo"
  onClick={() => navigate("/home")}
  style={{ cursor: "pointer" }}
>
  Expense Tracker
</h3>


        <ul className="nav-links">
          <NavLink to="/home" className="nav-item-btn">
  Home
</NavLink>


          <li>
            <NavLink to="/view-expenses" className="nav-item-btn">
              View Expense Details
            </NavLink>
          </li>

          <li className="profile-wrapper">
  <div
    className="nav-profile-avatar"
    onClick={(e) => {
      e.stopPropagation();
      setShowDropdown(!showDropdown);
    }}
  >
    <img
      src={
        profileImage ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(username || "User")}`
      }
      alt="Profile"
    />
  </div>

  {showDropdown && (
    <div className="profile-dropdown">
      <div
        className="dropdown-item"
        onClick={() => {
          setShowDropdown(false);
          navigate("/profile");
        }}
      >
        👤 My Profile
      </div>

      <div
        className="dropdown-item logout"
        onClick={() => {
          setShowDropdown(false);
          openLogoutModal();
        }}
      >
        🚪 Logout
      </div>
    </div>
  )}
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
