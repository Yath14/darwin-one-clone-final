/**
 * Dharwin One — Sidebar Drawer Script
 *
 * Handles:
 *  1. Open / close the full-screen mobile drawer
 *  2. Dark overlay fade in/out
 *  3. Body scroll lock (iOS-safe)
 *  4. aria-expanded + aria-label updates for accessibility
 *  5. Close on overlay click
 *  6. Close on Escape key
 *  7. Close on any drawer nav link click (SPA-friendly)
 *  8. Auto-close on viewport resize past 768px (rotation fix)
 *  9. Focus trap inside drawer (accessibility)
 * 10. Restore scroll position after close (iOS fixed-position fix)
 */

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle  = document.getElementById("menu-toggle");
    const drawer      = document.getElementById("mobile-drawer");
    const drawerClose = document.getElementById("drawer-close");
    const overlay     = document.getElementById("nav-overlay");

    if (!menuToggle || !drawer || !drawerClose || !overlay) return;

    /* ── Scroll position tracker (iOS body:fixed fix) ── */
    let scrollY = 0;

    /* ── State ────────────────────────────────────────── */

    function isOpen() {
        return drawer.classList.contains("active");
    }

    /* ── Open ─────────────────────────────────────────── */

    function openDrawer() {
        // Save scroll position before locking
        scrollY = window.scrollY;

        // Activate drawer + overlay
        drawer.classList.add("active");
        overlay.classList.add("active");

        // Lock body scroll — iOS requires position:fixed trick
        document.body.style.top = `-${scrollY}px`;
        document.body.classList.add("drawer-open");

        // Accessibility
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
        drawer.removeAttribute("aria-hidden");
        overlay.removeAttribute("aria-hidden");

        // Move focus into drawer for keyboard/screen reader users
        drawerClose.focus();
    }

    /* ── Close ────────────────────────────────────────── */

    function closeDrawer() {
        drawer.classList.remove("active");
        overlay.classList.remove("active");

        // Restore body scroll
        document.body.classList.remove("drawer-open");
        document.body.style.top = "";

        // Restore scroll position (iOS fix — body:fixed resets scroll to 0)
        window.scrollTo({ top: scrollY, behavior: "instant" });

        // Accessibility
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        drawer.setAttribute("aria-hidden", "true");
        overlay.setAttribute("aria-hidden", "true");

        // Return focus to burger button
        menuToggle.focus();
    }

    /* ── Toggle ───────────────────────────────────────── */

    function toggleDrawer() {
        isOpen() ? closeDrawer() : openDrawer();
    }

    /* ── Burger button click ──────────────────────────── */

    menuToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleDrawer();
    });

    /* ── X close button click ─────────────────────────── */

    drawerClose.addEventListener("click", function () {
        closeDrawer();
    });

    /* ── Overlay click ────────────────────────────────── */

    overlay.addEventListener("click", function () {
        closeDrawer();
    });

    /* touchend on overlay for faster iOS response */
    overlay.addEventListener("touchend", function (e) {
        e.preventDefault();
        closeDrawer();
    }, { passive: false });

    /* ── Close on drawer nav link click ──────────────────
       Ensures drawer closes when user taps a link
       (important for single-page / anchor navigation)
    ─────────────────────────────────────────────────── */

    const drawerLinks = drawer.querySelectorAll("a");
    drawerLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            closeDrawer();
        });
    });

    /* ── Escape key ───────────────────────────────────── */

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && isOpen()) {
            closeDrawer();
        }
    });

    /* ── Resize: auto-close past 768px ───────────────────
       Handles phone rotation (portrait → landscape)
       or browser window resize on desktop dev tools
    ─────────────────────────────────────────────────── */

    window.addEventListener("resize", function () {
        if (window.innerWidth > 768 && isOpen()) {
            closeDrawer();
        }
    }, { passive: true });

    /* ── Focus Trap inside drawer ─────────────────────────
       Keeps Tab key cycling within the drawer when open
       so keyboard users can't accidentally tab outside it.
    ─────────────────────────────────────────────────── */

    drawer.addEventListener("keydown", function (e) {
        if (e.key !== "Tab" || !isOpen()) return;

        const focusable = Array.from(
            drawer.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        ).filter(el => el.offsetParent !== null); // visible elements only

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last  = focusable[focusable.length - 1];

        if (e.shiftKey) {
            // Shift+Tab: if on first element, wrap to last
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            // Tab: if on last element, wrap to first
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    /* ── Initial aria-hidden state ───────────────────── */
    drawer.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");

});
