import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://expense-backend-rxqo.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.message);

    if (data.message === "User registered successfully!") {
      navigate("/"); // redirect to login
    }
  };

  return (
    <div className="container login-box">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input className="form-group" type="text" name="name"
          placeholder="Full Name" onChange={handleChange} />

        <input className="form-group" type="text" name="username"
          placeholder="Username" onChange={handleChange} />

        <input className="form-group" type="email" name="email"
          placeholder="Email" onChange={handleChange} />

        <input className="form-group" type="password" name="password"
          placeholder="Password" onChange={handleChange} />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default Register;
