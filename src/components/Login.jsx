import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import "../CSS/Login.css";
import FinanceImg from "../Assets/illustration.svg";

function Login({ setIsLoggedIn }) {
  const [user, setUser] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
const [successMessage, setSuccessMessage] = useState("");
const [loggingIn, setLoggingIn] = useState(false);
const [loginError, setLoginError] = useState("");

  // ✅ UI MODE STATE
  const [mode, setMode] = useState("LOGIN"); // LOGIN | FORGOT
  const [email, setEmail] = useState("");
const [otp, setOtp] = useState("");
const [newPassword, setNewPassword] = useState("");
const [sendingOtp, setSendingOtp] = useState(false);
const [infoMessage, setInfoMessage] = useState("");
const [showToast, setShowToast] = useState(false);

const [shake, setShake] = useState(false);

  const navigate = useNavigate();

const handleChange = (e) => {
  setUser({ ...user, [e.target.name]: e.target.value });

  if (loginError) {
    setLoginError("");
  }
  

};

  if (localStorage.getItem("userId")) {
    return <Navigate to="/home" replace />;
  }

  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   if (!user.username || !user.password) {
  //     alert("Please enter both fields");
  //     return;
  //   }

  //   try {
  //     const res = await fetch("https://expense-backend-rxqo.onrender.com/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(user),
  //     });

  //     const data = await res.json();

  //     if (res.ok && data.userId) {
  //       localStorage.setItem("userId", data.userId);
  //       localStorage.setItem("name", data.name);
  //       setIsLoggedIn(true);
  //       navigate("/home", { replace: true });
  //     } else {
  //       alert(data.message || "Invalid credentials");
  //     }
  //   } catch {
  //     alert("Server error");
  //   }
  // };
const handleLogin = async (e) => {
  e.preventDefault();

  if (!user.username || !user.password) {
    setLoginError("Please enter username and password");
    return;
  }

  try {
    setLoggingIn(true);
    setLoginError("");

    const res = await fetch("https://expense-backend-rxqo.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();

    if (res.ok && data.userId) {
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("name", data.name);
      setIsLoggedIn(true);
      navigate("/home", { replace: true });
    } else
  {
    setLoginError(data.message || "Invalid username or password");
  setShake(true);
 setUser(prev => ({
    ...prev,
    password: ""
  }));
  setTimeout(() => {
    setShake(false);
  }, 400);
  }
  } catch {
    setLoginError("Server error. Please try again.");
  setShake(true);
    setUser(prev => ({
        ...prev,
        password: ""
      }));
  setTimeout(() => {
    setShake(false);
  }, 400);
  } finally {
    setLoggingIn(false);
  }
};

const handleForgotPassword = async () => {
  if (!email) {
    setInfoMessage("Please enter your email");
    return;
  }

  try {
    setSendingOtp(true);
    setInfoMessage("");

    const res = await fetch("https://expense-backend-rxqo.onrender.com/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setMode("OTP");
      setInfoMessage("OTP has been sent to your email. Please check your inbox. If not found, check the spam folder.");
      setShowToast(true);
      setTimeout(() => {
    setShowToast(false);
  }, 4000);
    } else {
      setInfoMessage("Unable to send OTP. Try again.");
    }
  } catch {
    setInfoMessage("Something went wrong. Please try again.");
  } finally {
    setSendingOtp(false);
  }
};

const handleVerifyOtp = async () => {
  if (!otp) {
    alert("Please enter OTP");
    return;
  }

  try {
    const res = await fetch("https://expense-backend-rxqo.onrender.com/verify-reset-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (res.ok) {
      setMode("RESET");
    } else {
      alert(data.message || "Invalid OTP");
    }
  } catch {
    alert("OTP verification failed");
  }
};
const handleResetPassword = async () => {
  if (!newPassword) {
    setInfoMessage("Please enter a new password");
    return;
  }

  try {
    const res = await fetch("https://expense-backend-rxqo.onrender.com/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccessMessage("Password changed successfully");
      setMode("SUCCESS");

      // Auto redirect back to login after 2 seconds
      setTimeout(() => {
        setEmail("");
        setOtp("");
        setNewPassword("");
        setSuccessMessage("");
        setMode("LOGIN");
      }, 2000);
    } else {
      setInfoMessage(data.message || "Password reset failed");
    }
  } catch {
    setInfoMessage("Server error while resetting password");
  }
};


  return (
    <div className="login-container">
    {showToast && (
  <div className="progress-toast">
    <div className="toast-content">
      
      <p>{infoMessage}</p>
    </div>
    <div className="toast-progress"></div>
  </div>
)}


      {/* LEFT SIDE ILLUSTRATION */}
      <div className="illustration">
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>

        <img
          src={FinanceImg}
          alt="illustration"
          className="side-illustration-img"
        />

        <div className="glass-box">
          <h1>Track Your Expenses Easily</h1>
          <p>Monitor, manage, and save — all in one place.</p>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN CARD */}
      <div className="login-section">
        <div className={`login-box ${shake ? "shake" : ""}`}>


          {mode === "LOGIN" && (
            <>
              <h2>Welcome Back</h2>
              <p className="subtitle">Login to continue</p>

              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={user.username}
                    onChange={handleChange}
                   // className={loginError ? "input-error" : ""}
                    required
                  />
                </div>

                <div className="input-group password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleChange}
                    className={loginError ? "input-error" : ""}
                    required
                  />

                <span className="eye" onClick={() => setShowPassword(!showPassword)}>
                {!showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                    <path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.77 21.77 0 0 1-5.06 5.94" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </span>
                </div>

                <div style={{ textAlign: "right", marginBottom: "10px" }}>
                  <span
                    style={{
                      color: "#007bff",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                    onClick={() => setMode("FORGOT")}
                  >
                    Forgot password?
                  </span>
                </div>
                {loginError && (
                <div className="error-message">
                  {loginError}
                </div>
              )}
                <button
                type="submit"
                className="login-btn"
                disabled={loggingIn}
              >
                {loggingIn ? <div className="spinner"></div> : "Login"}
              </button>

              </form>

              <p className="register">
                New user?
                <span onClick={() => navigate("/register")}>
                  {" "}Create an account
                </span>
              </p>
            </>
          )}

          {mode === "FORGOT" && (
            <>
              <h2>Reset Password</h2>
              <p className="subtitle">Enter your registered email</p>

              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

         <button
  className="login-btn"
  onClick={handleForgotPassword}
  disabled={sendingOtp}
>
  {sendingOtp ? "Sending OTP..." : "Send OTP"}
</button>


              <div style={{ textAlign: "center" }}>
                <span
                  style={{
                    color: "#007bff",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                  onClick={() => setMode("LOGIN")}
                >
                  Back to Login
                </span>
              </div>
            </>
          )}
          {mode === "OTP" && (
  <>
    <h2>Verify OTP</h2>
    <p className="subtitle">Enter the OTP sent to your email</p>

    <div className="input-group">
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
    </div>

    <button className="login-btn" onClick={handleVerifyOtp}>
      Verify OTP
    </button>
  </>
)}
{mode === "RESET" && (
  <>
    <h2>Set New Password</h2>
    <p className="subtitle">Enter your new password</p>

    <div className="input-group">
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </div>

    <button className="login-btn" onClick={handleResetPassword}>
      Reset Password
    </button>
  </>
)}
{mode === "SUCCESS" && (
  <>
    <div style={{ marginBottom: "15px" }}>
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2ecc71"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </div>

    <h2>Success</h2>
    <p className="subtitle">{successMessage}</p>
  </>
)}



        </div>
      </div>
    </div>
  );
}

export default Login;