/**
 * js/products.js - Product card generation & horizontal scroll-snap category row renderer
 */
(function (root) {
    "use strict";

    const FALLBACK_IMAGE = "https://placehold.co/540x810?text=Product";

    /**
     * Renders a single product card component
     * @param {Object} product 
     * @returns {HTMLElement}
     */
    function renderProductCard(product) {
        const formatPrice = (root.LAMA_DATA && root.LAMA_DATA.formatPrice) || (n => "Rs." + n);

        const card = document.createElement("article");
        card.className = "product-card";
        card.dataset.productId = product.id;

        // 1. Image Box (4:5 Ratio)
        const imageBox = document.createElement("div");
        imageBox.className = "product-image-box";

        // Image track: desktop shows image 1 and fades to image 2 on hover;
        // touch screens get a swipeable scroll-snap carousel of all images (see product-card.css)
        const images = product.images.length > 0 ? product.images : [FALLBACK_IMAGE];
        const imageTrack = document.createElement("div");
        imageTrack.className = "product-image-track";

        images.forEach(function (src, i) {
            const img = document.createElement("img");
            img.className = "product-img";
            img.src = src;
            img.alt = i === 0 ? product.name : `${product.name} view ${i + 1}`;
            img.loading = "lazy";
            img.width = 540;
            img.height = 810;
            img.decoding = "async";
            img.onerror = function () {
                this.onerror = null;
                this.src = FALLBACK_IMAGE;
            };
            imageTrack.appendChild(img);
        });
        imageBox.appendChild(imageTrack);

        // Dots for the touch carousel (decorative; images are already announced by alt text)
        if (images.length > 1) {
            const dots = document.createElement("div");
            dots.className = "product-image-dots";
            dots.setAttribute("aria-hidden", "true");
            images.forEach(function (_, i) {
                const dot = document.createElement("span");
                dot.className = "product-image-dot" + (i === 0 ? " active" : "");
                dots.appendChild(dot);
            });
            imageBox.appendChild(dots);

            imageTrack.addEventListener("scroll", function () {
                const index = Math.round(imageTrack.scrollLeft / imageTrack.clientWidth);
                dots.querySelectorAll(".product-image-dot").forEach(function (dot, i) {
                    dot.classList.toggle("active", i === index);
                });
            }, { passive: true });
        }


        card.appendChild(imageBox);

        // 2. Product Meta Info
        const meta = document.createElement("div");
        meta.className = "product-meta";

        const title = document.createElement("h3");
        title.className = "product-title";
        const link = document.createElement("a");
        link.href = `product.html?id=${encodeURIComponent(product.id)}`;   // product.html reads ?id= (js/product-page.js)
        link.textContent = product.name;
        title.appendChild(link);

        const price = document.createElement("div");
        price.className = "product-price";
        price.textContent = formatPrice(product.price);

        const color = document.createElement("div");
        color.className = "product-color-label";
        color.textContent = product.color || "Standard";

        meta.append(title, price, color);

        // "Add to Cart" button (midterm Task 3): script.js listens for clicks on .btn-add-to-cart
        // and reads the product name and price from this card
        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "btn btn-dark btn-sm w-100 btn-add-to-cart";
        addBtn.textContent = "Add to Cart";
        meta.appendChild(addBtn);

        card.appendChild(meta);

        return card;
    }

    /**
     * Renders a category product section with optional banner and horizontal scroll carousel
     * @param {Object} config - Row configuration
     * @returns {HTMLElement}
     */
    function renderRow(config) {
        const section = document.createElement("section");
        section.className = "catalog-row-section";
        section.id = `section-${config.id}`;

        // Optional Banner Header
        if (config.banner) {
            const bannerWrap = document.createElement("div");
            bannerWrap.className = "category-banner";

            const picture = document.createElement("picture");
            
            // Mobile source
            if (config.banner.mobile) {
                const sourceMobile = document.createElement("source");
                sourceMobile.media = "(max-width: 767px)";
                sourceMobile.srcset = config.banner.mobile;
                picture.appendChild(sourceMobile);
            }

            // Desktop image
            const img = document.createElement("img");
            img.src = config.banner.desktop;
            img.alt = config.banner.title || config.title;
            img.width = 1920;
            img.height = 750;
            img.loading = "lazy";
            img.decoding = "async";
            picture.appendChild(img);

            bannerWrap.appendChild(picture);

            // Banner Overlay Text & CTA
            const overlay = document.createElement("div");
            overlay.className = "category-banner-overlay";

            if (config.banner.badge) {
                const badge = document.createElement("span");
                badge.className = "category-banner-badge";
                badge.textContent = config.banner.badge;
                overlay.appendChild(badge);
            }

            const bannerTitle = document.createElement("h2");
            bannerTitle.className = "category-banner-title";
            bannerTitle.textContent = config.banner.title || config.title;
            overlay.appendChild(bannerTitle);

            if (config.banner.subtitle) {
                const sub = document.createElement("p");
                sub.className = "category-banner-subtitle";
                sub.textContent = config.banner.subtitle;
                overlay.appendChild(sub);
            }

            if (config.banner.buttons) {
                const btnGroup = document.createElement("div");
                btnGroup.className = "category-banner-btns";
                config.banner.buttons.forEach(btnInfo => {
                    const b = document.createElement("a");
                    b.href = btnInfo.href || "#";
                    b.className = "btn btn-light";
                    b.textContent = btnInfo.label;
                    btnGroup.appendChild(b);
                });
                overlay.appendChild(btnGroup);
            }

            bannerWrap.appendChild(overlay);
            section.appendChild(bannerWrap);
        }

        // Section Content Container
        const container = document.createElement("div");
        container.className = "container";

        // Section Title Bar
        const headerBar = document.createElement("div");
        headerBar.className = "row-header-bar";

        const titleGroup = document.createElement("div");
        const titleEl = document.createElement("h2");
        titleEl.className = "row-main-title";
        titleEl.textContent = config.title;
        titleGroup.appendChild(titleEl);

        if (config.subtitle) {
            const subEl = document.createElement("span");
            subEl.className = "row-sub-title";
            subEl.textContent = config.subtitle;
            titleGroup.appendChild(subEl);
        }

        const viewAllLink = document.createElement("a");
        viewAllLink.className = "row-view-all-link";
        viewAllLink.href = config.viewAllHref || "#";
        viewAllLink.textContent = "View all";

        headerBar.append(titleGroup, viewAllLink);
        container.appendChild(headerBar);

        // Product Carousel Wrapper
        const carouselWrapper = document.createElement("div");
        carouselWrapper.className = "carousel-wrapper";

        const prevBtn = document.createElement("button");
        prevBtn.type = "button";
        prevBtn.className = "carousel-nav-btn carousel-nav-prev";
        prevBtn.innerHTML = "&#8249;";
        prevBtn.setAttribute("aria-label", `Previous ${config.title} products`);

        const nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.className = "carousel-nav-btn carousel-nav-next";
        nextBtn.innerHTML = "&#8250;";
        nextBtn.setAttribute("aria-label", `Next ${config.title} products`);

        // Bootstrap row that does not wrap (flex-nowrap) + row-cols-* = how many cards fit on screen:
        // 2 on phones, 3 from 768px, 4 from 992px, 5 from 1200px. The rest scroll sideways.
        const track = document.createElement("div");
        track.className = "carousel-track row flex-nowrap row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3";

        // Render Cards (each inside a Bootstrap column)
        config.products.forEach(p => {
            const col = document.createElement("div");
            col.className = "col";
            col.appendChild(renderProductCard(p));
            track.appendChild(col);
        });

        // Carousel arrow scroll behavior
        function updateArrowStates() {
            const maxScroll = track.scrollWidth - track.clientWidth;
            prevBtn.disabled = track.scrollLeft <= 5;
            nextBtn.disabled = track.scrollLeft >= maxScroll - 5;
        }

        // Scroll by one column (card + Bootstrap gutter) so every click lands on a snap point
        function getStep() {
            const col = track.firstElementChild;
            return col ? col.getBoundingClientRect().width : track.clientWidth;
        }

        prevBtn.addEventListener("click", () => {
            track.scrollBy({ left: -getStep(), behavior: "smooth" });
        });

        nextBtn.addEventListener("click", () => {
            track.scrollBy({ left: getStep(), behavior: "smooth" });
        });

        track.addEventListener("scroll", updateArrowStates, { passive: true });
        window.addEventListener("resize", updateArrowStates);
        requestAnimationFrame(updateArrowStates);

        carouselWrapper.append(prevBtn, track, nextBtn);
        container.appendChild(carouselWrapper);

        // Bottom CTA Button (e.g. "View all 259 products")
        if (config.bottomCountText) {
            const bottomAction = document.createElement("div");
            bottomAction.className = "row-bottom-action";

            const btn = document.createElement("a");
            btn.className = "btn btn-outline-dark";
            btn.href = config.viewAllHref || "#";
            btn.textContent = config.bottomCountText;

            bottomAction.appendChild(btn);
            container.appendChild(bottomAction);
        }

        section.appendChild(container);
        return section;
    }

    // Attach to root
    root.LAMA_Products = {
        renderProductCard: renderProductCard,
        renderRow: renderRow
    };

})(window);
