// --- Theme toggle ---
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "light" ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    theme === "light" ? "Switch to dark mode" : "Switch to light mode"
  );
  localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "light" ? "dark" : "light");
});

const passwordInput = document.getElementById("password");
const toggleBtn = document.getElementById("toggleVisibility");
const checkBtn = document.getElementById("checkBtn");
const generateBtn = document.getElementById("generateBtn");
const kAnonBadge = document.getElementById("kAnonBadge");
const result = document.getElementById("result");
const breachBox = document.getElementById("breachBox");
const breachIcon = document.getElementById("breachIcon");
const breachTitle = document.getElementById("breachTitle");
const breachSubtitle = document.getElementById("breachSubtitle");
const strengthText = document.getElementById("strengthText");
const errorMsg = document.getElementById("errorMsg");
const livePreview = document.getElementById("livePreview");
const liveDot = document.getElementById("liveDot");
const liveLabel = document.getElementById("liveLabel");
const bars = [
  document.getElementById("bar1"),
  document.getElementById("bar2"),
  document.getElementById("bar3"),
  document.getElementById("bar4"),
];

// A short list of very common passwords for strength scoring.
// (Breach checking itself is handled separately by the API call below.)
const COMMON_PASSWORDS = [
  "password", "123456", "123456789", "qwerty", "abc123",
  "password1", "111111", "12345678", "letmein", "iloveyou",
];

toggleBtn.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  toggleBtn.textContent = isPassword ? "🙈" : "👁️";
  toggleBtn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
});

checkBtn.addEventListener("click", handleCheck);
passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleCheck();
});

// --- Live strength feedback as you type ---
passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;

  if (!password) {
    livePreview.classList.add("hidden");
    return;
  }

  const level = scoreStrength(password);
  renderLivePreview(level);
  livePreview.classList.remove("hidden");
});

function renderLivePreview(level) {
  const styles = getComputedStyle(document.documentElement);
  const danger = styles.getPropertyValue("--danger-text").trim();
  const warn = styles.getPropertyValue("--warn").trim();
  const safe = styles.getPropertyValue("--safe-text").trim();
  const colors = [danger, danger, warn, safe];
  const labels = ["Very weak", "Weak", "Okay", "Strong"];

  const color = level === 0 ? danger : colors[level - 1];
  const label = level === 0 ? "Very weak" : labels[level - 1];

  liveDot.style.background = color;
  liveLabel.textContent = label;
  liveLabel.style.color = color;
}

generateBtn.addEventListener("click", () => {
  const newPassword = generateStrongPassword();
  passwordInput.value = newPassword;
  passwordInput.type = "text";
  toggleBtn.textContent = "🙈";
  toggleBtn.setAttribute("aria-label", "Hide password");
  result.classList.add("hidden");
  errorMsg.classList.add("hidden");
  passwordInput.dispatchEvent(new Event("input"));
  showToast("Strong password generated — click Check to verify it");
});

function generateStrongPassword(length = 16) {
  const charset =
    "abcdefghijkmnopqrstuvwxyz" +
    "ABCDEFGHJKLMNPQRSTUVWXYZ" +
    "23456789" +
    "!@#$%^&*()-_=+";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (v) => charset[v % charset.length]).join("");
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 2500);
}

async function handleCheck() {
  const password = passwordInput.value;
  errorMsg.classList.add("hidden");

  if (!password) {
    errorMsg.textContent = "Please enter a password to check.";
    errorMsg.classList.remove("hidden");
    result.classList.add("hidden");
    return;
  }

  checkBtn.disabled = true;
  checkBtn.textContent = "Checking...";
  kAnonBadge.classList.remove("hidden");

  try {
    const breachCount = await checkBreach(password);
    const strength = scoreStrength(password);

    renderBreachResult(breachCount);
    renderStrength(strength);

    result.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    errorMsg.textContent = "Could not reach the breach check service. Please try again.";
    errorMsg.classList.remove("hidden");
    result.classList.add("hidden");
  } finally {
    checkBtn.disabled = false;
    checkBtn.textContent = "Check password";
    kAnonBadge.classList.add("hidden");
  }
}

// --- k-anonymity breach check using the Pwned Passwords API ---
async function checkBreach(password) {
  const hash = await sha1(password);
  const prefix = hash.slice(0, 5).toUpperCase();
  const suffix = hash.slice(5).toUpperCase();

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const text = await response.text();
  const lines = text.split("\n");

  for (const line of lines) {
    const [lineSuffix, count] = line.trim().split(":");
    if (lineSuffix === suffix) {
      return parseInt(count, 10);
    }
  }

  return 0;
}

async function sha1(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function renderBreachResult(count) {
  if (count > 0) {
    breachBox.className = "breach-box danger";
    breachIcon.textContent = "⚠️";
    breachTitle.textContent = `Found in ${count.toLocaleString()} breach${count === 1 ? "" : "es"}`;
    breachSubtitle.textContent = "Avoid using this password anywhere";
  } else {
    breachBox.className = "breach-box safe";
    breachIcon.textContent = "✅";
    breachTitle.textContent = "Not found in any known breach";
    breachSubtitle.textContent = "This password hasn't appeared in known leaks";
  }
}

// --- Client-side strength scoring ---
function scoreStrength(password) {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    score = 0;
  }

  // Normalize to a 0-4 scale for the 4 bars.
  return Math.min(4, Math.round((score / 5) * 4));
}

function renderStrength(level) {
  const styles = getComputedStyle(document.documentElement);
  const danger = styles.getPropertyValue("--danger-text").trim();
  const warn = styles.getPropertyValue("--warn").trim();
  const safe = styles.getPropertyValue("--safe-text").trim();
  const empty = styles.getPropertyValue("--bar-empty").trim();
  const colors = [danger, danger, warn, safe];

  const labels = [
    "Very weak — add length, symbols, and numbers",
    "Weak — add length and symbols",
    "Okay — consider adding more variety",
    "Strong password",
  ];

  bars.forEach((bar, i) => {
    bar.style.background = i < level ? colors[Math.max(level - 1, 0)] : empty;
  });

  strengthText.textContent = level === 0
    ? "Very weak — this is a commonly used password"
    : labels[level - 1];
}