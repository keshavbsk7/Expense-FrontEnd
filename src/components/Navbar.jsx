import { NavLink, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import "../CSS/Navbar.css";
import { useEffect, useState } from "react";
import LogoutModal from "./LogoutModal";

// You can replace this URL with any GIF/Image of your choice (e.g., a running mario, a cat, etc.)
const MASCOT_IMAGE = "https://media.tenor.com/fSsxftCb8w0AAAAi/pikachu-running.gif"; 

function Navbar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);

  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current path
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
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

  useEffect(() => {
    if (!userId) return;
    fetch(`https://expense-backend-rxqo.onrender.com/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.profileImage) {
          setProfileImage(data.profileImage);
        }
      })
      .catch(() => {});
  }, [userId]);

  // Helper component to render the mascot
  const ActiveMascot = () => (
    <div className="mascot-container">
      <img src={MASCOT_IMAGE} alt="Active" className="mascot-img" />
    </div>
  );

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
          {/* HOME LINK */}
          <li className="nav-item-wrapper">
            {location.pathname === "/home" && <ActiveMascot />}
            <NavLink to="/home" className="nav-item-btn">
              Home
            </NavLink>
          </li>

          {/* VIEW EXPENSES LINK */}
          <li className="nav-item-wrapper">
            {location.pathname === "/view-expenses" && <ActiveMascot />}
            <NavLink to="/view-expenses" className="nav-item-btn">
              View Expense Details
            </NavLink>
          </li>

          {/* PROFILE SECTION */}
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
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    username || "User"
                  )}`
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