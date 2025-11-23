import { useState } from "react";
import "../App.css";

function ExpenseForm() {
  const [expense, setExpense] = useState({
    amount: "",
    date: "",
    category: "",
    description: ""
  });

  const [showPopup, setShowPopup] = useState(false); // NEW
  const [savedDetails, setSavedDetails] = useState({});
  
  const categories = [
    "Food", "Travel", "Shopping", "Bills", "Health", "Education",
    "Groceries", "Entertainment", "Fuel", "Rent", "EMI / Loans", "Other"
  ];

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const userId = localStorage.getItem("userId");

  const submitExpense = async () => {
    try {
      const res = await fetch("https://expense-backend-rxqo.onrender.com/add-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...expense, userId })
      });

      const data = await res.json();

      // Store saved details and show popup
      setSavedDetails(expense);
      setShowPopup(true);

      // Clear form
      setExpense({
        amount: "",
        date: "",
        category: "",
        description: ""
      });

    } catch {
      alert("Error saving expense");
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>

      <div className="form-group">
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={expense.amount}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <input
          type="date"
          name="date"
          value={expense.date}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <select
          name="category"
          value={expense.category}
          onChange={handleChange}
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <textarea
          name="description"
          placeholder="Description"
          value={expense.description}
          onChange={handleChange}
        />
      </div>

      <button onClick={submitExpense}>Save Expense</button>

      {/* POPUP MODAL */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Expense Added Successfully!</h3>

            <p><strong>Amount:</strong> ₹ {savedDetails.amount}</p>
            <p><strong>Date:</strong> {savedDetails.date}</p>
            <p><strong>Category:</strong> {savedDetails.category}</p>
            <p><strong>Description:</strong> {savedDetails.description}</p>

            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseForm;
