document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
navLinks.addEventListener("click", e => { if (e.target.closest("a")) navLinks.classList.remove("open"); });

// Highlight the menu item for the section currently on screen
const ids = ["home", "services", "about", "industries", "process", "contact"];
const links = {};
document.querySelectorAll("[data-nav]").forEach(a => links[a.dataset.nav] = a);
function setActive() {
  let current = ids[0];
  const line = window.scrollY + 120;
  ids.forEach(id => { if (document.getElementById(id).offsetTop <= line) current = id; });
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) current = "contact";
  Object.keys(links).forEach(id => {
    links[id].classList.toggle("active", id === current);
    if (id === current) links[id].setAttribute("aria-current", "page"); else links[id].removeAttribute("aria-current");
  });
}
window.addEventListener("scroll", setActive, { passive: true });
window.addEventListener("resize", setActive);
setActive();

// Contact form -> Google Sheet (via Google Apps Script Web App)
const form = document.getElementById("contactForm");

const submitBtn = form.querySelector("button[type=submit]");
const cfg = window.LOGICSETU_CONFIG || {};

let toastTimer;
function showToast(msg, type) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.setAttribute("role", "status");
    t.setAttribute("aria-live", "polite");
    document.body.appendChild(t);
  }
  t.innerHTML = '<span class="toast-icon"></span><span class="toast-msg"></span><button type="button" class="toast-close" aria-label="Close">&times;</button>';
  t.querySelector(".toast-msg").textContent = msg;
  t.querySelector(".toast-close").addEventListener("click", () => t.classList.remove("show"));
  t.className = "toast-" + type;
  void t.offsetWidth;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 7000);
}

function mailtoFallback(f) {
  const interest = f.get("interest") || "";
  const subject = encodeURIComponent("LogicSetu website enquiry - " + interest);
  const body = encodeURIComponent(
    "Hello LogicSetu,\n\n" +
    "My name is " + (f.get("name") || "") + ".\n" +
    "My email is " + (f.get("email") || "") + ".\n" +
    "Company: " + (f.get("company") || "(Not provided)") + "\n" +
    "Area of interest: " + interest + "\n\n" +
    "Details:\n" + (f.get("message") || "(No additional details provided.)") + "\n\n" +
    "Sent from the LogicSetu website."
  );
  window.location.href = "mailto:" + cfg.FALLBACK_EMAIL + "?subject=" + subject + "&body=" + body;
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }

  const f = new FormData(form);
  if (f.get("website")) return; // honeypot: bots fill this, humans never see it

  if (!cfg.FORM_ENDPOINT) { mailtoFallback(f); return; }

  const label = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  

  try {
    await fetch(cfg.FORM_ENDPOINT, {
      method: "POST",
      mode: "no-cors", // Apps Script does not send CORS headers; the request still goes through
      body: new URLSearchParams({
        name: f.get("name") || "",
        email: f.get("email") || "",
        company: f.get("company") || "",
        interest: f.get("interest") || "",
        message: f.get("message") || ""
      })
    });
    form.reset();
    showToast("Thank you! Your enquiry has been sent. We will get back to you soon.", "ok");
  } catch (err) {
    showToast("Sorry, something went wrong. Please try again in a moment.", "err");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = label;
  }
});
