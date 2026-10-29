/**
 * LAB 5 - JAVASCRIPT LOGIC (script.js)
 * Interactive logic for Mobile Drawers, Navbar Collapses & Cart Summary
 */

document.addEventListener("DOMContentLoaded", () => {
    // =========================================================================
    // 1. MOBILE FILTER DRAWER (catalogue.html)
    // =========================================================================
    const openFilterBtn = document.getElementById("openFilterBtn");
    const closeFilterBtn = document.getElementById("closeFilterBtn");
    const filterDrawer = document.getElementById("mobileFilterDrawer");
    const drawerOverlay = document.getElementById("drawerOverlay");

    function openDrawer() {
        if (filterDrawer && drawerOverlay) {
            filterDrawer.classList.add("open");
            drawerOverlay.classList.add("active");
            document.body.classList.add("drawer-open");
            if (openFilterBtn) openFilterBtn.setAttribute("aria-expanded", "true");
        }
    }

    function closeDrawer() {
        if (filterDrawer && drawerOverlay) {
            filterDrawer.classList.remove("open");
            drawerOverlay.classList.remove("active");
            document.body.classList.remove("drawer-open");
            if (openFilterBtn) openFilterBtn.setAttribute("aria-expanded", "false");
        }
    }

    if (openFilterBtn) openFilterBtn.addEventListener("click", openDrawer);
    if (closeFilterBtn) closeFilterBtn.addEventListener("click", closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);

    // =========================================================================
    // 2. RESPONSIVE NAVBAR COLLAPSE (navbar.html)
    // =========================================================================
    const navToggleBtn = document.getElementById("navToggleBtn");
    const mobileNavPanel = document.getElementById("mobileNavPanel");

    if (navToggleBtn && mobileNavPanel) {
        navToggleBtn.addEventListener("click", () => {
            const isOpen = mobileNavPanel.classList.toggle("open");
            navToggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
            
            // Toggle hamburger icon between ☰ and ✕
            const icon = navToggleBtn.querySelector(".nav-icon");
            if (icon) {
                icon.innerHTML = isOpen ? "&#10005;" : "&#9776;";
            }
        });
    }

    // Close mobile nav or drawer with Escape key
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeDrawer();
            if (mobileNavPanel && mobileNavPanel.classList.contains("open")) {
                mobileNavPanel.classList.remove("open");
                if (navToggleBtn) {
                    navToggleBtn.setAttribute("aria-expanded", "false");
                    const icon = navToggleBtn.querySelector(".nav-icon");
                    if (icon) icon.innerHTML = "&#9776;";
                }
            }
        }
    });

    // =========================================================================
    // 3. DYNAMIC CART COUNTER & STICKY SUMMARY (catalogue.html)
    // =========================================================================
    let cartItemCount = 0;
    let cartTotalPrice = 0.00;

    const cartCountBadges = document.querySelectorAll(".cart-count-badge");
    const stickyCartCount = document.getElementById("stickyCartCount");
    const stickyCartTotal = document.getElementById("stickyCartTotal");
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            const price = parseFloat(button.getAttribute("data-price") || 0);
            const title = button.getAttribute("data-title") || "Product";

            cartItemCount += 1;
            cartTotalPrice += price;

            // Update badge counters
            cartCountBadges.forEach(badge => {
                badge.textContent = cartItemCount;
            });

            // Update sticky summary
            if (stickyCartCount) stickyCartCount.textContent = `${cartItemCount} items`;
            if (stickyCartTotal) stickyCartTotal.textContent = `$${cartTotalPrice.toFixed(2)}`;

            // Visual button confirmation
            const origText = button.innerHTML;
            button.innerHTML = "✓ Added!";
            button.classList.add("bg-emerald-600");
            setTimeout(() => {
                button.innerHTML = origText;
                button.classList.remove("bg-emerald-600");
            }, 1200);

            showLab5Toast(`Added "${title}" ($${price.toFixed(2)}) to cart!`);
        });
    });

    // Clear filters button helper
    const clearFiltersBtn = document.getElementById("clearFiltersBtn");
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", () => {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = false);
            showLab5Toast("Filters cleared.");
            closeDrawer();
        });
    }
});

/**
 * Toast Notification Helper
 */
function showLab5Toast(msg) {
    let toast = document.getElementById("cart-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "cart-toast";
        toast.setAttribute("role", "alert");
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
