import { useEffect, useState, useRef } from "react";
import "../CSS/ViewExpense.css";

function ViewExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  /* CATEGORY FILTER */
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  /* DATE FILTER */
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateTree, setDateTree] = useState({});
  const [expanded, setExpanded] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [dateDropdownPos, setDateDropdownPos] = useState({ top: 0, left: 0 });
const dateThRef = useRef(null);

  /* SORT */
  const [sortType, setSortType] = useState(null);

  /* DELETE */
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const categoryRef = useRef(null);
  const dateTriggerRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const userId = localStorage.getItem("userId");

  const categories = [
    "Food", "Travel", "Shopping", "Bills", "Health",
    "Education", "Groceries", "Entertainment", "Fuel",
    "Rent", "EMI / Loans", "Other"
  ];

  /* ===============================
     FETCH EXPENSES
  ================================ */
  const fetchExpenses = async () => {
    const res = await fetch(
      `https://expense-backend-rxqo.onrender.com/expenses/${userId}`
    );
    const data = await res.json();
    setExpenses(data);
    setFilteredExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  /* ===============================
     BUILD DATE TREE
  ================================ */
  useEffect(() => {
    const tree = {};
    expenses.forEach(exp => {
      const d = new Date(exp.date);
      const year = d.getFullYear();
      const month = d.toLocaleString("default", { month: "long" });
      const day = d.getDate();

      if (!tree[year]) tree[year] = {};
      if (!tree[year][month]) tree[year][month] = new Set();
      tree[year][month].add(day);
    });

    Object.keys(tree).forEach(y =>
      Object.keys(tree[y]).forEach(m =>
        tree[y][m] = [...tree[y][m]].sort((a, b) => a - b)
      )
    );

    setDateTree(tree);
  }, [expenses]);

  /* ===============================
     OUTSIDE CLICK HANDLER
  ================================ */
  useEffect(() => {
    const handler = (e) => {
      if (
        showDateFilter &&
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(e.target) &&
        !dateTriggerRef.current.contains(e.target)
      ) {
        setShowDateFilter(false);
      }

      if (
        showCategoryFilter &&
        categoryRef.current &&
        !categoryRef.current.contains(e.target)
      ) {
        setShowCategoryFilter(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDateFilter, showCategoryFilter]);

  /* ===============================
     FILTER LOGIC
  ================================ */
  useEffect(() => {
    let data = expenses;

    if (selectedCategories.length > 0) {
      data = data.filter(e => selectedCategories.includes(e.category));
    }

    if (selectedDates.length > 0) {
      data = data.filter(e => selectedDates.includes(e.date));
    }

    setFilteredExpenses(data);
  }, [selectedCategories, selectedDates, expenses]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleExpand = (key) =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleDate = (date) =>
    setSelectedDates(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );

  /* ===============================
     SORTING
  ================================ */
  const sortByAmount = () => {
    const sorted = [...filteredExpenses].sort((a, b) =>
      sortType === "amountAsc" ? b.amount - a.amount : a.amount - b.amount
    );
    setSortType(sortType === "amountAsc" ? "amountDesc" : "amountAsc");
    setFilteredExpenses(sorted);
  };

  /* ===============================
     DELETE
  ================================ */
  const toggleRow = (id) =>
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const toggleSelectAll = () =>
    setSelectedRows(
      selectedRows.length === filteredExpenses.length
        ? []
        : filteredExpenses.map(e => e._id)
    );

  const deleteSelected = async () => {
    await fetch(
      "https://expense-backend-rxqo.onrender.com/delete-multiple",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedRows })
      }
    );
    setSelectedRows([]);
    setShowDeletePopup(false);
    fetchExpenses();
  };

  /* ===============================
     DATE DROPDOWN OPEN
  ================================ */
const openDateFilter = () => {
  const thRect = dateThRef.current.getBoundingClientRect();

  const dropdownWidth = 260; // must match CSS width

  setDateDropdownPos({
    top: thRect.bottom + window.scrollY + 8,
    left:
      thRect.left +
      window.scrollX +
      thRect.width / 2 -
      dropdownWidth / 2
  });

  setShowDateFilter(prev => !prev);
};


  /* ===============================
     RENDER
  ================================ */
  return (
    <div className="container">
      <h2>Expense Details</h2>

      {selectedRows.length > 0 && (
        <div className="table-actions">
          <span className="delete-icon-btn" onClick={() => setShowDeletePopup(true)}>
            🗑️
          </span>
        </div>
      )}

      <div className="table-wrapper">
        <table className="expense-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRows.length === filteredExpenses.length}
                  onChange={toggleSelectAll}
                />
              </th>

              <th onClick={sortByAmount}>Amount</th>

            <th ref={dateThRef}>
              <span
                className="date-trigger"
                ref={dateTriggerRef}
                onClick={openDateFilter}
              >
                Date ▾
              </span>
            </th>
              <th
                className="category-header"
                ref={categoryRef}
                onClick={() => setShowCategoryFilter(prev => !prev)}
              >
                Category ▾
                {showCategoryFilter && (
                  <div className="category-dropdown">
                    <input
                      className="category-search"
                      placeholder="Search..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                    />
                    {categories
                      .filter(c =>
                        c.toLowerCase().includes(categorySearch.toLowerCase())
                      )
                      .map(c => (
                        <div
                          key={c}
                          className="dropdown-item"
                          onClick={() => toggleCategory(c)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(c)}
                            readOnly
                          />
                          <span>{c}</span>
                        </div>
                      ))}
                  </div>
                )}
              </th>

              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {filteredExpenses.map(e => (
              <tr key={e._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(e._id)}
                    onChange={() => toggleRow(e._id)}
                  />
                </td>
                <td>₹ {e.amount}</td>
                <td>{e.date}</td>
                <td>{e.category}</td>
                <td>{e.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DATE DROPDOWN (PORTAL STYLE) */}
      {showDateFilter && (
        <div
          ref={dateDropdownRef}
          className="date-dropdown-portal"
          style={{
            top: dateDropdownPos.top,
            left: dateDropdownPos.left
          }}
        >
          {Object.keys(dateTree).map(year => (
            <div key={year}>
              <div className="tree-item" onClick={() => toggleExpand(year)}>
                ▸ {year}
              </div>

              {expanded[year] &&
                Object.keys(dateTree[year]).map(month => {
                  const key = `${year}-${month}`;
                  return (
                    <div key={key} className="tree-children">
                      <div
                        className="tree-item"
                        onClick={() => toggleExpand(key)}
                      >
                        ▸ {month}
                      </div>

                      {expanded[key] &&
                        dateTree[year][month].map(day => {
                          const m =
                            new Date(`${month} 1`).getMonth() + 1;
                          const dateStr = `${year}-${String(m).padStart(
                            2,
                            "0"
                          )}-${String(day).padStart(2, "0")}`;

                          return (
                            <div key={dateStr} className="tree-leaf">
                              <input
                                type="checkbox"
                                checked={selectedDates.includes(dateStr)}
                                onChange={() => toggleDate(dateStr)}
                              />
                              {day}
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      )}

      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Delete selected items?</h3>
            <button onClick={deleteSelected}>Delete</button>
            <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewExpenses;
