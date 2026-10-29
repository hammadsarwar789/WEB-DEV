/**
 * script.js - MIDTERM TASK 3: cart badge + mini cart (plain JavaScript, no libraries)
 *             + EXTRA: "Save for later" (wishlist) with hearts on the cards
 *
 * N = 68  ->  each product may be added at most (N mod 4) + 2 = (68 mod 4) + 2 = 0 + 2 = 2 times
 */
(function () {
    "use strict";

    const MAX_PER_PRODUCT = (68 % 4) + 2;   // = 2
    const SAVED_STORAGE_KEY = "lama_saved"; // the saved list is kept in localStorage (survives a refresh)

    // The cart: an array of { key, name, colour, price } objects (one entry per item added)
    let cart = [];

    // Saved for later: an array of { key, name, colour, price } (each product at most once)
    let saved = loadSaved();

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

    function isSaved(key) {
        return saved.some(item => item.key === key);
    }

    // localStorage can contain broken data or be blocked, so read it safely
    function loadSaved() {
        try {
            const list = JSON.parse(localStorage.getItem(SAVED_STORAGE_KEY));
            return Array.isArray(list) ? list.filter(item => item && item.key && typeof item.price === "number") : [];
        } catch (err) {
            return [];
        }
    }

    function storeSaved() {
        try {
            localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(saved));
        } catch (err) {
            // storage blocked - the list still works until the page is closed
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        const cartIcon = document.getElementById("cartTriggerBtn");
        const badge = document.getElementById("headerCartBadge");
        const panel = document.getElementById("miniCart");
        const list = document.getElementById("miniCartList");
        const emptyText = document.getElementById("miniCartEmpty");
        const totalEl = document.getElementById("miniCartTotal");

        const savedBtn = document.getElementById("savedBtn");
        const savedBadge = document.getElementById("savedBadge");
        const savedPanel = document.getElementById("savedPanel");
        const savedList = document.getElementById("savedList");
        const savedEmpty = document.getElementById("savedEmpty");
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

        // ---------- Save for later: add / remove a product in the saved list
        function toggleSaved(name, colour, price) {
            const key = makeKey(name, colour);
            if (isSaved(key)) {
                saved = saved.filter(item => item.key !== key);
            } else {
                saved.push({ key: key, name: name, colour: colour, price: price });
            }
            storeSaved();
            render();
        }

        // From the mini cart: take the item out of the cart and keep it in the saved list
        function saveForLater(index) {
            const item = cart[index];
            cart.splice(index, 1);
            if (!isSaved(item.key)) saved.push({ key: item.key, name: item.name, colour: item.colour, price: item.price });
            storeSaved();
            render();
        }

        // From the saved panel: put it in the cart (if under the limit) and take it off the saved list
        function moveToCart(index) {
            const item = saved[index];
            if (addItem(item.name, item.colour, item.price)) {
                saved.splice(index, 1);
                storeSaved();
                render();
                return true;
            }
            return false;   // limit reached - it stays saved
        }

        // Small helper: a text button used in both panels
        function textButton(label, className, ariaLabel, onClick) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = className;
            btn.textContent = label;
            btn.setAttribute("aria-label", ariaLabel);
            btn.addEventListener("click", function (e) {
                e.stopPropagation();      // keep the panel open
                onClick(btn);
            });
            return btn;
        }

        // ---------- Redraw: badges, both panels, totals, and every card button
        function render() {
            // Cart badge = number of items in the cart (CSS hides it when data-count is "0")
            badge.textContent = cart.length;
            badge.setAttribute("data-count", cart.length);
            cartIcon.setAttribute("aria-label", `View cart, ${cart.length} item${cart.length === 1 ? "" : "s"}`);

            // Mini-cart list
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

                const actions = document.createElement("span");
                actions.className = "mini-cart__actions";
                actions.append(
                    textButton("Save for later", "mini-cart__save", `Save ${item.name} (${item.colour}) for later`, () => saveForLater(index)),
                    textButton("Remove", "mini-cart__remove", `Remove ${item.name} (${item.colour})`, () => removeItem(index))
                );

                li.append(info, price, actions);
                list.appendChild(li);
            });
            emptyText.hidden = cart.length > 0;

            // Total with reduce(): start at 0 and add each item's price
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            totalEl.textContent = formatPrice(total);

            // Add to Cart buttons: "Limit reached" + disabled once a product is in the cart MAX_PER_PRODUCT times
            document.querySelectorAll(".btn-add-to-cart").forEach(function (btn) {
                const card = btn.closest(".product-card");
                const key = makeKey(cardName(card), cardColour(card));
                const full = countOf(key) >= MAX_PER_PRODUCT;
                btn.disabled = full;
                btn.textContent = full ? "Limit reached" : "Add to Cart";
            });

            renderSaved();
        }

        // ---------- Saved-for-later panel, heart buttons and the saved badge
        function renderSaved() {
            if (savedBadge) {
                savedBadge.textContent = saved.length;
                savedBadge.setAttribute("data-count", saved.length);
            }
            if (savedBtn) savedBtn.setAttribute("aria-label", `Saved for later, ${saved.length} item${saved.length === 1 ? "" : "s"}`);

            // Hearts on the cards: filled (aria-pressed="true") when the product is saved
            document.querySelectorAll(".btn-wishlist").forEach(function (heart) {
                const card = heart.closest(".product-card");
                const name = cardName(card);
                const on = isSaved(makeKey(name, cardColour(card)));
                heart.setAttribute("aria-pressed", on ? "true" : "false");
                heart.setAttribute("aria-label", on ? `Remove ${name} from saved items` : `Save ${name} for later`);
            });

            if (!savedList) return;
            savedList.innerHTML = "";
            saved.forEach(function (item, index) {
                const li = document.createElement("li");
                li.className = "mini-cart__item";

                const info = document.createElement("span");
                info.className = "mini-cart__name";
                info.textContent = `${item.name} (${item.colour})`;

                const price = document.createElement("span");
                price.className = "mini-cart__price";
                price.textContent = formatPrice(item.price);

                const actions = document.createElement("span");
                actions.className = "mini-cart__actions";
                actions.append(
                    textButton("Move to cart", "mini-cart__save", `Move ${item.name} (${item.colour}) to the cart`, function (btn) {
                        if (!moveToCart(index)) {
                            btn.textContent = "Limit reached";
                            btn.disabled = true;
                        }
                    }),
                    textButton("Remove", "mini-cart__remove", `Remove ${item.name} (${item.colour}) from saved items`, function () {
                        saved.splice(index, 1);
                        storeSaved();
                        render();
                    })
                );

                li.append(info, price, actions);
                savedList.appendChild(li);
            });
            savedEmpty.hidden = saved.length > 0;
        }

        // Read the product details from the card itself
        function cardName(card) {
            return card.querySelector(".product-title").textContent.trim();
        }

        function cardColour(card) {
            const el = card.querySelector(".product-color-label");
            return el ? el.textContent.trim() : "";
        }

        function cardPrice(card) {
            return parsePrice(card.querySelector(".product-price").textContent);
        }

        // ---------- Clicks on any card button (event delegation: one listener for all cards,
        //            including cards added later)
        document.addEventListener("click", function (e) {
            const addBtn = e.target.closest(".btn-add-to-cart");
            if (addBtn && !addBtn.disabled) {
                const card = addBtn.closest(".product-card");
                addItem(cardName(card), cardColour(card), cardPrice(card));
                return;
            }

            const heart = e.target.closest(".btn-wishlist");
            if (heart) {
                const card = heart.closest(".product-card");
                toggleSaved(cardName(card), cardColour(card), cardPrice(card));
            }
        });

        // ---------- Product page: its own Add to Cart form sends a "cart:add" event (js/product-page.js)
        window.addEventListener("cart:add", function (e) {
            const d = e.detail || {};
            const qty = Number.isInteger(d.quantity) ? d.quantity : 1;
            for (let i = 0; i < qty; i++) {
                if (!addItem(d.name, d.color, d.price)) break;   // stop at the limit
            }
            openPanel(panel, cartIcon);
        });

        // ---------- Panels: the cart icon toggles the mini cart, the heart toggles the saved panel.
        //            Only one is open at a time.
        function openPanel(which, button) {
            closeAll();
            which.hidden = false;
            button.setAttribute("aria-expanded", "true");
        }

        function closeAll() {
            panel.hidden = true;
            cartIcon.setAttribute("aria-expanded", "false");
            if (savedPanel) {
                savedPanel.hidden = true;
                savedBtn.setAttribute("aria-expanded", "false");
            }
        }

        cartIcon.addEventListener("click", function (e) {
            e.preventDefault();               // the icon is a link to checkout.html (Task 2); JS shows the mini cart instead
            if (panel.hidden) {
                openPanel(panel, cartIcon);
            } else {
                closeAll();
            }
        });

        if (savedBtn && savedPanel) {
            savedBtn.addEventListener("click", function () {
                if (savedPanel.hidden) {
                    openPanel(savedPanel, savedBtn);
                } else {
                    closeAll();
                }
            });
        }

        // Close with Esc or a click outside the panels
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closeAll();
        });

        document.addEventListener("click", function (e) {
            const insidePanel = panel.contains(e.target) || (savedPanel && savedPanel.contains(e.target));
            const onButton = cartIcon.contains(e.target) || (savedBtn && savedBtn.contains(e.target));
            if (!insidePanel && !onButton) closeAll();
        });

        render();
    });
})();
