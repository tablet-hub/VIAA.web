// ==========================================
// VIAA WEBSITE - MOBILE NAVIGATION
// ==========================================

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");

  menuToggle.textContent = nav.classList.contains("active")
    ? "✕"
    : "☰";
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    menuToggle.textContent = "☰";
  });
});

// ==========================================
// COPYRIGHT YEAR
// ==========================================

document.getElementById("year").textContent =
  new Date().getFullYear();

// ==========================================
// REVEAL ANIMATIONS
// ==========================================

const sections = document.querySelectorAll(
  ".section, .alliance-section, .disclaimer"
);

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 }
);

sections.forEach(section => {
  section.classList.add("reveal");
  observer.observe(section);
});

// ==========================================
// SUPABASE DISCORD AUTHENTICATION
// ==========================================

const SUPABASE_URL =
  "https://foqxszfpvxzpangyfhml.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_k1mIKAWrLFkDUsiGFt8FAA_W9WyOkgl";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const loginButton = document.getElementById("discord-login");
const logoutButton = document.getElementById("discord-logout");
const accountPanel = document.getElementById("account-panel");
const accountName = document.getElementById("account-name");
const accountAvatar = document.getElementById("account-avatar");

// Discord Login
loginButton.addEventListener("click", async () => {
  loginButton.disabled = true;
  loginButton.textContent = "Connecting...";

  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: window.location.origin + window.location.pathname
    }
  });

  if (error) {
    alert("Discord login failed: " + error.message);
    loginButton.disabled = false;
    loginButton.textContent = "Login with Discord";
  }
});

// Display Account
function displayAccount(user) {
  const metadata = user.user_metadata || {};

  const username =
    metadata.global_name ||
    metadata.full_name ||
    metadata.name ||
    user.email ||
    "VIAA Member";

  const avatar =
    metadata.avatar_url ||
    metadata.picture ||
    "";

  accountName.textContent = username;

  if (avatar) {
    accountAvatar.src = avatar;
    accountAvatar.style.display = "inline-block";
  } else {
    accountAvatar.style.display = "none";
  }

  loginButton.hidden = true;
  accountPanel.hidden = false;
}

// Display Login Button
function displayLogin() {
  loginButton.hidden = false;
  loginButton.disabled = false;
  loginButton.textContent = "Login with Discord";

  accountPanel.hidden = true;
}

// Check Existing Session
async function checkSession() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    console.error("Session error:", error.message);
    displayLogin();
    return;
  }

  if (data.session) {
    displayAccount(data.session.user);
  } else {
    displayLogin();
  }
}

// Logout
logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Logout failed: " + error.message);
  }

  logoutButton.disabled = false;
  displayLogin();
});

// Listen for Authentication Changes
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (session) {
    displayAccount(session.user);
  } else {
    displayLogin();
  }
});

// Initialize Authentication
checkSession();