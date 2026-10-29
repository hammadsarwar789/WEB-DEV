/**
 * script.js - MIDTERM TASK 3: cart badge + mini cart (plain JavaScript, no libraries)
 *
 * N = 68  ->  each product may be added at most (N mod 4) + 2 = (68 mod 4) + 2 = 0 + 2 = 2 times
 */
(function () {
    "use strict";

    const MAX_PER_PRODUCT = (68 % 4) + 2;   // = 2

    // The cart: an array of { key, name, colour, price } objects (one entry per item added)
    let cart = [];

    // "Rs.9,950.00" -> 9950   (remove the "Rs." prefix and the thousands commas)
    function parsePrice(text) {
        return Number(text.replace("Rs.", "").replace(/,/g, "").trim());
    }

    // 9950 -> "Rs.9,950.00"
    function formatPrice(n) {
        return "Rs." + n.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Same product = same name AND colour (e.g. Short Knit Polo comes in Brown and Light Blue)
    function makeKey(name, colour) {
        return name + "|" + colour;
    }

    // How many of this product are in the cart?
    function countOf(key) {
        return cart.filter(item => item.key === key).length;
    }

    document.addEventListener("DOMContentLoaded", function () {
        const cartIcon = document.getElementById("cartTriggerBtn");
        const badge = document.getElementById("headerCartBadge");
        const panel = document.getElementById("miniCart");
        const list = document.getElementById("miniCartList");
        const emptyText = document.getElementById("miniCartEmpty");
        const totalEl = document.getElementById("miniCartTotal");
        if (!cartIcon || !badge || !panel) return;

        cartIcon.setAttribute("aria-controls", "miniCart");
        cartIcon.setAttribute("aria-expanded", "false");

        // ---------- Add an item (respecting the limit), then redraw everything
        function addItem(name, colour, price) {
            const key = makeKey(name, colour);
            if (countOf(key) >= MAX_PER_PRODUCT) return false;
            cart.push({ key: key, name: name, colour: colour, price: price });
            render();
            return true;
        }

        // ---------- Remove one item by its position in the array
        function removeItem(index) {
            cart.splice(index, 1);
            render();
        }

        // ---------- Redraw: badge, mini-cart list, total, and every Add to Cart button
        function render() {
            // Badge = number of items in the cart (CSS hides it when data-count is "0")
            badge.textContent = cart.length;
            badge.setAttribute("data-count", cart.length);
            cartIcon.setAttribute("aria-label", `View cart, ${cart.length} item${cart.length === 1 ? "" : "s"}`);

            // List
            list.innerHTML = "";
            cart.forEach(function (item, index) {
                const li = document.createElement("li");
                li.className = "mini-cart__item";

                const info = document.createElement("span");
                info.className = "mini-cart__name";
                info.textContent = `${item.name} (${item.colour})`;

                const price = document.createElement("span");
                price.className = "mini-cart__price";
                price.textContent = formatPrice(item.price);

                const removeBtn = document.createElement("button");
                removeBtn.type = "button";
                removeBtn.className = "mini-cart__remove";
                removeBtn.textContent = "Remove";
                removeBtn.setAttribute("aria-label", `Remove ${item.name} (${item.colour})`);
                removeBtn.addEventListener("click", function (e) {
                    e.stopPropagation();      // keep the panel open
                    removeItem(index);
                });

                li.append(info, price, removeBtn);
                list.appendChild(li);
            });
            emptyText.hidden = cart.length > 0;

            // Total with reduce(): start at 0 and add each item's price
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            totalEl.textContent = formatPrice(total);

            // Buttons: "Limit reached" + disabled once a product is in the cart MAX_PER_PRODUCT times
            document.querySelectorAll(".btn-add-to-cart").forEach(function (btn) {
                const card = btn.closest(".product-card");
                const key = makeKey(cardName(card), cardColour(card));
                const full = countOf(key) >= MAX_PER_PRODUCT;
                btn.disabled = full;
                btn.textContent = full ? "Limit reached" : "Add to Cart";
            });
        }

        // Read the product details from the card itself
        function cardName(card) {
            return card.querySelector(".product-title").textContent.trim();
        }

        function cardColour(card) {
            const el = card.querySelector(".product-color-label");
            return el ? el.textContent.trim() : "";
        }

        // ---------- Click on any "Add to Cart" button (event delegation: one listener for all cards,
        //            including cards added later)
        document.addEventListener("click", function (e) {
            const btn = e.target.closest(".btn-add-to-cart");
            if (!btn || btn.disabled) return;
            const card = btn.closest(".product-card");
            const price = parsePrice(card.querySelector(".product-price").textContent);
            addItem(cardName(card), cardColour(card), price);
        });

        // ---------- Product page: its own Add to Cart form sends a "cart:add" event (js/product-page.js)
        window.addEventListener("cart:add", function (e) {
            const d = e.detail || {};
            const qty = Number.isInteger(d.quantity) ? d.quantity : 1;
            for (let i = 0; i < qty; i++) {
                if (!addItem(d.name, d.color, d.price)) break;   // stop at the limit
            }
            openPanel();
        });

        // ---------- Mini-cart panel: the cart icon toggles it (instead of going to checkout.html)
        function openPanel() {
            panel.hidden = false;
            cartIcon.setAttribute("aria-expanded", "true");
        }

        function closePanel() {
            panel.hidden = true;
            cartIcon.setAttribute("aria-expanded", "false");
        }

        cartIcon.addEventListener("click", function (e) {
            e.preventDefault();               // the icon is a link to checkout.html (Task 2); JS shows the mini cart instead
            if (panel.hidden) {
                openPanel();
            } else {
                closePanel();
            }
        });

        // Close with Esc or a click outside the panel
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && !panel.hidden) closePanel();
        });

        document.addEventListener("click", function (e) {
            if (!panel.hidden && !panel.contains(e.target) && !cartIcon.contains(e.target)) closePanel();
        });

        render();
    });
})();
