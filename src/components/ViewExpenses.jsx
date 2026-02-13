  import { useEffect, useState, useRef } from "react";
  import ExpenseForm from "./ExpenseForm";
import * as XLSX from "xlsx-js-style";
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
      pagination
    ================================ */
    /* ===============================
     PAGINATION STATE & LOGIC
  ================================ */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default 4 items

  // Reset to Page 1 when filters change (important!)
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredExpenses]);

  // Calculate indices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  // Change page
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
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
/* ===============================
     DOWNLOAD EXCEL (STYLED)
  ================================ */
  const downloadExcel = () => {
    // 1. Format data
    const dataToExport = filteredExpenses.map(expense => ({
      Date: new Date(expense.date).toLocaleDateString(),
      Category: expense.category,
      Description: expense.description,
      Amount: Number(expense.amount) // Ensure it's a number for math
    }));

    // 2. Create Sheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // 3. Set Column Widths (Date, Category, Description, Amount)
    worksheet["!cols"] = [
      { wch: 15 }, // A: Date
      { wch: 20 }, // B: Category
      { wch: 30 }, // C: Description
      { wch: 15 }  // D: Amount
    ];

    // 4. Define Styles
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "2F75B5" } }, // Dark Blue background
      border: {
        top: { style: "thin" }, bottom: { style: "thin" },
        left: { style: "thin" }, right: { style: "thin" }
      },
      alignment: { horizontal: "center", vertical: "center" }
    };

    const cellStyle = {
      border: {
        top: { style: "thin" }, bottom: { style: "thin" },
        left: { style: "thin" }, right: { style: "thin" }
      },
      alignment: { vertical: "center" }
    };

    // 5. Apply Styles to All Cells
    // We decode the range (e.g., A1:D10) to loop through every cell
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue; // Skip if cell is empty

        // Apply style
        if (R === 0) {
          // HEADER ROW
          worksheet[cellAddress].s = headerStyle;
        } else {
          // DATA ROWS
          worksheet[cellAddress].s = cellStyle;
          
          // Special format for Amount column (Column index 3 / 'D')
          if (C === 3) {
            worksheet[cellAddress].z = '"₹" #,##0.00'; // Currency format
          }
        }
      }
    }

    // 6. Create Workbook and Download
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    
    const fileName = `Expenses_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
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
        <div className="fab-top-group">
          {selectedRows.length > 0 && (
            <div className="delete-expense-fab">
              <span className="fab-tooltip">Delete</span>
              <span className="fab-icon">🗑</span>
            </div>
          )}
          <div className="add-expense-fab">
            <span className="fab-tooltip">Add new record</span>
            <span className="fab-icon">+</span>
          </div>
        </div>
      </div>

      {/* === NEW CARD WRAPPER STARTS HERE === */}
      <div className="table-card">
        
        {/* 1. SCROLLABLE TABLE AREA */}
        <div className="table-scroll-area">
          <table
            className={`expense-table ${
              filteredExpenses.length === 0 ? "expense-table-empty" : ""
            }`}
          >
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredExpenses.length && filteredExpenses.length > 0}
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
                    onClick={() => setShowCategoryFilter((prev) => !prev)}
                  >
                    Category ▾
                  </span>
                  {showCategoryFilter && (
                    <div
                      className="category-dropdown"
                      onClick={(e) => e.stopPropagation()}
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
                        .filter((c) =>
                          c.toLowerCase().includes(categorySearch.toLowerCase())
                        )
                        .map((c) => (
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
              {currentExpenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-rows-cell">
                    No expenses found
                  </td>
                </tr>
              ) : (
                currentExpenses.map((e) => (
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

        {/* 2. PAGINATION BAR (INSIDE THE CARD NOW) */}
        {filteredExpenses.length > 0 && (
          <div className="pagination-bar">
            {/* Rows per page selector */}
            <div className="rows-per-page">
              <span>Rows:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <span className="page-info">
              {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredExpenses.length)} of{" "}
              {filteredExpenses.length}
            </span>

            {/* Page Navigation */}
            <div className="page-nav">
              <button
                className="page-btn"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                ❮
              </button>

              <button
                className="page-btn"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                ❯
              </button>
            </div>
          </div>
        )}
      </div>
      {/* === CARD WRAPPER ENDS HERE === */}

      {/* MODALS AND POPUPS (Kept exactly as they were) */}
      {showDateFilter && (
        <div
          ref={dateDropdownRef}
          className="date-dropdown-portal"
          style={{
            top: dateDropdownPos.top,
            left: dateDropdownPos.left,
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
                fetchExpenses();
              }}
            />
          </div>
        </div>
      )}
      {/* DOWNLOAD BUTTON */}
      {filteredExpenses.length > 0 && (
        <div className="download-fab" onClick={downloadExcel}>
          <span className="fab-tooltip">Download Excel</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </div>
      )}
    </div>
  );
  }

  export default ViewExpenses;
