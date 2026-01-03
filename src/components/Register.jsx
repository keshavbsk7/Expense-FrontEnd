import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Register.css";
import RegisterIllustration from "../Assets/register.svg";
import SignupImage from "../Assets/signup.svg";
function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    password: "",
    confirm: "",
    email:""
  });

  const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [registering, setRegistering] = useState(false);
const [registerMessage, setRegisterMessage] = useState("");
const [success, setSuccess] = useState(false);
const [apiError, setApiError] = useState("");
const [fieldError, setFieldError] = useState({ username: false, email: false });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    // LIVE confirm-password validation
    if (name === "confirmPassword") {
      if (value !== form.password) {
        setErrors((prev) => ({ ...prev, confirm: "Passwords do not match" }));
      } else {
        setErrors((prev) => ({ ...prev, confirm: "" }));
      }
    }
  };

  // PASSWORD VALIDATION — ONLY onBlur
  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const upper = /[A-Z]/;
    const lower = /[a-z]/;
    const number = /[0-9]/;
    const special = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(password))
      return "Password must be at least 8 characters long";
    if (!upper.test(password))
      return "Password must contain at least one uppercase letter";
    if (!lower.test(password))
      return "Password must contain at least one lowercase letter";
    if (!number.test(password))
      return "Password must contain at least one digit";
    if (!special.test(password))
      return "Password must contain at least one special character";

    return "";
  };
const validateEmail = (email) => {
  // Standard email validation pattern
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

  const handlePasswordBlur = () => {
    const err = validatePassword(form.password);
    setErrors((prev) => ({ ...prev, password: err }));

    // Also re-check confirm password instantly once password is validated
    if (form.confirmPassword && form.confirmPassword !== form.password) {
      setErrors((prev) => ({ ...prev, confirm: "Passwords do not match" }));
    } else {
      setErrors((prev) => ({ ...prev, confirm: "" }));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (errors.password || errors.confirm) return;

  //   const res = await fetch("https://expense-backend-rxqo.onrender.com/register", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(form)
  //   });

  //   const data = await res.json();
  //   alert(data.message);

  //   if (data.message === "User registered successfully!") {
  //     navigate("/");
  //   }
  // };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (errors.password || errors.confirm || errors.email) return;

  try {
    setRegistering(true);
    setApiError("");
    setFieldError({ username: false, email: false });

    const res = await fetch("https://expense-backend-rxqo.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        email: form.email.trim().toLowerCase()
      })
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(true);
      setRegisterMessage("Account created successfully");
      setTimeout(() => navigate("/"), 2000);
    } else {
      // Map backend message to UI behavior
      setApiError(data.message || "Registration failed");

      if (/username/i.test(data.message)) {
        setFieldError((p) => ({ ...p, username: true }));
      }
      if (/email/i.test(data.message)) {
        setFieldError((p) => ({ ...p, email: true }));
      }
    }
  } catch {
    setApiError("Unable to connect. Please try again.");
  } finally {
    setRegistering(false);
  }
};


  const isDisabled =
    !form.name ||
    !form.username ||
    !form.email ||
    !form.password ||
    !form.confirmPassword ||
    errors.password !== "" ||
    errors.confirm !== ""||
    errors.email!=="";

  return (
  <div className="register-wrapper">

    {/* FLOATING SHAPES */}
    <div className="floating-shape shape1"></div>
    <div className="floating-shape shape2"></div>
    <div className="floating-shape shape3"></div>
<div className="floating-shape shape4"></div>
<div className="floating-shape shape5"></div>
    {/* BACKGROUND ILLUSTRATION */}
    <img
      src={RegisterIllustration}
      alt="illustration"
      className="center-illustration"
    />
     <img
      src={SignupImage}
      alt="illustration"
      className="right-illustration"
    />

    <div className="register-box">
      <h2>Create Account</h2>
{success && (
  <div style={{ marginBottom: "20px", textAlign: "center" }}>
    <svg
      width="60"
      height="60"
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
    <p style={{ color: "#2ecc71", marginTop: "10px" }}>
      {registerMessage}
    </p>
  </div>
)}
{!success && apiError && (
  <div className="error-banner">
    ⚠ {apiError}
  </div>
)}

      {!success && (
        <form onSubmit={handleSubmit}>

        <input
          className="form-group"
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />

        <input
          className={`form-group ${fieldError.username ? "input-error" : ""}`}
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />

        {/* EMAIL */}
        <input
          className={`form-group ${fieldError.email ? "input-error" : ""}`}
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => {
            handleChange(e);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          onBlur={() => {
            if (form.email.length > 0 && !validateEmail(form.email)) {
              setErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
            }
          }}
        />

        {form.email.length > 0 && errors.email && (
          <p className="error-text">{errors.email}</p>
        )}

        {/* PASSWORD */}
        <div className="password-wrapper">
        <input
          className="form-group"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => {
            handleChange(e);
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
          onBlur={handlePasswordBlur}
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


        {form.password.length === 0 && (
          <p className="note-text">
            Password must include:
            <br />• 8+ characters
            <br />• Uppercase, lowercase
            <br />• Number & special character
          </p>
        )}

        {form.password.length > 0 && errors.password && (
          <p className="error-text">{errors.password}</p>
        )}

       <div className="password-wrapper">
        <input
          className="form-group"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
        />

      <span className="eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {!showConfirmPassword  ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" >
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


        {errors.confirm && (
          <p className="error-text">{errors.confirm}</p>
        )}

       <button
  type="submit"
  disabled={isDisabled || registering}
  className="register-btn"
>
  {registering ? <div className="spinner"></div> : "Create Account"}
</button>


        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login here</span>
        </p>

      </form>
      )}
    </div>
  </div>
);

}

export default Register;
