let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let currentFilter = 'all';
let searchText = '';

if (localStorage.getItem("theme") === "dark") { document.body.classList.add("dark"); }

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

const form = document.getElementById("form");
const list = document.getElementById("list");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const searchInput = document.getElementById("search");

searchInput.addEventListener("input", () => { searchText = searchInput.value.toLowerCase(); update(); });

form.addEventListener("submit", e => {
  e.preventDefault();
  const transaction = { id: Date.now(), title: title.value, amount: +amount.value, date: date.value, type: type.value };
  transactions.push(transaction);
  update();
  form.reset();
});

function deleteTransaction(id) { transactions = transactions.filter(t => t.id !== id); update(); }
function setFilter(type, e) { currentFilter = type; document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active')); e.target.classList.add('active'); update(); }

function update() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  list.innerHTML = "";

  let income = 0, expense = 0;
  transactions.filter(t => (currentFilter==='all'||t.type===currentFilter) && t.title.toLowerCase().includes(searchText))
              .forEach(t => {
    const div = document.createElement("div");
    div.classList.add("list-item");
    div.innerHTML = `<span>${t.title} (${t.date})</span><span class="${t.type}">${t.amount}</span><button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button>`;
    list.appendChild(div);
    t.type==='income'?income+=t.amount:expense+=t.amount;
  });

  balanceEl.textContent = income-expense;
  incomeEl.textContent = income;
  expenseEl.textContent = expense;
  updateChart(income, expense);
}

let chart;
function updateChart(income, expense) {
  const ctx = document.getElementById("chart").getContext("2d");
  if(chart){ chart.data.datasets[0].data=[income,expense]; chart.update(); }
  else { chart=new Chart(ctx,{ type:"doughnut", data:{ labels:["Income","Expense"], datasets:[{ data:[income,expense], backgroundColor:["#C5EDAC","#86efac"] }] } }); }
}

update();