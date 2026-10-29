/**
 * js/footer.js - Newsletter subscription validation, currency selector & mobile accordion toggles
 */
(function (root) {
    "use strict";

    const CURRENCY_KEY = "lama_currency";
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // localStorage can throw (blocked storage / private mode); the currency choice is just not remembered then
    function readStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (err) {
            return null;
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (err) {
            console.warn("[LAMA Footer] Could not save to localStorage:", err);
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        // 1. Currency Selector (visual only)
        const currencySelect = document.getElementById("currencySelector");
        if (currencySelect) {
            const savedCurrency = readStorage(CURRENCY_KEY);
            const isKnown = Array.from(currencySelect.options).some(o => o.value === savedCurrency);
            if (isKnown) {
                currencySelect.value = savedCurrency;
            }

            currencySelect.addEventListener("change", function () {
                writeStorage(CURRENCY_KEY, this.value);
            });
        }

        // 2. Newsletter Form
        const newsletterForm = document.getElementById("newsletterForm");
        const newsletterInput = document.getElementById("newsletterInput");
        const newsletterFeedback = document.getElementById("newsletterFeedback");

        if (newsletterForm && newsletterInput && newsletterFeedback) {
            function showFeedback(message, type) {
                newsletterFeedback.textContent = message;
                newsletterFeedback.className = "newsletter-feedback " + type;
                newsletterInput.setAttribute("aria-invalid", type === "error" ? "true" : "false");
            }

            newsletterForm.addEventListener("submit", function (e) {
                e.preventDefault();
                const email = newsletterInput.value.trim();

                if (!email) {
                    showFeedback("Please enter an email address.", "error");
                    return;
                }

                if (!EMAIL_REGEX.test(email)) {
                    showFeedback("Please enter a valid email address.", "error");
                    return;
                }

                showFeedback("Thanks for subscribing!", "success");
                newsletterForm.reset();
            });
        }

        // 3. Accordions: collapsible below 768px, always-open columns above
        const mobileQuery = window.matchMedia("(max-width: 767px)");
        const accordionButtons = document.querySelectorAll(".footer-accordion-header");

        function setOpen(button, open) {
            const content = document.getElementById(button.getAttribute("aria-controls"));
            const icon = button.querySelector(".footer-accordion-toggle-icon");
            if (content) content.classList.toggle("open", open);
            if (icon) icon.textContent = open ? "−" : "+";
            button.setAttribute("aria-expanded", open ? "true" : "false");
        }

        function syncMode() {
            accordionButtons.forEach(button => {
                if (mobileQuery.matches) {
                    button.removeAttribute("tabindex");
                    setOpen(button, false);
                } else {
                    // Desktop columns: not a control, so keep it out of the Tab order
                    button.setAttribute("tabindex", "-1");
                    button.removeAttribute("aria-expanded");
                }
            });
        }

        accordionButtons.forEach(button => {
            button.addEventListener("click", function () {
                if (!mobileQuery.matches) return;
                setOpen(button, button.getAttribute("aria-expanded") !== "true");
            });
        });

        syncMode();
        mobileQuery.addEventListener("change", syncMode);
    });

})(window);
