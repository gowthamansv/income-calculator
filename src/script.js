document.addEventListener('DOMContentLoaded', () => {
    const totalIncomeElem = document.getElementById('totalIncome');
    const totalExpensesElem = document.getElementById('totalExpenses');
    const netBalanceElem = document.getElementById('netBalance');
    const descriptionElem = document.getElementById('description');
    const amountElem = document.getElementById('amount');
    const entryList = document.getElementById('entryList');
    const filterRadios = document.querySelectorAll('input[name="filter"]');
    const entryTypeRadios = document.querySelectorAll('input[name="entryType"]');
    const dateElem = document.getElementById('date');
    
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
  
    // Update totals (Income, Expenses, Net Balance)
    function updateTotals() {
      const income = entries.filter(e => e.type === 'income').reduce((acc, entry) => acc + entry.amount, 0);
      const expenses = entries.filter(e => e.type === 'expense').reduce((acc, entry) => acc + entry.amount, 0);
      const netBalance = income - expenses;
      
      totalIncomeElem.textContent = income;
      totalExpensesElem.textContent = expenses;
      netBalanceElem.textContent = netBalance;
    }
  
    // Render the entries based on the filter
    function renderEntries(filter = 'all') {
      entryList.innerHTML = '';
      const filteredEntries = filter === 'all' ? entries : entries.filter(entry => entry.type === filter);
      
      filteredEntries.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${entry.description}</td>
          <td>${entry.amount}</td>
          <td>${entry.type}</td>
          <td>${entry.date}</td>
          <td class="btn">
            <button class="bg-blue-400 text-white p-2 rounded w-full hover:bg-blue-200 hover:text-black mb-3" onclick="editEntry(${index})">Edit</button>
            <button class="bg-blue-400 text-white p-2 rounded w-full hover:bg-blue-200 hover:text-black" onclick="deleteEntry(${index})">Delete</button>
          </td>
        `;
        entryList.appendChild(row);
      });
    }
  
    // Add a new entry
    function addEntry() {
      const description = descriptionElem.value;
      const amount = parseFloat(amountElem.value);
      const date = dateElem.value;
      const entryType = document.querySelector('input[name="entryType"]:checked').value;
      
      if (!description || !amount || !date) {
        return alert('Please fill out all fields');
      }
      
      // Add new entry to the list
      entries.push({ description, amount, type: entryType , date });
      
      // Save to local storage
      localStorage.setItem('entries', JSON.stringify(entries));
      
      renderEntries();
      updateTotals();
      
      // Clear input fields
      descriptionElem.value = '';
      amountElem.value = '';
      dateElem.value = '';
    }
  
    // Delete an entry by index
    window.deleteEntry = function(index) {
      // Remove the selected entry from the list
      entries.splice(index, 1);
      
      // Update local storage and re-render the list
      localStorage.setItem('entries', JSON.stringify(entries));
      
      renderEntries();
      updateTotals();
    };
  
    // Edit an entry (pre-fill form fields)
    window.editEntry = function(index) {
      const entry = entries[index];
      descriptionElem.value = entry.description;
      amountElem.value = entry.amount;
      dateElem.value = entry.date;
      
      // Select the correct radio button based on the entry type
      document.querySelector(`input[name="entryType"][value="${entry.type}"]`).checked = true;
      
      // Remove the entry from the list to allow editing
      entries.splice(index, 1);
      localStorage.setItem('entries', JSON.stringify(entries));
      
      renderEntries();
      updateTotals();
    };
  
    // Add Entry button click handler
    document.getElementById('addEntry').addEventListener('click', addEntry);
  
    // Reset button click handler
    document.getElementById('reset').addEventListener('click', () => {
      descriptionElem.value = '';
      amountElem.value = '';
    });
  
    // Filter change handler
    filterRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        renderEntries(e.target.value);
      });
    });
  
    // Initial render of entries and totals
    renderEntries();
    updateTotals();
  });
  