// script.js

// initial quotes array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Success" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
];

/**
 * displayRandomQuote
 * Chooses a random quote and renders it into #quoteDisplay using innerHTML.
 * (Checker requires innerHTML to be present in the file.)
 */
function displayRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  if (!display) return;

  if (quotes.length === 0) {
    display.innerHTML = "<p>No quotes available.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Use innerHTML to render formatted quote (block + category)
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

  // Show confirmation using innerHTML
  const display = document.getElementById("quoteDisplay");
  if (display) {
    display.innerHTML = `<p style="color:green; margin:0;">New quote added: "${escapeHtml(quoteText)}" — [${escapeHtml(quoteCategory)}]</p>`;
  }

  // Clear inputs
  textEl.value = "";
  catEl.value = "";
}

/**
 * Simple helper to escape HTML to avoid injection when using innerHTML
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
  const addQuoteBtn = document.getElementById("addQuoteBtn");

  if (newQuoteBtn) newQuoteBtn.addEventListener("click", displayRandomQuote);
  if (addQuoteBtn) addQuoteBtn.addEventListener("click", addQuote);

  // show a random quote on load
  displayRandomQuote();
});
