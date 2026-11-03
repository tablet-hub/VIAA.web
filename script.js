
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

// Mobile navigation
menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");

  menuToggle.textContent = nav.classList.contains("active")
    ? "✕"
    : "☰";
});

// Close navigation after clicking a link
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    menuToggle.textContent = "☰";
  });
});

// Automatic copyright year
document.getElementById("year").textContent =
  new Date().getFullYear();

// Reveal sections as they enter the screen
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
  {
    threshold: 0.12
  }
);

sections.forEach(section => {
  section.classList.add("reveal");
  observer.observe(section);
});
