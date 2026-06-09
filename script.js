const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");
const typedText = document.querySelector("#typed-text");
const revealElements = document.querySelectorAll(".reveal");
const skillCards = document.querySelectorAll(".skill-card");
const backToTop = document.querySelector(".back-to-top");
const contactForm = document.querySelector(".contact-form");
const formMessage = document.querySelector(".form-message");

const roles = [
    "Diploma Computer Engineering Student",
    "Future Software Engineer",
    "Python Programmer",
    "AI & Machine Learning Learner"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeHeroText() {
    const currentRole = roles[roleIndex];
    typedText.textContent = currentRole.slice(0, charIndex);

    if (!deleting && charIndex < currentRole.length) {
        charIndex += 1;
        setTimeout(typeHeroText, 75);
        return;
    }

    if (!deleting && charIndex === currentRole.length) {
        deleting = true;
        setTimeout(typeHeroText, 1400);
        return;
    }

    if (deleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(typeHeroText, 38);
        return;
    }

    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeHeroText, 250);
}

function setTheme(mode) {
    body.classList.toggle("dark", mode === "dark");
    body.classList.toggle("light", mode === "light");
    themeToggle.textContent = mode === "dark" ? "Light" : "Dark";
    localStorage.setItem("portfolio-theme", mode);
}

function updateActiveNavigation() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute("id");

        if (scrollPosition >= top && scrollPosition < top + height) {
            navItems.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
        }
    });

    backToTop.classList.toggle("visible", window.scrollY > 500);
}

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");

                if (entry.target.classList.contains("skill-card")) {
                    const level = entry.target.dataset.level;
                    entry.target.querySelector(".progress span").style.width = `${level}%`;
                }
            }
        });
    },
    { threshold: 0.16 }
);

revealElements.forEach((element) => revealObserver.observe(element));
skillCards.forEach((card) => revealObserver.observe(card));

themeToggle.addEventListener("click", () => {
    const nextTheme = body.classList.contains("dark") ? "light" : "dark";
    setTheme(nextTheme);
});

navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
    });
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const subject = formData.get("subject").trim();
    const message = formData.get("message").trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !subject || !message) {
        formMessage.textContent = "Please fill in all fields.";
        formMessage.style.color = "#e04f5f";
        return;
    }

    if (!emailPattern.test(email)) {
        formMessage.textContent = "Please enter a valid email address.";
        formMessage.style.color = "#e04f5f";
        return;
    }

    formMessage.textContent = "Thank you! Your message has been validated successfully.";
    formMessage.style.color = "var(--secondary)";
    contactForm.reset();
});

window.addEventListener("scroll", updateActiveNavigation);

setTheme("dark");
typeHeroText();
updateActiveNavigation();
