import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AddExpense from "./components/AddExpense";
import ViewExpenses from "./components/ViewExpenses";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Landing from "./components/Landing";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("userId") !== null
  );

  const location = useLocation(); // NOW SAFE!

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("userId") !== null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

const hideNavbarRoutes = ["/", "/login", "/register"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {isLoggedIn && !shouldHideNavbar && <Navbar />}

      <Routes>
          <Route
    path="/"
    element={isLoggedIn ? <Navigate to="/home" /> : <Landing />}
  />
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />


        <Route path="/register" element={<Register />} />

        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/" />} />

        <Route path="/add-expense" element={isLoggedIn ? <AddExpense /> : <Navigate to="/" />} />

        <Route path="/view-expenses" element={isLoggedIn ? <ViewExpenses /> : <Navigate to="/" />} />

        <Route path="/profile" element={<Profile />} />

      </Routes>
    </>
  );
}

export default App;
