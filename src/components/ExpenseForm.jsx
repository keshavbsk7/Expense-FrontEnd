import { useState } from "react";
import "../CSS/ExpenseForm.css";

function ExpenseForm({ onClose, onSuccess }) {
  const [expense, setExpense] = useState({
    amount: "",
    date: "",
    category: "",
    description: "",
    transactionType: "debit"
  });

  const [saving, setSaving] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [savedDetails, setSavedDetails] = useState({});

  const userId = localStorage.getItem("userId");

  const debitCategories = [
    "Food", "Travel", "Shopping", "Bills", "Health", "Education",
    "Groceries", "Entertainment", "Fuel", "Rent", "EMI / Loans", "Other"
  ];
const creditCategories = [
  "Salary",
  "Business Income",
  "Freelance / Consulting",
  "Investment Returns",
  "Refund / Cashback"
];
 const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "transactionType") {
    setExpense(prev => ({
      ...prev,
      transactionType: value,
      category: "" // reset category when type changes
    }));
  } else {
    setExpense(prev => ({
      ...prev,
      [name]: value
    }));
  }
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

    onSuccess?.();
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
            autoFocus
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

        {/* Transaction Type */}
        <div className="field">
          <label>Transaction Type</label>
          <select
            name="transactionType"
            value={expense.transactionType}
            onChange={handleChange}
          >
            <option value="debit">Debit (Expense)</option>
            <option value="credit">Credit (Income)</option>
          </select>
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
            {(expense.transactionType === "credit"
              ? creditCategories
              : debitCategories
            ).map((cat, i) => (
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

        {/* ACTION BUTTONS */}
        <div className="form-actions">
          <button
            className="secondary-btn"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>

          <button
            className="primary-btn"
            onClick={submitExpense}
            disabled={saving}
          >
            {saving ? <span className="spinner"></span> : "Save Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseForm;
