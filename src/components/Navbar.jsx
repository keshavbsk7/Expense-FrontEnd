import { Link } from "react-router-dom";
import "../App.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h3 className="logo">Expense Tracker</h3>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/add-expense">Add New Expense</Link></li>
        <li><Link to="/view-expenses">View Expense Details</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
