document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks   = document.getElementById("nav-links");
    const navbar     = document.querySelector(".navbar");

    if (!menuToggle || !navLinks) return;

    /* ── Helpers ─────────────────────────────────────────────── */

    function isMenuOpen() {
        return navLinks.classList.contains("active");
    }

    function openMenu() {
        navLinks.classList.add("active");
        menuToggle.classList.add("is-open");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
        // FIX: Lock body scroll so background doesn't scroll on iOS while menu is open
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        // FIX: Restore body scroll
        document.body.style.overflow = "";
    }

    function toggleMenu() {
        if (isMenuOpen()) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    /* ── Burger click ────────────────────────────────────────── */

    menuToggle.addEventListener("click", function (e) {
        e.stopPropagation();  // FIX: Prevent document click listener from immediately closing
        toggleMenu();
    });

    /* ── Close on nav link click ─────────────────────────────────
       FIX: On single-page / anchor-link sites the nav would stay
       open after clicking a link since the page doesn't reload.
    ─────────────────────────────────────────────────────────── */

    const allNavLinks = navLinks.querySelectorAll("a");
    allNavLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (isMenuOpen()) {
                closeMenu();
            }
        });
    });

    /* ── Close on outside click ──────────────────────────────────
       FIX: Tap anywhere outside the navbar to dismiss the menu.
       Using touchend for iOS responsiveness (touchend fires before click).
    ─────────────────────────────────────────────────────────── */

    function handleOutsideInteraction(e) {
        if (isMenuOpen() && !navbar.contains(e.target)) {
            closeMenu();
        }
    }

    document.addEventListener("click",     handleOutsideInteraction);
    document.addEventListener("touchend",  handleOutsideInteraction, { passive: true });

    /* ── Close on Escape key ─────────────────────────────────────
       FIX: Keyboard users can dismiss the menu and return focus.
    ─────────────────────────────────────────────────────────── */

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && isMenuOpen()) {
            closeMenu();
            menuToggle.focus();  // Return focus to toggle button
        }
    });

    /* ── Close on viewport resize past breakpoint ────────────────
       FIX: If the user rotates from portrait → landscape (or resizes
       browser window) and the menu was open, close it cleanly so
       the desktop nav isn't invisible but still "active".
    ─────────────────────────────────────────────────────────── */

    window.addEventListener("resize", function () {
        if (window.innerWidth > 768 && isMenuOpen()) {
            closeMenu();
        }
    }, { passive: true });

});
