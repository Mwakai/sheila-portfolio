// ---- CURSOR ----
const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");
let mouseX = 0,
  mouseY = 0,
  ringX = 0,
  ringY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + "px";
  dot.style.top = mouseY + "px";
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + "px";
  ring.style.top = ringY + "px";
  requestAnimationFrame(animateRing);
}
animateRing();

// ---- NAVIGATION ----
let currentPage = "home";

function navigate(page) {
  if (page === currentPage) return;

  // Hide current
  const current = document.getElementById("page-" + currentPage);
  if (current) {
    current.classList.remove("active");
  }

  // Show new
  const next = document.getElementById("page-" + page);
  if (next) {
    next.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Update nav links
  document.querySelectorAll("[data-page]").forEach((a) => {
    a.classList.toggle("active", a.dataset.page === page);
  });

  currentPage = page;
  return false;
}

// Intercept all onclick that call navigate
document.addEventListener("click", (e) => {
  if (
    e.target.closest('a[href="#"]') ||
    e.target.closest('button[type="button"]')
  ) {
    // Let onclick handle it
  }
});

// ---- MOBILE NAV ----
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

hamburger.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
  const spans = hamburger.querySelectorAll("span");
  if (mobileNav.classList.contains("open")) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
  } else {
    spans.forEach((s) => {
      s.style.transform = "";
      s.style.opacity = "";
    });
  }
});

function closeMobile() {
  mobileNav.classList.remove("open");
  hamburger.querySelectorAll("span").forEach((s) => {
    s.style.transform = "";
    s.style.opacity = "";
  });
}

// ---- NAV SCROLL EFFECT ----
window.addEventListener("scroll", () => {
  document
    .getElementById("mainNav")
    .classList.toggle("scrolled", window.scrollY > 30);
});

// ---- PORTFOLIO FILTER ----
function filterWork(btn, tag) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".portfolio-item").forEach((item) => {
    const tags = item.dataset.tags || "";
    const show = tag === "all" || tags.includes(tag);
    item.style.display = show ? "" : "none";
    item.style.opacity = show ? "1" : "0";
    item.style.transform = show ? "" : "scale(0.95)";
  });
  // Fix featured span after filtering
  const featured = document.querySelector(".portfolio-item.featured");
  if (featured && featured.style.display !== "none") {
    featured.style.gridColumn = "span 2";
  }
}

// ---- FORM SUBMIT ----
function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  form.style.display = "none";
  success.classList.add("show");
}
