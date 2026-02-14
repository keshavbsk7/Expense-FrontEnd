import { Link } from "react-router-dom";
import "../CSS/Landing.css";
import { motion } from "framer-motion";
const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

function Landing() {
  return (
    <div className="landing">

      {/* NAVBAR */}
      <nav className="nav">
        <div className="logo">Expense Tracker</div>

        <div className="nav-links">
         <a onClick={() => scrollToSection("features")}>Features</a>

          {/* <a href="#how">How It Works</a> */}
          <Link to="/login">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">

        {/* Floating Dashboard UI */}
        <div className="hero-floating pointer-events-none">

          {/* Spending card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="ui-card spending"
          >
            <div className="ui-row">
              <span className="ui-label">Spending</span>
              <span className="ui-positive">+12%</span>
            </div>
            <div className="ui-bar"></div>
          </motion.div>

          {/* Analytics widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="ui-card analytics"
          >
            <div className="line"></div>
            <div className="line short"></div>
            <div className="blocks">
              <div></div>
              <div></div>
            </div>
          </motion.div>

          {/* Small metric */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="ui-card small"
          >
            <div className="dot"></div>
            <div className="mini-line"></div>
          </motion.div>

        </div>

        {/* Heading */}
        <h1>
          <span className="hero-white">
            Take Control of Your Money With{" "}
          </span>
          <span className="highlight">
            Intelligent Expense Tracking
          </span>
        </h1>

        <p>
          Get clear analytics, actionable insights, and full financial awareness.
          Track spending, spot trends, and make smarter decisions — all in one place.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">Get Started</Link>
          <Link to="/login" className="btn-outline">Login</Link>
        </div>

      </section>
        {/* FEATURES SECTION */}
<section className="features-section" id="features">

  <div className="features-header">
    <div className="features-strip">
      Smart budgeting for modern life
      <span>Analytics</span>
      <span>Secure</span>
      <span>Smart</span>
    </div>

    <h2 style={{color:"white"}}>Everything you need to stay on top of finances</h2>
    <p>Premium features designed for clarity and control.</p>
  </div>

  <div className="features-grid">

    <div className="feature-card">
      <div className="icon">📊</div>
      <h3>Expense Analytics</h3>
      <p>Visual dashboards and charts to see where your money goes at a glance.</p>
    </div>

    <div className="feature-card">
      <div className="icon">💳</div>
      <h3>Add & Track Expenses</h3>
      <p>Quick expense logging so you never miss a transaction.</p>
    </div>

    <div className="feature-card">
      <div className="icon">💡</div>
      <h3>Smart Insights</h3>
      <p>Understand spending patterns and get personalized recommendations.</p>
    </div>

    <div className="feature-card">
      <div className="icon">🏷️</div>
      <h3>Category Management</h3>
      <p>Organize finances easily with custom categories and tags.</p>
    </div>

    <div className="feature-card">
      <div className="icon">⬇️</div>
      <h3>Download Reports</h3>
      <p>Export financial data in formats that work for you.</p>
    </div>

    <div className="feature-card">
      <div className="icon">🔒</div>
      <h3>Secure Storage</h3>
      <p>Your data is protected with industry-standard security.</p>
    </div>

  </div>

</section>

    </div>
  );
}

export default Landing;
