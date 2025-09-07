// script.js

// initial quotes array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Success" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

/**
 * showRandomQuote
 * Chooses a random quote and renders it into #quoteDisplay using innerHTML.
 */
function showRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  if (!display) return;

  if (quotes.length === 0) {
    display.innerHTML = "<p>No quotes available.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  display.innerHTML = `
    <blockquote style="font-style:italic; margin:0 0.5rem 0.5rem 0; padding-left:1rem; border-left:4px solid #ccc;">
      ${escapeHtml(randomQuote.text)}
    </blockquote>
    <div style="text-align:right; font-weight:600; color:#555; margin-top:0.25rem;">
      — ${escapeHtml(randomQuote.category)}
    </div>
  `;
}

/**
 * addQuote
 * Reads inputs, validates, pushes into the quotes array and updates the DOM.
 */
function addQuote() {
  const textEl = document.getElementById("newQuoteText");
  const catEl = document.getElementById("newQuoteCategory");
  if (!textEl || !catEl) return;

  const quoteText = textEl.value.trim();
  const quoteCategory = catEl.value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });

  const display = document.getElementById("quoteDisplay");
  if (display) {
    display.innerHTML = `<p style="color:green; margin:0;">New quote added: "${escapeHtml(quoteText)}" — [${escapeHtml(quoteCategory)}]</p>`;
  }

  textEl.value = "";
  catEl.value = "";
}

/**
 * createAddQuoteForm
 * Dynamically generates the form (inputs + button) to add quotes.
 */
function createAddQuoteForm() {
  const container = document.createElement("div");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.id = "addQuoteBtn";
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(addButton);

  document.body.appendChild(container);
}

/**
 * Escape HTML to avoid injection when using innerHTML
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Wire up event listeners on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const newQuoteBtn = document.getElementById("newQuote");
  if (newQuoteBtn) newQuoteBtn.addEventListener("click", showRandomQuote);

  // dynamically create the Add Quote form
  createAddQuoteForm();

  // show a random quote on load
  showRandomQuote();
});
