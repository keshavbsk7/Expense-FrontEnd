import { useEffect, useState, useRef } from "react";
import "../App.css";

function ViewExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortType, setSortType] = useState(null);

  const dropdownRef = useRef(null);
  const userId = localStorage.getItem("userId");

  const categories = [
    "Food", "Travel", "Shopping", "Bills", "Health",
    "Education", "Groceries", "Entertainment", "Fuel",
    "Rent", "EMI / Loans", "Other"
  ];

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await fetch(`https://expense-backend-rxqo.onrender.com/expenses/${userId}`);
      const data = await res.json();
      setExpenses(data);
      setFilteredExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Toggle category (multi-select)
  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  // Apply filter only after dropdown closes
  const applyFilter = () => {
    if (selectedCategories.length === 0) {
      setFilteredExpenses(expenses);
    } else {
      const filtered = expenses.filter(exp =>
        selectedCategories.includes(exp.category)
      );
      setFilteredExpenses(filtered);
    }
  };

  // Prevent dropdown from closing when selecting item
  const handleItemClick = (e, cat) => {
    e.stopPropagation();
    toggleCategory(cat);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (showCategoryFilter) applyFilter();
        setShowCategoryFilter(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showCategoryFilter, selectedCategories, expenses]);

  // Sort by Amount
  const sortByAmount = () => {
    let sorted;
    if (sortType === "amountAsc") {
      sorted = [...filteredExpenses].sort((a, b) => b.amount - a.amount);
      setSortType("amountDesc");
    } else {
      sorted = [...filteredExpenses].sort((a, b) => a.amount - b.amount);
      setSortType("amountAsc");
    }
    setFilteredExpenses(sorted);
  };

  // Sort by Date
  const sortByDate = () => {
    let sorted;
    if (sortType === "dateAsc") {
      sorted = [...filteredExpenses].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setSortType("dateDesc");
    } else {
      sorted = [...filteredExpenses].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setSortType("dateAsc");
    }
    setFilteredExpenses(sorted);
  };

  return (
    <div className="container">
      <h2>Expense Details</h2>

      <table className="expense-table">
        <thead>
          <tr>
            <th onClick={sortByAmount} style={{ cursor: "pointer" }}>
              Amount {sortType === "amountAsc" ? "↑" : sortType === "amountDesc" ? "↓" : ""}
            </th>

            <th onClick={sortByDate} style={{ cursor: "pointer" }}>
              Date {sortType === "dateAsc" ? "↑" : sortType === "dateDesc" ? "↓" : ""}
            </th>

            <th
              className="category-header"
              style={{ cursor: "pointer", position: "relative" }}
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              ref={dropdownRef}
            >
              Category ▾

              {showCategoryFilter && (
                <div className="category-dropdown">

                  {/* Search Box */}
                  <input
                    type="text"
                    className="category-search"
                    placeholder="Search..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                  />

                  {/* Category List */}
                  {categories
                    .filter(cat =>
                      cat.toLowerCase().includes(categorySearch.toLowerCase())
                    )
                    .map((cat, index) => (
                      <div
                        key={index}
                        className="dropdown-item"
                        onClick={(e) => handleItemClick(e, cat)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          readOnly
                        />
                        <span>{cat}</span>
                      </div>
                    ))}
                </div>
              )}
            </th>

            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {filteredExpenses.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                No records found
              </td>
            </tr>
          ) : (
            filteredExpenses.map(exp => (
              <tr key={exp._id}>
                <td>₹ {exp.amount}</td>
                <td>{exp.date}</td>
                <td>{exp.category}</td>
                <td>{exp.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewExpenses;
