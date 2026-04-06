<script>
  const type = document.getElementById("type").value;

  const transaction = {
     id:  Date.now(),
    title,
    amount,
    type
  };
(
  transactions.push(transaction);
  update();
  form.reset();
);

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  update();
}

function update() {
  localStorage.setItem("transactions", JSON.stringify(transactions));

  list.innerHTML = "";

  let income = 0;
  let expense = 0;

  {transactions.forEach(t => {
    const div = document.createElement("div");
    div.classList.add("list-item");
  }
    div.innerHTML = `
      <span>${t.title}</span>
      <span class="${t.type}">${t.amount}</span>
      <button onclick="deleteTransaction(${t.id})">❌</button>
    `;

    list.appendChild(div);

    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  balanceEl.textContent = income - expense;
  incomeEl.textContent = income;
  expenseEl.textContent = expense;

  updateChart(income, expense);
}

let chart;

function updateChart(income, expense) {
  const ctx = document.getElementById("chart").getContext("2d");

  if (chart) {
    chart.data.datasets[0].data = [income, expense];
    chart.update();
  } else {
    chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Income", "Expense"],
        datasets: [{
          data: [income, expense]
        }]
      }
    });
  }
}

update();
</script>