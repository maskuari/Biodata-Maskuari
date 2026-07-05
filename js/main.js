const pages = document.querySelectorAll(".page");
const pageButtons = document.querySelectorAll("[data-page-target]");
const navPills = document.querySelectorAll(".nav-pill");
const skillBars = document.querySelectorAll(".skill-bar");
const copyEmailButton = document.querySelector("[data-copy-email]");
const modal = document.querySelector("[data-modal]");
const modalTitle = document.querySelector("#modal-title");
const modalBody = document.querySelector(".modal-card [data-modal-body]");
const modalClose = document.querySelector("[data-modal-close]");
const portraitPanel = document.querySelector(".portrait-panel");
const themeButtons = document.querySelectorAll("[data-theme-toggle]");
const portfolioToggle = document.querySelector("[data-portfolio-toggle]");
const portfolioPanel = document.querySelector("[data-portfolio-panel]");

function refreshIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function getSavedTheme() {
    try {
        return localStorage.getItem("maskuari-theme");
    } catch {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem("maskuari-theme", theme);
    } catch {
        return;
    }
}

function applyTheme(theme) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;

    themeButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(nextTheme === "dark"));
        button.setAttribute("aria-label", nextTheme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap");
    });
}

const preferredTheme = getSavedTheme()
    || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

applyTheme(preferredTheme);

function setActiveButtons(pageName) {
    pageButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.pageTarget === pageName);
    });
}

function pauseVideos() {
    document.querySelectorAll("video").forEach((video) => video.pause());
}

function animateSkills() {
    skillBars.forEach((bar) => {
        const fill = bar.querySelector("b");
        fill.style.width = `${bar.dataset.skill || 0}%`;
    });
}

function resetSkills() {
    skillBars.forEach((bar) => {
        bar.querySelector("b").style.width = "0";
    });
}

function showPage(pageName) {
    const target = document.querySelector(`.page[data-page="${pageName}"]`);
    if (!target || target.classList.contains("active")) return;

    pauseVideos();
    pages.forEach((page) => page.classList.remove("active"));
    target.classList.add("active");
    target.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveButtons(pageName);

    if (pageName === "skills") {
        window.setTimeout(animateSkills, 120);
    } else {
        resetSkills();
    }
}

function openModal(title, body) {
    if (!modal || !modalTitle || !modalBody) return;

    modalTitle.textContent = title;
    modalBody.textContent = body;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    refreshIcons();
}

function closeModal() {
    if (!modal) return;

    modal.hidden = true;
    document.body.classList.remove("modal-open");
}

async function copyEmail() {
    const email = copyEmailButton.dataset.copyEmail;
    const original = copyEmailButton.innerHTML;

    try {
        await navigator.clipboard.writeText(email);
        copyEmailButton.innerHTML = '<i data-lucide="check"></i>Email tersalin';
        refreshIcons();
        window.setTimeout(() => {
            copyEmailButton.innerHTML = original;
            refreshIcons();
        }, 1500);
    } catch {
        window.location.href = `mailto:${email}`;
    }
}

pageButtons.forEach((button) => {
    button.addEventListener("click", () => showPage(button.dataset.pageTarget));
});

if (copyEmailButton) {
    copyEmailButton.addEventListener("click", copyEmail);
}

if (portraitPanel) {
    ["pointerenter", "focusin"].forEach((eventName) => {
        portraitPanel.addEventListener(eventName, () => portraitPanel.classList.add("is-hovered"));
    });

    ["pointerleave", "focusout"].forEach((eventName) => {
        portraitPanel.addEventListener(eventName, () => portraitPanel.classList.remove("is-hovered"));
    });
}

themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        saveTheme(nextTheme);
    });
});

if (portfolioToggle && portfolioPanel) {
    portfolioToggle.addEventListener("click", () => {
        const isOpen = portfolioPanel.classList.toggle("is-open");
        portfolioToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

document.querySelectorAll("[data-modal-title][data-modal-body]").forEach((card) => {
    card.addEventListener("click", () => {
        openModal(card.dataset.modalTitle, card.dataset.modalBody);
    });
});

if (modalClose) {
    modalClose.addEventListener("click", closeModal);
}

if (modal) {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
        return;
    }

    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const order = Array.from(navPills).map((button) => button.dataset.pageTarget);
    if (!order.length) return;

    const active = document.querySelector(".page.active")?.dataset.page || "home";
    const index = order.indexOf(active);

    if (event.key === "ArrowRight") {
        showPage(order[(index + 1) % order.length]);
    }

    if (event.key === "ArrowLeft") {
        showPage(order[(index - 1 + order.length) % order.length]);
    }
});

window.addEventListener("load", () => {
    refreshIcons();
    setActiveButtons("home");
});

refreshIcons();
