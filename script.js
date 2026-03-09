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

  // Update nav links (only highlight main nav items, not gallery subpages)
  const mainPages = ["home", "portfolio", "about", "services", "contact"];
  document.querySelectorAll("[data-page]").forEach((a) => {
    a.classList.toggle("active", a.dataset.page === page);
  });

  // If navigating to a gallery sub-page, keep "portfolio" nav link highlighted
  if (["gallery-social", "gallery-print", "gallery-banner"].includes(page)) {
    document.querySelectorAll("[data-page]").forEach((a) => {
      a.classList.toggle("active", a.dataset.page === "portfolio");
    });
  }

  currentPage = page;
  return false;
}

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

// ---- LIGHTBOX ----
let lightboxItems = []; // array of DOM nodes (img or placeholder div) cloned from grid
let lightboxIndex = 0;

/**
 * openLightbox(gridId, startIndex)
 * Collects all .gallery-item-inner children from the given grid
 * and opens the lightbox at startIndex.
 */
function openLightbox(gridId, startIndex) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  // Collect the inner content of every gallery item
  lightboxItems = Array.from(grid.querySelectorAll(".gallery-item-inner"));
  lightboxIndex = startIndex;

  renderLightboxSlide();
  document.getElementById("lightbox").classList.add("open");
  document.body.style.overflow = "hidden";

  // Keyboard support
  document.addEventListener("keydown", lightboxKeyHandler);
}

function renderLightboxSlide() {
  const wrap = document.getElementById("lightboxImgWrap");
  const counter = document.getElementById("lightboxCounter");

  wrap.style.opacity = "0";
  setTimeout(() => {
    wrap.innerHTML = "";
    const item = lightboxItems[lightboxIndex];
    // Clone the first child (img or placeholder div)
    const content = item.firstElementChild.cloneNode(true);
    wrap.appendChild(content);
    wrap.style.opacity = "1";
  }, 150);

  counter.textContent = `${lightboxIndex + 1} / ${lightboxItems.length}`;
}

function lightboxNav(direction) {
  lightboxIndex =
    (lightboxIndex + direction + lightboxItems.length) % lightboxItems.length;
  renderLightboxSlide();
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
  document.removeEventListener("keydown", lightboxKeyHandler);
  lightboxItems = [];
}

function closeLightboxOnBg(e) {
  // Only close if clicking the backdrop itself (not inner content)
  if (e.target === document.getElementById("lightbox")) {
    closeLightbox();
  }
}

function lightboxKeyHandler(e) {
  if (e.key === "ArrowRight" || e.key === "ArrowDown") lightboxNav(1);
  if (e.key === "ArrowLeft" || e.key === "ArrowUp") lightboxNav(-1);
  if (e.key === "Escape") closeLightbox();
}
