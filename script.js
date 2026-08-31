

/* =========================================================
   MOBILE MENU TOGGLE - FIXED
========================================================= */
const menuToggle = document.querySelector(".menu-toggle");
const navCenter = document.querySelector(".nav-center");
const navMenu = document.querySelector(".nav-menu");
const mobileMenuBackdrop = document.querySelector(".mobile-menu-backdrop");

function openMobileMenu() {
    navCenter.classList.add("active");
    navMenu.classList.add("active");
    menuToggle.classList.add("active");
    mobileMenuBackdrop.classList.add("active");
    document.body.classList.add("mobile-menu-open");
    menuToggle.textContent = "×";
    menuToggle.setAttribute("aria-label", "Close menu");
    menuToggle.setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
    navCenter.classList.remove("active");
    navMenu.classList.remove("active");
    menuToggle.classList.remove("active");
    mobileMenuBackdrop.classList.remove("active");
    document.body.classList.remove("mobile-menu-open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-label", "Open menu");
    menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && navCenter && navMenu && mobileMenuBackdrop) {
    menuToggle.setAttribute("type", "button");
    menuToggle.setAttribute("aria-label", "Open menu");
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (navCenter.classList.contains("active")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileMenuBackdrop.addEventListener("click", closeMobileMenu);

    document.querySelectorAll(".nav-menu a").forEach(link => {
        link.addEventListener("click", () => {
            if (
                window.innerWidth <= 1000 &&
                link.classList.contains("nav-company-trigger")
            ) {
                return;
            }

            closeMobileMenu();
        });
    });

    window.addEventListener("keydown", e => {
        if (e.key === "Escape") closeMobileMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1000) closeMobileMenu();
    });
}

/* =========================================================
   1) GLOBAL SCROLL REVEAL ANIMATION - FINAL POLISH
   Smoothly reveals text/content upward across all pages.
========================================================= */
const revealSelectors = [
    ".zero-content > *",
    "#home .hero-content .section-kicker",
    "#home .hero-content h1",
    "#home .hero-content p",
    "#home .story-bridge",
    "#home .hero-visual",
    "#group .group-kicker",
    "#group h2",
    "#group .group-subtitle",
    "#group .group-card",
    ".history-left span",
    ".history-left h2",
    ".history-left p",
    ".history-left .story-bridge",
    ".history-row",
    ".strength-strip-item",
    ".product-kicker",
    ".product-section h2",
    ".product-intro",
    ".category-card",
    ".product-card",
    ".product-note",
    ".info-content > .section-kicker",
    ".info-content > h2",
    ".info-subtitle",
    ".equipment-capacity",
    ".equipment-layout-c > *",
    ".equipment-machine-grid > *",
    ".process-section",
    ".process-head > *",
    ".process-slide.active .capability-card",
    ".capability-card",
    ".quality-hero-copy > *",
    ".quality-overview-item",
    ".quality-panel",
    ".process-step",
    ".quality-highlights > div",
    "#contact .contact-column",
    "#contact .footer-copy"
];

const revealItems = Array.from(new Set(document.querySelectorAll(revealSelectors.join(","))));
const cardRevealClasses = [
    "group-card",
    "company-card",
    "category-card",
    "product-card",
    "capability-card",
    "quality-overview-item",
    "process-step",
    "contact-column",
    "equipment-item"
];

function getRevealGroupKey(item) {
    const group = item.closest(".group-network, .category-grid, .capabilities-grid, .equipment-machine-grid, .quality-overview, .process-flow, .quality-highlights, .contact-inner, .process-slide, .equipment-layout-c");
    if (!group) return null;
    return group;
}

revealItems.forEach(item => {
    item.classList.add("scroll-reveal");

    if (item.classList.contains("hero-visual")) {
        item.classList.add("reveal-from-right");
    }

    if (cardRevealClasses.some(className => item.classList.contains(className))) {
        item.classList.add("reveal-soft");
        item.dataset.revealGroup = "cards";
    }

    const group = getRevealGroupKey(item) || item.parentElement;
    const siblings = group ? Array.from(group.children).filter(child => revealItems.includes(child) || child.querySelector?.(".scroll-reveal")) : [];
    let localIndex = siblings.indexOf(item);

    if (localIndex < 0 && group) {
        localIndex = Array.from(group.querySelectorAll(":scope > .scroll-reveal, :scope > * > .scroll-reveal")).indexOf(item);
    }

    localIndex = Math.max(0, localIndex);
    const delay = Math.min(localIndex * 92, 420);
    item.style.setProperty("--reveal-delay", `${delay}ms`);
});

function revealNow(target) {
    if (!target) return;
    target.classList.add("reveal-visible");
}

function resetReveal(target) {
    if (!target) return;
    target.classList.remove("reveal-visible");
}

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            revealNow(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -7% 0px"
    });

    revealItems.forEach(item => revealObserver.observe(item));
} else {
    revealItems.forEach(revealNow);
}

function revealActiveSlideContent() {
    const activeSlide = document.querySelectorAll("#homeSlider .page")[currentSlide];
    if (!activeSlide) return;

    activeSlide.querySelectorAll(".scroll-reveal").forEach((item, index) => {
        resetReveal(item);
        const delay = Math.min(index * 58, 360);
        setTimeout(() => revealNow(item), delay);
    });
}

/* =========================================================
   2) HOME ABOUT SECTION (single slide)
========================================================= */
const pages = document.getElementById("pages");
let currentSlide = 0;
function goToSlide() {
    if (pages) pages.style.transform = "translateX(0)";
}
requestAnimationFrame(() => {
    if (typeof revealActiveSlideContent === "function") revealActiveSlideContent();
});

/* =========================================================
   3) NAVBAR ALWAYS VISIBLE
========================================================= */
const navbar = document.querySelector(".navbar");
if (navbar) navbar.style.top = "0";

if (navbar && document.body.classList.contains("home-page")) {
    const updateHomeNavbar = () => {
        navbar.classList.toggle("is-scrolled", window.scrollY > 20);
    };

    updateHomeNavbar();
    window.addEventListener("scroll", updateHomeNavbar, { passive: true });
}

/* =========================================================
   ACTIVE NAV PAGE
   Automatically highlights the current page
========================================================= */

const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".nav-menu > li > a").forEach(link => {
    const linkPage = link.getAttribute("href")?.split("#")[0];

    if (linkPage === currentPage) {
        link.classList.add("active-page");
    }
});

/* =========================================================
   4) COMPANY DROPDOWN
========================================================= */
const companyNav = document.querySelector(".nav-company");
const companyTrigger = document.querySelector(".nav-company-trigger");
if (companyNav && companyTrigger) {
    companyTrigger.addEventListener("click", (event) => {
        if (window.innerWidth <= 1000) {
            event.preventDefault();
            companyNav.classList.toggle("open");
        }
    });
}

/* =========================================================
   5) MANUFACTURING PROCESS SLIDER
========================================================= */
let processCurrentSlide = 0;
const processSlides = document.querySelectorAll(".process-slide");
const processDots = document.querySelectorAll(".process-dot");

function showProcessSlide(index) {
    if (!processSlides.length) return;

    if (index < 0) index = processSlides.length - 1;
    if (index >= processSlides.length) index = 0;

    processCurrentSlide = index;

    processSlides.forEach((slide, slideIndex) => {
        slide.classList.toggle("active", slideIndex === processCurrentSlide);
    });

    processDots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === processCurrentSlide);
    });

    const activeProcessSlide = processSlides[processCurrentSlide];
    if (activeProcessSlide) {
        activeProcessSlide.querySelectorAll(".scroll-reveal").forEach((item, itemIndex) => {
            resetReveal(item);
            setTimeout(() => revealNow(item), itemIndex * 80);
        });
    }
}

function changeProcessSlide(direction) {
    showProcessSlide(processCurrentSlide + direction);
}

showProcessSlide(0);

/* =========================================================
   6) CAPABILITY HOVER VIDEO
========================================================= */
document.querySelectorAll(".capability-card").forEach(card => {
    const video = card.querySelector("video");
    const source = video ? video.querySelector("source") : null;

    card.addEventListener("mouseenter", () => {
        if (!video || !source || !source.getAttribute("src")) return;

        video.currentTime = 0;
        video.play();
    });

    card.addEventListener("mouseleave", () => {
        if (!video) return;

        video.pause();
        video.currentTime = 0;
    });
});

/* =========================================================
   6) EQUIPMENT MACHINE POPUP
========================================================= */
const machineData = {
    forming: {
        title: "Forming Machines",
        subtitle: "Forming machines list.",
        machines: [ "8B 4 sets", "11B 14 sets", "14B 14 sets", "19B 9 sets", "24B 4 sets", "30B 1 set", "33B 1 set", "41B 1 set" ]

    },
    tapping: {
        title: "Tapping Machines",
        subtitle: "Tapping machines list.",
        machines: [ "8B 1 Set", "11B 2 Sets", "13B 37 Sets", "14B 12 Sets", "19B 25 Sets", "24B 5 Sets", "32B 1 Set", "33B 1 Set", "38B 1 Set", "CF68B 1 Set" ]
    },
    assembling: {
        title: "Assembling Machines",
        subtitle: "Assembling machines list.",
        machines: [ "8B 6 Sets", "11B 8 Sets", "14B 8 Sets", "19B 7 Sets", "24B 1 Set", "33B 1 Set", "JH14B 2 Sets" ]
    }
};

function openMachinePopup(type) {
    const data = machineData[type];
    const modal = document.getElementById("machineModal");
    const title = document.getElementById("machineModalTitle");
    const subtitle = document.getElementById("machineModalSubtitle");
    const list = document.getElementById("machineList");

    if (!data || !modal || !title || !subtitle || !list) return;

    title.textContent = data.title;
    subtitle.textContent = data.subtitle;
    list.innerHTML = "";

    data.machines.forEach(machine => {
        const item = document.createElement("div");
        item.className = "machine-list-item";
        item.textContent = machine;
        list.appendChild(item);
    });

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeMachinePopup() {
    const modal = document.getElementById("machineModal");
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

window.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMachinePopup();
});


/* =========================================================
   HERO PREMIUM ANIMATION TRIGGER
   Adds .hero-ready only when Page 1.1 enters the viewport,
   so the animation is visible after scrolling down from Page 0.
========================================================= */
(function(){
    const homeHero = document.getElementById('home');
    if (!homeHero) return;

    const playHero = () => {
        homeHero.classList.remove('hero-ready');
        void homeHero.offsetWidth; // restart CSS animation reliably
        homeHero.classList.add('hero-ready');
    };

    if ('IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    playHero();
                    heroObserver.unobserve(homeHero);
                }
            });
        }, { threshold: 0.42 });

        heroObserver.observe(homeHero);
    } else {
        window.addEventListener('load', playHero, { once:true });
    }
})();


const languageOptions = {
    th: {
        label: "TH"
    },

    en: {
        label: "EN"
    },
    "zh-TW": {
        label: "中文"
    }
};

const languageDropdown = document.querySelector(".language-dropdown");
const languageCurrent = document.querySelector(".language-current");
const languageLinks = document.querySelectorAll(".language-menu a");

let activeLanguage = localStorage.getItem("thailockLanguage") || "en";

function updateLanguageButton(lang) {
    const option = languageOptions[lang] || languageOptions.en;
    const label = languageCurrent?.querySelector(".current-language-label");

    activeLanguage = lang in languageOptions ? lang : "en";

    if (label) {
        label.textContent = option.label;
    }
}

const currentLanguageLabel =
    languageCurrent?.querySelector(".current-language-label");

if (currentLanguageLabel) {
    const languageLabelObserver = new MutationObserver(() => {
        const option = languageOptions[activeLanguage] || languageOptions.en;

        if (currentLanguageLabel.textContent !== option.label) {
            currentLanguageLabel.textContent = option.label;
        }
    });

    languageLabelObserver.observe(currentLanguageLabel, {
        childList: true,
        characterData: true,
        subtree: true
    });
}

function changeGoogleTranslate(lang, attempt = 0) {
    const select = document.querySelector(".goog-te-combo");

    if (!select) {
        if (attempt < 20) {
            setTimeout(() => changeGoogleTranslate(lang, attempt + 1), 300);
        }
        return;
    }

    select.value = lang;
    select.dispatchEvent(new Event("change"));
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: "en",
            includedLanguages: "th,en,zh-TW",
            autoDisplay: false
        },
        "google_translate_element"
    );

    const savedLanguage = localStorage.getItem("thailockLanguage") || "en";
    updateLanguageButton(savedLanguage);

    if (savedLanguage !== "en") {
        setTimeout(() => changeGoogleTranslate(savedLanguage), 500);
    }
}

if (languageDropdown && languageCurrent) {
    const savedLanguage = localStorage.getItem("thailockLanguage") || "en";
    updateLanguageButton(savedLanguage);

    languageCurrent.addEventListener("click", function (event) {
        event.stopPropagation();
        languageDropdown.classList.toggle("active");
    });

    languageLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const lang = this.dataset.lang;

            activeLanguage = lang;
            updateLanguageButton(lang);
            localStorage.setItem("thailockLanguage", lang);
            languageDropdown.classList.remove("active");
            changeGoogleTranslate(lang);
        });
    });

    document.addEventListener("click", function (event) {
        if (!languageDropdown.contains(event.target)) {
            languageDropdown.classList.remove("active");
        }
    });
}

/* =========================================================
   COMPANY TIMELINE — MOBILE TAP TOGGLE
========================================================= */
const companyTimelineItems = document.querySelectorAll(
    ".company-content #history .timeline-item"
);
const companyTimelineMobile = window.matchMedia("(max-width: 900px)");

function closeCompanyTimelineItem(item) {
    item.classList.remove("is-open");
    item.setAttribute("aria-expanded", "false");
}

function toggleCompanyTimelineItem(item) {
    if (!companyTimelineMobile.matches) return;

    const shouldOpen = !item.classList.contains("is-open");
    companyTimelineItems.forEach(closeCompanyTimelineItem);

    if (shouldOpen) {
        item.classList.add("is-open");
        item.setAttribute("aria-expanded", "true");
    } else {
        item.blur();
    }
}

companyTimelineItems.forEach(item => {
    item.setAttribute("role", "button");
    item.setAttribute("aria-expanded", "false");

    item.addEventListener("click", () => toggleCompanyTimelineItem(item));

    item.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        toggleCompanyTimelineItem(item);
    });
});

companyTimelineMobile.addEventListener("change", event => {
    if (!event.matches) companyTimelineItems.forEach(closeCompanyTimelineItem);
});
