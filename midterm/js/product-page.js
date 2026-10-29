/**
 * js/product-page.js - Product detail page: shows the product from ?id=, photo gallery, size, quantity & Add to Cart
 */
(function (root) {
    "use strict";

    // Homepage row -> category name used in the breadcrumb and description
    const CATEGORIES = {
        new: "New In",
        shoes: "Shoes",
        jackets: "Jackets & Coats",
        sweaters: "Sweaters & Cardigans",
        bags: "Bags"
    };

    const FIT_NOTES = {
        shoes: "EU sizes. If you are between two sizes, choose the larger one.",
        bags: "One size.",
        other: "Regular fit – choose your usual size."
    };

    const QTY_MIN = 1;
    const QTY_MAX = 10;
    const FALLBACK_IMAGE = "https://placehold.co/540x810?text=Product";

    document.addEventListener("DOMContentLoaded", function () {
        const data = root.LAMA_DATA;
        const form = document.getElementById("productForm");
        if (!data || !form) return; // not on product.html

        const formatPrice = data.formatPrice;
        const products = data.PRODUCTS;

        // 1. Which product? product.html?id=prod-new-1 (no or unknown id = first product)
        const params = new URLSearchParams(window.location.search);
        const product = products.find(p => p.id === params.get("id")) || products[0];
        const category = CATEGORIES[product.row] || "Shop";

        function setText(id, text) {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        }

        // 2. Text content
        document.title = `${product.name} – Lama Retail`;
        setText("productName", product.name);
        setText("productBreadcrumbName", product.name);
        setText("productPrice", formatPrice(product.price));
        setText("productInstallment", formatPrice(product.price / 3));
        setText("productColour", product.color);
        setText("productDescription",
            `${product.name} in ${product.color}. Part of LAMA's ${category} edit for Fall Winter '26 – easy to style and made to be worn every day.`);
        setText("productFit", FIT_NOTES[product.row] || FIT_NOTES.other);

        const categoryLink = document.getElementById("productCategoryLink");
        if (categoryLink) {
            categoryLink.textContent = category;
            categoryLink.href = `index.html#section-${product.row}`;
        }

        // 3. Photo gallery: one thumbnail button per photo; clicking it swaps the big photo
        const mainImage = document.getElementById("productMainImage");
        const thumbs = document.getElementById("productThumbs");

        mainImage.onerror = function () {
            this.onerror = null;
            this.src = FALLBACK_IMAGE;
        };

        function showPhoto(index) {
            mainImage.src = product.images[index];
            mainImage.alt = `${product.name} in ${product.color}, photo ${index + 1} of ${product.images.length}`;
            thumbs.querySelectorAll(".gallery-thumb").forEach((btn, i) => {
                btn.setAttribute("aria-current", i === index ? "true" : "false");
            });
        }

        thumbs.innerHTML = "";
        product.images.forEach((src, i) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "gallery-thumb";
            btn.setAttribute("aria-label", `Show photo ${i + 1}`);

            const img = document.createElement("img");
            img.src = src;
            img.alt = "";
            img.width = 540;
            img.height = 810;
            img.loading = "lazy";

            btn.appendChild(img);
            btn.addEventListener("click", () => showPhoto(i));
            thumbs.appendChild(btn);
        });
        showPhoto(0);

        // 4. Size buttons: Bootstrap .btn-check radios, one per size in the data
        const sizesBox = document.getElementById("productSizes");
        const sizeError = document.getElementById("productSizeError");

        sizesBox.innerHTML = "";
        product.sizes.forEach((size, i) => {
            const input = document.createElement("input");
            input.type = "radio";
            input.className = "btn-check";
            input.name = "size";
            input.id = `size-${i}`;
            input.value = size;
            input.addEventListener("change", () => {
                sizeError.hidden = true;
            });

            const label = document.createElement("label");
            label.className = "btn btn-outline-dark size-btn";
            label.htmlFor = input.id;
            label.textContent = size;

            sizesBox.append(input, label);
        });

        // One-size products (bags) don't need a choice
        if (product.sizes.length === 1) {
            sizesBox.querySelector("input").checked = true;
        }

        // 5. Quantity: - / + buttons or typing, always kept between 1 and 10
        const qtyInput = document.getElementById("productQty");

        function setQty(n) {
            const value = Number.isFinite(n) ? n : QTY_MIN;
            qtyInput.value = Math.min(QTY_MAX, Math.max(QTY_MIN, value));
        }

        document.getElementById("qtyMinus").addEventListener("click", () => setQty(parseInt(qtyInput.value, 10) - 1));
        document.getElementById("qtyPlus").addEventListener("click", () => setQty(parseInt(qtyInput.value, 10) + 1));
        qtyInput.addEventListener("change", () => setQty(parseInt(qtyInput.value, 10)));

        // 6. Add to Cart: needs a size, then sends the same "cart:add" event as the quick-add panel
        //    (cart.js listens, adds the item and opens the cart drawer)
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const chosen = form.querySelector('input[name="size"]:checked');
            if (!chosen) {
                sizeError.hidden = false;
                sizesBox.querySelector("input").focus();
                return;
            }

            setQty(parseInt(qtyInput.value, 10));
            window.dispatchEvent(new CustomEvent("cart:add", {
                detail: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    color: product.color,
                    size: chosen.value,
                    image: product.images[0],
                    quantity: parseInt(qtyInput.value, 10)
                }
            }));
        });

        // 7. "You may also like": up to 4 other products from the same row, in the Bootstrap grid
        const related = document.getElementById("relatedProducts");
        const renderProductCard = root.LAMA_Products && root.LAMA_Products.renderProductCard;

        if (related && renderProductCard) {
            products
                .filter(p => p.row === product.row && p.id !== product.id)
                .slice(0, 4)
                .forEach(p => {
                    const col = document.createElement("div");
                    col.className = "col";
                    col.appendChild(renderProductCard(p));
                    related.appendChild(col);
                });
        }
    });

})(window);
