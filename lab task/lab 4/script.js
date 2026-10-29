/**
 * LAB 4 - JAVASCRIPT INTERACTIONS (script.js)
 * Clean, lightweight vanilla JS for UI interactions across Lab 4 pages
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Navigation Toggle (Header)
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            const isExpanded = navMenu.classList.contains("open");
            navToggle.setAttribute("aria-expanded", isExpanded);
        });
    }

    // 2. Wishlist Heart Toggle across Gallery and Cards
    const favButtons = document.querySelectorAll(".btn-gallery-fav, .btn-wishlist");
    favButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            btn.classList.toggle("active");
            if (btn.classList.contains("active")) {
                btn.innerHTML = "&hearts; Saved";
                showToast("Added item to your saved wishlist!");
            } else {
                btn.innerHTML = "&hearts;";
                showToast("Removed item from your wishlist.");
            }
        });
    });

    // 3. Add to Cart / Primary Action Buttons
    const buyButtons = document.querySelectorAll(".btn-gallery-buy, .btn-add-cart, #enrollBtn");
    buyButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const itemName = btn.getAttribute("data-item") || "Selected item";
            showToast(`${itemName} successfully added!`);
            
            // Visual feedback on click
            const originalText = btn.innerText;
            btn.innerText = "✓ Added";
            btn.style.backgroundColor = "#059669";
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = "";
            }, 1400);
        });
    });

    // 4. Interactive Card Button (Task 4: animated-card.html)
    const animatedBtn = document.getElementById("animatedExploreBtn");
    if (animatedBtn) {
        animatedBtn.addEventListener("click", () => {
            showToast("Exploring modern CSS pseudo-elements and keyframes!");
        });
    }

    // 5. Dashboard Sidebar Nav Active State Switcher
    const dashNavLinks = document.querySelectorAll(".dash-nav a");
    dashNavLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            dashNavLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");
            showToast(`Switched view to: ${link.textContent.trim()}`);
        });
    });
});

/**
 * Accessible toast notification helper
 */
function showToast(message) {
    let toast = document.getElementById("ui-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "ui-toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        toast.style.position = "fixed";
        toast.style.bottom = "24px";
        toast.style.right = "24px";
        toast.style.backgroundColor = "#1e293b";
        toast.style.color = "#ffffff";
        toast.style.padding = "12px 20px";
        toast.style.borderRadius = "8px";
        toast.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)";
        toast.style.fontSize = "0.9rem";
        toast.style.zIndex = "9999";
        toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
    }, 2800);
}
