import { useState } from "react";
import "../CSS/ExpenseForm.css";

function ExpenseForm() {
  const [expense, setExpense] = useState({
    amount: "",
    date: "",
    category: "",
    description: ""
  });

  const [saving, setSaving] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [savedDetails, setSavedDetails] = useState({});

  const userId = localStorage.getItem("userId");

  const categories = [
    "Food", "Travel", "Shopping", "Bills", "Health", "Education",
    "Groceries", "Entertainment", "Fuel", "Rent", "EMI / Loans", "Other"
  ];

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const submitExpense = async () => {
    if (!expense.amount || !expense.date || !expense.category) return;

    try {
      setSaving(true);

      const res = await fetch(
        "https://expense-backend-rxqo.onrender.com/add-expense",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...expense, userId })
        }
      );

      if (!res.ok) throw new Error("Failed");

      setSavedDetails(expense);
      setShowPopup(true);

      setExpense({
        amount: "",
        date: "",
        category: "",
        description: ""
      });
    } catch {
      // future: inline error message
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="expense-page">
      <div className="expense-card">
        <h2 className="expense-title">Add Expense</h2>

        {/* Amount */}
        <div className="field">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={expense.amount}
            onChange={handleChange}
          />
        </div>

        {/* Date */}
        <div className="field">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={expense.date}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <div className="field">
          <label>Category</label>
          <select
            name="category"
            value={expense.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="field">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Optional notes about this expense"
            value={expense.description}
            onChange={handleChange}
          />
        </div>

        {/* Button */}
        <button
          className="primary-btn"
          onClick={submitExpense}
          disabled={saving}
        >
          {saving ? <span className="spinner"></span> : "Save Expense"}
        </button>
      </div>

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
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

            <h3>Expense Added</h3>

            <p><strong>Amount:</strong> ₹ {savedDetails.amount}</p>
            <p><strong>Date:</strong> {savedDetails.date}</p>
            <p><strong>Category:</strong> {savedDetails.category}</p>
            {savedDetails.description && (
              <p><strong>Description:</strong> {savedDetails.description}</p>
            )}

            <button
              className="primary-btn"
              onClick={() => setShowPopup(false)}
              style={{ marginTop: "15px" }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseForm;
