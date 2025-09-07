// ===== Dynamic Quote Generator =====

// Default quotes if none in localStorage
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", category: "Strength" }
];

// ===== Save & Load Quotes =====
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ===== Show Random Quote =====
function showRandomQuote() {
  const category = localStorage.getItem("selectedCategory") || "all";
  let filteredQuotes = category === "all" ? quotes : quotes.filter(q => q.category === category);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  document.getElementById("quoteDisplay").textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
}

// ===== Add Quote =====
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  textInput.value = "";
  categoryInput.value = "";
  alert("Quote added!");
}

// ===== Populate Categories =====
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = categories.map(cat =>
    `<option value="${cat}" ${cat === localStorage.getItem("selectedCategory") ? "selected" : ""}>${cat}</option>`
  ).join("");
}

// ===== Filter Quotes =====
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

// ===== Export Quotes =====
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ===== Import Quotes =====
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ===== Fetch Quotes From Server =====
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  const serverData = await response.json();

  return serverData.map(item => ({
    text: item.title,
    category: "Server"
  }));
}

// ===== Sync Quotes (GET + POST) =====
async function syncQuotes() {
  const status = document.getElementById("syncStatus");
  status.textContent = "Syncing with server...";

  try {
    // Step 1: Fetch from server
    const serverQuotes = await fetchQuotesFromServer();

    // Step 2: Post local quotes to server (mock)
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quotes)
    });

    // Step 3: Merge server data (server wins)
    quotes = [...quotes, ...serverQuotes];
    saveQuotes();
    populateCategories();

    status.textContent = "Sync complete. Local quotes sent, server quotes merged.";
  } catch (error) {
    console.error("Sync failed:", error);
    status.textContent = "Sync failed. Please try again.";
  }
}

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  showRandomQuote();

  // 🔄 Periodically sync with server every 30 seconds
  setInterval(syncQuotes, 30000);
});
