  import { useEffect, useState, useRef } from "react";
  import ExpenseForm from "./ExpenseForm";

  import "../CSS/ViewExpense.css";

  function ViewExpenses() {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [showAddExpense, setShowAddExpense] = useState(false);


    /* CATEGORY FILTER */
    const [showCategoryFilter, setShowCategoryFilter] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
const [loading, setLoading] = useState(true);

    /* DATE FILTER */
    const [showDateFilter, setShowDateFilter] = useState(false);
 
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
  try {
    setLoading(true);

    const res = await fetch(
      `https://expense-backend-rxqo.onrender.com/expenses/${userId}`
    );

    const data = await res.json();
    setExpenses(data);
    setFilteredExpenses(data);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

    useEffect(() => {
      fetchExpenses();
    }, []);

    /* ===============================
      BUILD DATE TREE
    ================================ */
    // useEffect(() => {
    //   const tree = {};
    //   expenses.forEach(exp => {
    //     const d = new Date(exp.date);
    //     const year = d.getFullYear();
    //     const month = d.toLocaleString("default", { month: "long" });
    //     const day = d.getDate();

    //     if (!tree[year]) tree[year] = {};
    //     if (!tree[year][month]) tree[year][month] = new Set();
    //     tree[year][month].add(day);
    //   });

    //   Object.keys(tree).forEach(y =>
    //     Object.keys(tree[y]).forEach(m =>
    //       tree[y][m] = [...tree[y][m]].sort((a, b) => a - b)
    //     )
    //   );

    //   setDateTree(tree);
    // }, [expenses]);

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
  // APPLY dates only when closing
 
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
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [draftFromDate, setDraftFromDate] = useState("");
const [draftToDate, setDraftToDate] = useState("");
    /* ===============================
      FILTER LOGIC
    ================================ */
    useEffect(() => {
      let data = expenses;

      if (selectedCategories.length > 0) {
        data = data.filter(e => selectedCategories.includes(e.category));
      }

        if (fromDate) {
          const from = new Date(fromDate);
          data = data.filter(e => new Date(e.date) >= from);
        }

        if (toDate) {
          const to = new Date(toDate);
          // include the full day
          to.setHours(23, 59, 59, 999);
          data = data.filter(e => new Date(e.date) <= to);
        }



      setFilteredExpenses(data);
    }, [selectedCategories, selectedDates, expenses,fromDate,toDate]);

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
const selectAllCategories = () => {
  setSelectedCategories(categories);
};

const clearAllCategories = () => {
  setSelectedCategories([]);
};
const allCategoriesSelected =
  selectedCategories.length === categories.length && categories.length > 0;


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
if (loading) {
  return (
    <div className="container">

      <div className="header-row">
        <div className="skeleton skeleton-title"></div>
      </div>

      <div className="table-wrapper">
        <table className="expense-table">
          <thead>
            <tr>
              <th><div className="skeleton skeleton-checkbox"></div></th>
              <th><div className="skeleton skeleton-th"></div></th>
              <th><div className="skeleton skeleton-th"></div></th>
              <th><div className="skeleton skeleton-th"></div></th>
              <th><div className="skeleton skeleton-th"></div></th>
            </tr>
          </thead>

          <tbody>
            {[...Array(6)].map((_, i) => (
              <tr key={i}>
                <td><div className="skeleton skeleton-checkbox"></div></td>
                <td><div className="skeleton skeleton-td"></div></td>
                <td><div className="skeleton skeleton-td"></div></td>
                <td><div className="skeleton skeleton-td"></div></td>
                <td><div className="skeleton skeleton-td"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}


    /* ===============================
      RENDER
    ================================ */
    return (
      <div className="container">
        <div className="header-row">
        <h2>Expense Details</h2>

        <div
        className="add-expense-fab"
        onClick={() => setShowAddExpense(true)}
      >
        <span className="fab-tooltip">Add new record</span>
        <span className="fab-icon">+</span>
      </div>

      </div>


        {selectedRows.length > 0 && (
          <div className="table-actions">
            <span className="delete-icon-btn" onClick={() => setShowDeletePopup(true)}>
              🗑️
            </span>
          </div>
        )}

        <div className="table-wrapper">
          <table className={`expense-table ${
    filteredExpenses.length === 0 ? "expense-table-empty" : ""
  }`}>
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
                <th className="category-header" ref={categoryRef}>
  <span
    className="category-trigger"
    onClick={() => setShowCategoryFilter(prev => !prev)}
  >
    Category ▾
  </span>
                 {showCategoryFilter && (
  <div
    className="category-dropdown"
    onClick={(e) => e.stopPropagation()} // CRITICAL
  >
    <input
      className="category-search"
      placeholder="Search..."
      value={categorySearch}
      onChange={(e) => setCategorySearch(e.target.value)}
    />

 <div className="dropdown-actions">
  <label className="dropdown-item select-all">
    <input
      type="checkbox"
      checked={allCategoriesSelected}
      onChange={(e) =>
        e.target.checked
          ? selectAllCategories()
          : clearAllCategories()
      }
    />
    <p>Select All</p>
  </label>
</div>


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
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-rows-cell">
                  No expenses found
                </td>
              </tr>
            ) : (
              filteredExpenses.map(e => (
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
              ))
            )}
          </tbody>

          </table>
        </div>

       {showDateFilter && (
  <div
    ref={dateDropdownRef}
    className="date-dropdown-portal"
    style={{
      top: dateDropdownPos.top,
      left: dateDropdownPos.left
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <div className="date-filter-calendar">
      <label>
        From
        <input
          type="date"
          value={draftFromDate}
          onChange={(e) => setDraftFromDate(e.target.value)}
        />
      </label>

      <label>
        To
        <input
          type="date"
          value={draftToDate}
          onChange={(e) => setDraftToDate(e.target.value)}
        />
      </label>

     <div className="date-filter-actions">
  <button
    type="button"
    className="clear-btn"
    onClick={() => {
      setDraftFromDate("");
      setDraftToDate("");
      setFromDate("");
      setToDate("");
      setShowDateFilter(false);
    }}
  >
    Clear
  </button>

  <button
    type="button"
    className="ok-btn"
    onClick={() => {
      setFromDate(draftFromDate);
      setToDate(draftToDate);
      setShowDateFilter(false);
    }}
  >
    OK
  </button>
</div>

    </div>
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
        {showAddExpense && (
  <div className="popup-overlay">
    <div className="popup-box large expense-modal">
      <ExpenseForm
        onClose={() => setShowAddExpense(false)}
        onSuccess={() => {
          setShowAddExpense(false);
          fetchExpenses(); // refresh list
        }}
      />
    </div>
  </div>
)}

      </div>
    );
  }

  export default ViewExpenses;
