/**
 * js/cart.js - LocalStorage cart management, cart drawer UI, quantities, BaadMay & checkout
 */
(function (root) {
    "use strict";

    const STORAGE_KEY = "lama_cart";
    const ITEM_FALLBACK_IMAGE = "https://placehold.co/150x200?text=Item";

    let cartItems = [];

    // A stored item is usable only if the fields the UI does maths with are valid
    function isValidItem(item) {
        return item !== null && typeof item === "object" &&
            typeof item.id === "string" &&
            typeof item.name === "string" &&
            typeof item.price === "number" && Number.isFinite(item.price) && item.price >= 0 &&
            Number.isInteger(item.quantity) && item.quantity > 0;
    }

    // Safely load cart from localStorage (bad JSON or bad items reset / are dropped)
    function loadCart() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    cartItems = parsed.filter(isValidItem);
                    if (cartItems.length !== parsed.length) saveCart();
                    return;
                }
            }
        } catch (err) {
            console.warn("[LAMA Cart] Error reading localStorage, resetting cart:", err);
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (ignore) {
                // storage unavailable (e.g. blocked in this browser) - cart just won't persist
            }
        }
        cartItems = [];
    }

    // Save cart to localStorage
    function saveCart() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
        } catch (err) {
            console.warn("[LAMA Cart] Could not persist to localStorage:", err);
        }
    }

    // Add item to cart (merges if id + size match). quantity is optional: the product page sends 1-10,
    // the quick-add "+" panel sends nothing (= 1).
    function addToCart(newItem) {
        const qty = Number.isInteger(newItem.quantity) && newItem.quantity > 0 ? newItem.quantity : 1;
        const existing = cartItems.find(item => item.id === newItem.id && item.size === newItem.size);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + qty;
        } else {
            cartItems.push({
                id: newItem.id,
                name: newItem.name,
                price: newItem.price,
                color: newItem.color,
                size: newItem.size,
                image: newItem.image,
                quantity: qty
            });
        }
        saveCart();
        renderCartUI();
    }

    // Update quantity
    function updateQuantity(id, size, delta) {
        const item = cartItems.find(i => i.id === id && i.size === size);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id, size);
            return;
        }
        saveCart();
        renderCartUI();
    }

    // Remove item
    function removeFromCart(id, size) {
        cartItems = cartItems.filter(i => !(i.id === id && i.size === size));
        saveCart();
        renderCartUI();
    }

    // Computations
    function getSubtotal() {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    function getTotalCount() {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    }

    // DOM Elements
    let cartDrawer, cartBackdrop, cartCloseBtn, cartItemsContainer, emptyStateEl;
    let subtotalEl, checkoutBtn, baadmayContainer, baadmayAmountEl, baadmayToggleBtn, baadmayDetailsPanel;
    let headerCartBadge, cartTriggerBtn;
    let lastFocused = null;

    function renderCartUI() {
        const formatPrice = (root.LAMA_DATA && root.LAMA_DATA.formatPrice) || (n => "Rs." + n);
        const totalCount = getTotalCount();
        const subtotal = getSubtotal();

        // 1. Update Header Badge
        if (headerCartBadge) {
            headerCartBadge.textContent = totalCount;
            headerCartBadge.setAttribute("data-count", totalCount);
        }
        if (cartTriggerBtn) {
            cartTriggerBtn.setAttribute("aria-label", `View cart, ${totalCount} item${totalCount === 1 ? "" : "s"}`);
        }

        // 2. Render Items
        if (!cartItemsContainer || !emptyStateEl) return;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "";
            emptyStateEl.hidden = false;
            if (subtotalEl) subtotalEl.textContent = formatPrice(0);
            if (checkoutBtn) checkoutBtn.disabled = true;
            if (baadmayContainer) baadmayContainer.hidden = true;
            return;
        }

        emptyStateEl.hidden = true;
        if (checkoutBtn) checkoutBtn.disabled = false;
        if (baadmayContainer) baadmayContainer.hidden = false;

        cartItemsContainer.innerHTML = "";

        cartItems.forEach(item => {
            const itemEl = document.createElement("li");
            itemEl.className = "cart-item";

            // Image
            const img = document.createElement("img");
            img.className = "cart-item-img";
            img.src = item.image || ITEM_FALLBACK_IMAGE;
            img.alt = item.name;
            img.width = 75;
            img.height = 95;
            img.onerror = function () {
                this.onerror = null;
                this.src = ITEM_FALLBACK_IMAGE;
            };
            itemEl.appendChild(img);

            // Details
            const details = document.createElement("div");
            details.className = "cart-item-details";

            const title = document.createElement("div");
            title.className = "cart-item-title";
            title.textContent = item.name;

            const variant = document.createElement("div");
            variant.className = "cart-item-variant";
            variant.textContent = `${item.color || "Standard"} / ${item.size}`;

            const price = document.createElement("div");
            price.className = "cart-item-price";
            price.textContent = formatPrice(item.price);

            // Bottom Row (Stepper + Remove)
            const bottomRow = document.createElement("div");
            bottomRow.className = "cart-item-bottom-row";

            const stepper = document.createElement("div");
            stepper.className = "cart-stepper";

            const minusBtn = document.createElement("button");
            minusBtn.type = "button";
            minusBtn.className = "stepper-btn";
            minusBtn.setAttribute("aria-label", `Decrease quantity of ${item.name}`);
            minusBtn.textContent = "-";
            minusBtn.addEventListener("click", () => updateQuantity(item.id, item.size, -1));

            const qtySpan = document.createElement("span");
            qtySpan.className = "stepper-qty";
            qtySpan.textContent = item.quantity;

            const plusBtn = document.createElement("button");
            plusBtn.type = "button";
            plusBtn.className = "stepper-btn";
            plusBtn.setAttribute("aria-label", `Increase quantity of ${item.name}`);
            plusBtn.textContent = "+";
            plusBtn.addEventListener("click", () => updateQuantity(item.id, item.size, 1));

            stepper.append(minusBtn, qtySpan, plusBtn);

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "cart-remove-btn";
            removeBtn.textContent = "Remove";
            removeBtn.setAttribute("aria-label", `Remove ${item.name} (${item.size}) from cart`);
            removeBtn.addEventListener("click", () => removeFromCart(item.id, item.size));

            bottomRow.append(stepper, removeBtn);
            details.append(title, variant, price, bottomRow);

            itemEl.appendChild(details);
            cartItemsContainer.appendChild(itemEl);
        });

        // 3. Update Subtotal & BaadMay Amount
        if (subtotalEl) {
            subtotalEl.textContent = formatPrice(subtotal);
        }

        if (baadmayAmountEl) {
            const installment = subtotal / 3;
            baadmayAmountEl.textContent = formatPrice(installment);
        }
    }

    function isCartOpen() {
        return Boolean(cartDrawer && cartDrawer.classList.contains("open"));
    }

    function openCart() {
        if (!cartDrawer || !cartBackdrop) return;
        if (!isCartOpen()) {
            // Remember where focus was (header cart icon or a product's "+" button) to restore on close
            lastFocused = document.activeElement && document.activeElement !== document.body
                ? document.activeElement
                : cartTriggerBtn;
            cartDrawer.classList.add("open");
            cartBackdrop.classList.add("active");
            root.LAMA_UI.lockScroll();
        }
        if (cartCloseBtn) cartCloseBtn.focus();
    }

    function closeCart() {
        if (!isCartOpen()) return;
        cartDrawer.classList.remove("open");
        cartBackdrop.classList.remove("active");
        root.LAMA_UI.unlockScroll();
        if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
        lastFocused = null;
    }

    document.addEventListener("DOMContentLoaded", function () {
        loadCart();

        cartDrawer = document.getElementById("cartDrawer");
        cartBackdrop = document.getElementById("cartDrawerBackdrop");
        cartCloseBtn = document.getElementById("cartDrawerClose");
        cartItemsContainer = document.getElementById("cartItemsList");
        emptyStateEl = document.getElementById("cartEmptyState");
        subtotalEl = document.getElementById("cartSubtotalAmount");
        checkoutBtn = document.getElementById("cartCheckoutBtn");

        baadmayContainer = document.getElementById("baadmayBlock");
        baadmayAmountEl = document.getElementById("baadmayInstallmentAmount");
        baadmayToggleBtn = document.getElementById("baadmayToggleBtn");
        baadmayDetailsPanel = document.getElementById("baadmayDetailsPanel");

        headerCartBadge = document.getElementById("headerCartBadge");
        cartTriggerBtn = document.getElementById("cartTriggerBtn");
        const continueShoppingBtn = document.getElementById("cartContinueShopping");

        // Drawer Event Listeners
        if (cartTriggerBtn) cartTriggerBtn.addEventListener("click", openCart);
        if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCart);
        if (cartBackdrop) cartBackdrop.addEventListener("click", closeCart);
        if (continueShoppingBtn) continueShoppingBtn.addEventListener("click", closeCart);
        if (cartDrawer) cartDrawer.addEventListener("keydown", (e) => root.LAMA_UI.trapFocus(e, cartDrawer));

        // Checkout Button Click
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", () => {
                alert("Demo checkout");
            });
        }

        // BaadMay info toggle
        if (baadmayToggleBtn && baadmayDetailsPanel) {
            baadmayToggleBtn.addEventListener("click", () => {
                const isOpen = baadmayDetailsPanel.classList.toggle("open");
                baadmayToggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
            });
        }

        // Listen for "cart:add" custom event
        window.addEventListener("cart:add", (e) => {
            if (e.detail) {
                addToCart(e.detail);
                openCart();
            }
        });

        // Esc key closes cart drawer
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && isCartOpen()) {
                closeCart();
            }
        });

        // Initial UI Render
        renderCartUI();
    });

})(window);
