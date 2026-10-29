/**
 * js/data.js - Navigation taxonomy, product catalogue dataset, price formatting & shared UI helpers
 */
(function (root) {
    "use strict";

    // 1. Navigation Taxonomy Tree
    const NAV = [
        {
            id: "woman",
            label: "WOMAN",
            href: "#",
            columns: [
                {
                    heading: "WOMAN",
                    items: [
                        { label: "New In", href: "#" },
                        { label: "Fall Winter '26", href: "#" },
                        { label: "Tops & Blouses", href: "#" },
                        { label: "T-Shirts", href: "#" },
                        { label: "Dresses & Skirts", href: "#" },
                        { label: "Sweaters & Cardigans", href: "#" },
                        { label: "Jackets & Coats", href: "#" },
                        { label: "Blazers", href: "#" },
                        { label: "Bottoms", href: "#" },
                        { label: "Jeans", href: "#" },
                        { label: "Bodysuits", href: "#" },
                        { label: "Camisoles & Bandeaus", href: "#" },
                        { label: "Bras", href: "#" },
                        { label: "Briefs", href: "#" }
                    ]
                }
            ]
        },
        {
            id: "man",
            label: "MAN",
            href: "#",
            columns: [
                {
                    heading: "MAN",
                    items: [
                        { label: "New In", href: "#" },
                        { label: "Fall Winter '26", href: "#" },
                        { label: "Shirts", href: "#" },
                        { label: "T-Shirts", href: "#" },
                        { label: "Polo", href: "#" },
                        { label: "Sweaters & Cardigans", href: "#" },
                        { label: "Jackets & Coats", href: "#" },
                        { label: "Hoodies & Sweatshirts", href: "#" },
                        { label: "Blazers", href: "#" },
                        { label: "Tank Tops", href: "#" },
                        { label: "Bottoms", href: "#" },
                        { label: "Shorts", href: "#" },
                        { label: "Boxers", href: "#" }
                    ]
                }
            ]
        },
        {
            id: "shoes",
            label: "SHOES",
            href: "#",
            columns: [
                {
                    heading: "Woman",
                    items: [
                        { label: "New In", href: "#" },
                        { label: "Pumps", href: "#" },
                        { label: "Mules", href: "#" },
                        { label: "Sneakers", href: "#" },
                        { label: "Loafers", href: "#" },
                        { label: "Heels", href: "#" },
                        { label: "Lama Mama", href: "#" },
                        { label: "Sandals", href: "#" },
                        { label: "Slides", href: "#" }
                    ]
                },
                {
                    heading: "Man",
                    items: [
                        { label: "New In", href: "#" },
                        { label: "Boots", href: "#" },
                        { label: "Loafers", href: "#" },
                        { label: "Sneakers", href: "#" },
                        { label: "Lace-Ups", href: "#" },
                        { label: "Slides", href: "#" }
                    ]
                }
            ]
        },
        {
            id: "accessories",
            label: "ACCESSORIES",
            href: "#",
            columns: [
                {
                    heading: "Woman",
                    items: [
                        { label: "New In", href: "#" },
                        { label: "Handbags", href: "#" },
                        { label: "Belts", href: "#" },
                        { label: "Eyewear", href: "#" },
                        { label: "Socks", href: "#" },
                        { label: "Shoes Accessories", href: "#" }
                    ]
                },
                {
                    heading: "Man",
                    items: [
                        { label: "New In", href: "#" },
                        { label: "Belts", href: "#" },
                        { label: "Handbags", href: "#" },
                        { label: "Headwear", href: "#" },
                        { label: "Eyewear", href: "#" },
                        { label: "Socks", href: "#" },
                        { label: "Shoes Accessories", href: "#" }
                    ]
                }
            ]
        },
        {
            id: "fragrance-living",
            label: "FRAGRANCE & LIVING",
            href: "#",
            columns: [
                {
                    heading: "FRAGRANCE & LIVING",
                    items: [
                        { label: "Perfumes", href: "#" },
                        { label: "Candles", href: "#" },
                        { label: "Self-Care", href: "#" }
                    ]
                }
            ]
        },
        {
            id: "banana-road",
            label: "BANANA ROAD",
            href: "#"
        },
        {
            id: "egift-card",
            label: "E-GIFT CARD",
            href: "#"
        },
        {
            id: "clearance",
            label: "CLEARANCE",
            href: "#",
            columns: [
                {
                    heading: "CLEARANCE",
                    items: [
                        { label: "Woman", href: "#" },
                        { label: "Man", href: "#" }
                    ]
                }
            ]
        }
    ];

    // Real product photos (from pk.lamaretail.com) saved as assets/products/<slug>-<n>.jpg, 540x810
    function productImages(slug, count) {
        const images = [];
        for (let n = 1; n <= (count || 3); n++) {
            images.push(`./assets/products/${slug}-${n}.jpg`);
        }
        return images;
    }

    // 2. Product Data (names, prices and sizes from Section 2.3 of the Build Plan)
    const PRODUCTS = [
        // --- NEW ROW ---
        {
            id: "prod-new-1",
            name: "TIPPED EDGE SWEATER",
            price: 9950,
            color: "Beige",
            sizes: ["XS", "S", "M", "L", "XL"],
            images: productImages("tipped-edge-sweater-beige"),
            row: "new"
        },
        {
            id: "prod-new-2",
            name: "DAILY BOMBER",
            price: 12950,
            color: "Green",
            sizes: ["S", "M", "L", "XL", "XXL"],
            images: productImages("daily-bomber-green"),
            row: "new"
        },
        {
            id: "prod-new-3",
            name: "COMO PLEATED PANTS",
            price: 10950,
            color: "Brown",
            sizes: ["XS", "S", "M", "L", "XL"],
            images: productImages("como-pleated-pants-brown"),
            row: "new"
        },
        {
            id: "prod-new-4",
            name: "EVERYDAY GILET",
            price: 11950,
            color: "Black",
            sizes: ["S", "M", "L", "XL", "XXL"],
            images: productImages("everyday-gilet-black"),
            row: "new"
        },
        {
            id: "prod-new-5",
            name: "SILKY TRENCH STYLE COAT",
            price: 14950,
            color: "Brown",
            sizes: ["XS", "S", "M", "L", "XL"],
            images: productImages("silky-trench-style-coat-brown"),
            row: "new"
        },

        // --- SHOES ROW ---
        {
            id: "prod-shoes-1",
            name: "TANGO LONG STRAP HEELS",
            price: 8950,
            color: "Bronze",
            sizes: ["36", "37", "38", "39", "40", "41"],
            images: productImages("tango-long-strap-heels-bronze"),
            row: "shoes"
        },
        {
            id: "prod-shoes-2",
            name: "SUEDE CHUKKA BOOTS",
            price: 11950,
            color: "Taupe",
            sizes: ["40", "41", "42", "43", "44", "45", "46"],
            images: productImages("suede-chukka-boots-taupe"),
            row: "shoes"
        },
        {
            id: "prod-shoes-3",
            name: "CLASSIC LEATHER HEELS",
            price: 10950,
            color: "Wine",
            sizes: ["36", "37", "38", "39", "40", "41"],
            images: productImages("classic-leather-heels-wine"),
            row: "shoes"
        },
        {
            id: "prod-shoes-4",
            name: "RETRO LEATHER SNEAKERS",
            price: 12950,
            color: "Black",
            sizes: ["40", "41", "42", "43", "44", "45", "46"],
            images: productImages("retro-leather-sneakers-black"),
            row: "shoes"
        },
        {
            id: "prod-shoes-5",
            name: "JOELLE LEATHER PUMPS",
            price: 7450,
            color: "Camel",
            sizes: ["36", "37", "38", "39", "40", "41"],
            images: productImages("joelle-leather-pumps-camel"),
            row: "shoes"
        },

        // --- JACKETS & COATS ROW ---
        {
            id: "prod-jackets-1",
            name: "BOMBER JACKET",
            price: 13950,
            color: "Grey",
            sizes: ["S", "M", "L", "XL", "XXL"],
            images: productImages("bomber-jacket-grey"),
            row: "jackets"
        },
        {
            id: "prod-jackets-2",
            name: "WIND BREAKER",
            price: 13950,
            color: "Beige",
            sizes: ["S", "M", "L", "XL", "XXL"],
            images: productImages("wind-breaker-beige"),
            row: "jackets"
        },
        {
            id: "prod-jackets-3",
            name: "BASIC PUFFER GILET",
            price: 9950,
            color: "Khaki",
            sizes: ["S", "M", "L", "XL", "XXL"],
            images: productImages("basic-puffer-gilet-khaki"),
            row: "jackets"
        },
        {
            id: "prod-jackets-4",
            name: "DAILY BOMBER",
            price: 12950,
            color: "Green",
            sizes: ["S", "M", "L", "XL", "XXL"],
            images: productImages("daily-bomber-green"),
            row: "jackets"
        },
        {
            id: "prod-jackets-5",
            name: "EVERYDAY GILET",
            price: 11950,
            color: "Black",
            sizes: ["S", "M", "L", "XL", "XXL"],
            images: productImages("everyday-gilet-black"),
            row: "jackets"
        },

        // --- SWEATERS & CARDIGANS ROW ---
        {
            id: "prod-sweaters-1",
            name: "TAPESTRY JUMPER",
            price: 11950,
            color: "Navy Camel",
            sizes: ["XS", "S", "M", "L", "XL"],
            images: productImages("tapestry-jumper-navy-camel"),
            row: "sweaters"
        },
        {
            id: "prod-sweaters-2",
            name: "SHORT KNIT POLO",
            price: 8450,
            color: "Brown",
            sizes: ["XS", "S", "M", "L", "XL"],
            images: productImages("short-knit-polo-brown"),
            row: "sweaters"
        },
        {
            id: "prod-sweaters-3",
            name: "SHORT KNIT POLO",
            price: 8450,
            color: "Light Blue",
            sizes: ["XS", "S", "M", "L", "XL"],
            images: productImages("short-knit-polo-light-blue"),
            row: "sweaters"
        },
        {
            id: "prod-sweaters-4",
            name: "RIBBED BODYCON SWEATER",
            price: 6450,
            color: "Red",
            sizes: ["XS", "S", "M", "L", "XL"],
            images: productImages("ribbed-bodycon-sweater-red", 2),
            row: "sweaters"
        },
        {
            id: "prod-sweaters-5",
            name: "RIBBED BODYCON SWEATER",
            price: 6450,
            color: "Dark Brown",
            sizes: ["XS", "S", "M", "L", "XL"],
            images: productImages("ribbed-bodycon-sweater-dark-brown"),
            row: "sweaters"
        },

        // --- BAGS ROW ---
        {
            id: "prod-bags-1",
            name: "CONCERT CROSSBODY BAG",
            price: 11950,
            color: "Coffee",
            sizes: ["UNIVERSAL"],
            images: productImages("concert-crossbody-bag-coffee"),
            row: "bags"
        },
        {
            id: "prod-bags-2",
            name: "SUEDE LEATHER TOTE",
            price: 22950,
            color: "Brown",
            sizes: ["UNIVERSAL"],
            images: productImages("suede-leather-tote-brown"),
            row: "bags"
        },
        {
            id: "prod-bags-3",
            name: "LEATHER TRAVEL KIT",
            price: 7450,
            color: "Dark Brown",
            sizes: ["UNI"],
            images: productImages("leather-travel-kit-dark-brown"),
            row: "bags"
        },
        {
            id: "prod-bags-4",
            name: "LEATHER TRAVEL KIT",
            price: 8950,
            color: "Black",
            sizes: ["UNIVERSAL"],
            images: productImages("leather-travel-kit-black"),
            row: "bags"
        },
        {
            id: "prod-bags-5",
            name: "BRUNCH SHOULDER BAG",
            price: 11950,
            color: "Black",
            sizes: ["UNIVERSAL"],
            images: productImages("brunch-shoulder-bag-black"),
            row: "bags"
        }
    ];

    /**
     * Formats a number to Pakistani Rupee format (e.g. 9950 -> "Rs.9,950.00")
     * @param {number} n 
     * @returns {string}
     */
    function formatPrice(n) {
        if (typeof n !== "number" || Number.isNaN(n)) return "Rs.0.00";
        return "Rs." + n.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // 3. Shared UI helpers (used by menu.js, quick-add.js and cart.js)

    // Counts open overlays so closing one does not unlock scrolling while another is still open
    let scrollLocks = 0;

    function lockScroll() {
        scrollLocks += 1;
        document.body.classList.add("scroll-locked");
    }

    function unlockScroll() {
        scrollLocks = Math.max(0, scrollLocks - 1);
        if (scrollLocks === 0) document.body.classList.remove("scroll-locked");
    }

    const FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

    function getFocusable(container) {
        return Array.from(container.querySelectorAll(FOCUSABLE)).filter(function (el) {
            return el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
        });
    }

    /**
     * Keeps Tab / Shift+Tab cycling inside container. Call from a keydown listener while it is open.
     * @param {KeyboardEvent} e
     * @param {HTMLElement} container
     */
    function trapFocus(e, container) {
        if (e.key !== "Tab") return;
        const items = getFocusable(container);
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];

        if (!container.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    // Export to global namespace
    root.LAMA_DATA = {
        NAV: NAV,
        PRODUCTS: PRODUCTS,
        formatPrice: formatPrice
    };

    root.LAMA_UI = {
        lockScroll: lockScroll,
        unlockScroll: unlockScroll,
        trapFocus: trapFocus
    };

})(window);
