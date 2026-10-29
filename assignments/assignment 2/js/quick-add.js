/**
 * js/quick-add.js - Size selection overlay panel & cart:add dispatcher
 */
(function (root) {
    "use strict";

    const VIEWPORT_GAP = 16;

    document.addEventListener("DOMContentLoaded", function () {
        const ui = root.LAMA_UI;
        const backdrop = document.getElementById("quickAddBackdrop");
        const panel = document.getElementById("quickAddPanel");
        const closeBtn = document.getElementById("quickAddClose");
        const prodNameEl = document.getElementById("quickAddName");
        const prodPriceEl = document.getElementById("quickAddPrice");
        const sizesContainer = document.getElementById("quickAddSizes");
        const errorMsgEl = document.getElementById("quickAddError");
        const submitBtn = document.getElementById("quickAddSubmit");
        const toast = document.getElementById("lamaToast");

        const desktopQuery = window.matchMedia("(min-width: 768px)");

        let currentProduct = null;
        let selectedSize = null;
        let triggerEl = null;
        let toastTimer = null;

        function showToast(message) {
            if (!toast) return;
            toast.textContent = message;
            toast.classList.add("show");
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => {
                toast.classList.remove("show");
            }, 2600);
        }

        function setSubmitEnabled(enabled) {
            if (submitBtn) submitBtn.setAttribute("aria-disabled", enabled ? "false" : "true");
        }

        // Desktop: sit over the bottom of the card image. Mobile: CSS bottom sheet (clear JS position).
        function positionPanel() {
            if (!panel) return;
            const imageBox = triggerEl && triggerEl.closest(".product-image-box");

            if (!desktopQuery.matches || !imageBox) {
                panel.style.removeProperty("top");
                panel.style.removeProperty("left");
                panel.style.removeProperty("width");
                return;
            }

            const rect = imageBox.getBoundingClientRect();
            const width = Math.min(Math.max(rect.width, 300), window.innerWidth - VIEWPORT_GAP * 2);
            panel.style.width = width + "px";

            const height = panel.offsetHeight;
            const left = Math.min(Math.max(rect.left, VIEWPORT_GAP), window.innerWidth - width - VIEWPORT_GAP);
            const top = Math.min(Math.max(rect.bottom - height, VIEWPORT_GAP), window.innerHeight - height - VIEWPORT_GAP);

            panel.style.left = left + "px";
            panel.style.top = top + "px";
        }

        function isOpen() {
            return Boolean(panel && panel.classList.contains("open"));
        }

        function openQuickAdd(productId, trigger) {
            const products = (root.LAMA_DATA && root.LAMA_DATA.PRODUCTS) || [];
            const product = products.find(p => p.id === productId);
            if (!product || !panel || !backdrop) return;

            // Only one panel at a time: reuse it for the new product
            const wasOpen = isOpen();
            currentProduct = product;
            triggerEl = trigger || null;

            const formatPrice = (root.LAMA_DATA && root.LAMA_DATA.formatPrice) || (n => "Rs." + n);

            selectedSize = null;
            setSubmitEnabled(false);
            if (errorMsgEl) errorMsgEl.hidden = true;

            // Populate product details
            if (prodNameEl) prodNameEl.textContent = currentProduct.name;
            if (prodPriceEl) prodPriceEl.textContent = formatPrice(currentProduct.price);

            // Populate size buttons (single-select)
            if (sizesContainer) {
                sizesContainer.innerHTML = "";
                currentProduct.sizes.forEach(size => {
                    const btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = "size-pill";
                    btn.textContent = size;
                    btn.setAttribute("aria-pressed", "false");
                    btn.addEventListener("click", () => {
                        sizesContainer.querySelectorAll(".size-pill").forEach(b => {
                            b.classList.remove("selected");
                            b.setAttribute("aria-pressed", "false");
                        });
                        btn.classList.add("selected");
                        btn.setAttribute("aria-pressed", "true");
                        selectedSize = size;
                        setSubmitEnabled(true);
                        if (errorMsgEl) errorMsgEl.hidden = true;
                    });
                    sizesContainer.appendChild(btn);
                });
            }

            positionPanel();

            if (!wasOpen) {
                panel.classList.add("open");
                backdrop.classList.add("active");
                ui.lockScroll();
            }
            if (closeBtn) closeBtn.focus();
        }

        function closeQuickAdd() {
            if (!isOpen()) return;
            panel.classList.remove("open");
            backdrop.classList.remove("active");
            ui.unlockScroll();
            if (triggerEl) triggerEl.focus();
            currentProduct = null;
            selectedSize = null;
            triggerEl = null;
        }

        // Handle Add to Cart submission
        if (submitBtn) {
            submitBtn.addEventListener("click", () => {
                if (!selectedSize) {
                    if (errorMsgEl) {
                        errorMsgEl.textContent = "Please select a size";
                        errorMsgEl.hidden = false;
                    }
                    return;
                }

                if (!currentProduct) return;

                const detail = {
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: currentProduct.price,
                    color: currentProduct.color,
                    size: selectedSize,
                    image: currentProduct.images[0]
                };

                // Close first (focus goes back to "+"), so the cart drawer opened by "cart:add"
                // remembers the "+" button as the element to return focus to
                closeQuickAdd();
                window.dispatchEvent(new CustomEvent("cart:add", { detail: detail }));
                showToast("Added to cart");
            });
        }

        if (closeBtn) closeBtn.addEventListener("click", () => closeQuickAdd());
        if (backdrop) backdrop.addEventListener("click", () => closeQuickAdd());

        if (panel) {
            panel.addEventListener("keydown", (e) => ui.trapFocus(e, panel));
        }

        window.addEventListener("resize", () => {
            if (isOpen()) positionPanel();
        });

        // Listen for quickadd:open custom event
        window.addEventListener("quickadd:open", (e) => {
            if (e.detail && e.detail.id) {
                openQuickAdd(e.detail.id, e.detail.trigger);
            }
        });

        // Esc key closes panel
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && isOpen()) {
                closeQuickAdd();
            }
        });
    });

})(window);
