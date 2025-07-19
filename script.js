// script.js
const dummyStocks = {
  AAPL: { name: "Apple Inc.", price: 172.26, change: +1.56, volume: 34500000 },
  MSFT: { name: "Microsoft Corp.", price: 310.12, change: -0.23, volume: 21000000 },
  TSLA: { name: "Tesla Inc.", price: 695.00, change: +12.45, volume: 42000000 },
  AMZN: { name: "Amazon.com Inc.", price: 125.75, change: -1.12, volume: 18000000 },
  GOOGL: { name: "Alphabet Inc.", price: 134.45, change: +2.33, volume: 15000000 },
};

const sqlInput = document.getElementById("sqlInput");
const queryBtn = document.getElementById("queryBtn");
const result = document.getElementById("result");

// Parse & execute very simple queries of form:
// SELECT * FROM stocks WHERE <field> <op> <value>
queryBtn.addEventListener("click", () => {
  const query = sqlInput.value.trim();
  if (!query) {
    result.innerHTML = "⚠️ Enter a SQL query.";
    return;
  }

  const regex = /^SELECT \* FROM stocks WHERE (\w+) *(=|>|<|>=|<=|!=) *(['"]?)(.+?)\3$/i;
  const match = query.match(regex);
  if (!match) {
    result.innerHTML = `❌ Invalid query format.<br>
    Example: SELECT * FROM stocks WHERE price > 150`;
    return;
  }

  let [, field, operator, , valueRaw] = match;
  field = field.toLowerCase();

  const validFields = ["name", "price", "change", "volume"];
  if (!validFields.includes(field)) {
    result.innerHTML = `❌ Invalid field: <b>${field}</b>. Valid fields: ${validFields.join(", ")}`;
    return;
  }

  let value = valueRaw;
  if (["price", "change", "volume"].includes(field)) {
    value = Number(valueRaw);
    if (isNaN(value)) {
      result.innerHTML = `❌ Invalid numeric value: <b>${valueRaw}</b>`;
      return;
    }
  } else {
    value = valueRaw.toLowerCase();
  }

  const filtered = Object.entries(dummyStocks).filter(([ticker, stock]) => {
    let stockVal = stock[field];
    if (typeof stockVal === "string") stockVal = stockVal.toLowerCase();

    switch (operator) {
      case "=": return stockVal == value;
      case "!=": return stockVal != value;
      case ">": return stockVal > value;
      case "<": return stockVal < value;
      case ">=": return stockVal >= value;
      case "<=": return stockVal <= value;
      default: return false;
    }
  });

  if (filtered.length === 0) {
    result.innerHTML = "ℹ️ No results matched your query.";
    return;
  }

  result.innerHTML = filtered.map(([ticker, stock]) => `
    <strong>${ticker} - ${stock.name}</strong><br>
    Price: $${stock.price.toFixed(2)}<br>
    Change: <span style="color:${stock.change >= 0 ? 'lime' : 'red'}">${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}</span><br>
    Volume: ${stock.volume.toLocaleString()}
  `).join("<hr>");
});
