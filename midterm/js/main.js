/**
 * js/main.js - Application bootstrap, homepage row orchestration & intersection animations
 */
(function (root) {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        const productsData = (root.LAMA_DATA && root.LAMA_DATA.PRODUCTS) || [];
        const renderRow = root.LAMA_Products && root.LAMA_Products.renderRow;
        const catalogContainer = document.getElementById("homepageCatalogRows");

        if (!catalogContainer || !renderRow || productsData.length === 0) return;

        // Group products by row identifier
        const rowsConfig = [
            // 1. "New" row sits directly under hero
            {
                id: "new",
                title: "New",
                subtitle: "",
                viewAllHref: "#new-all",
                bottomCountText: "View all 259 products",
                products: productsData.filter(p => p.row === "new")
            },
            // 2. SHOES Row with Banner
            {
                id: "shoes",
                title: "SHOES",
                subtitle: "WEARING NOW",
                viewAllHref: "#shoes-all",
                bottomCountText: "View all 83 products",
                banner: {
                    desktop: "./assets/banners/shoes-desktop.jpg",
                    mobile: "./assets/banners/shoes-mobile.jpg",
                    badge: "NEW",
                    title: "SHOES",
                    subtitle: "WEARING NOW",
                    buttons: [
                        { label: "Shop Woman", href: "#shoes-woman" },
                        { label: "Shop Man", href: "#shoes-man" }
                    ]
                },
                products: productsData.filter(p => p.row === "shoes")
            },
            // 3. JACKETS & COATS Row with Banner
            {
                id: "jackets",
                title: "JACKETS & COATS",
                subtitle: "",
                viewAllHref: "#jackets-all",
                bottomCountText: "View all 28 products",
                banner: {
                    desktop: "./assets/banners/jackets-desktop.jpg",
                    mobile: "./assets/banners/jackets-mobile.jpg",
                    badge: "NEW",
                    title: "JACKETS & COATS",
                    buttons: [
                        { label: "Shop Woman", href: "#jackets-woman" },
                        { label: "Shop Man", href: "#jackets-man" }
                    ]
                },
                products: productsData.filter(p => p.row === "jackets")
            },
            // 4. SWEATERS & CARDIGANS Row with Banner
            {
                id: "sweaters",
                title: "SWEATERS & CARDIGANS",
                subtitle: "",
                viewAllHref: "#sweaters-all",
                bottomCountText: "View all 12 products",
                banner: {
                    desktop: "./assets/banners/sweaters-desktop.jpg",
                    mobile: "./assets/banners/sweaters-mobile.jpg",
                    badge: "NEW",
                    title: "SWEATERS & CARDIGANS",
                    buttons: [
                        { label: "Shop Woman", href: "#sweaters-woman" },
                        { label: "Shop Man", href: "#sweaters-man" }
                    ]
                },
                products: productsData.filter(p => p.row === "sweaters")
            },
            // 5. BAGS Row with Banner
            {
                id: "bags",
                title: "BAGS",
                subtitle: "",
                viewAllHref: "#bags-all",
                bottomCountText: "View all 42 products",
                banner: {
                    desktop: "./assets/banners/bags-desktop.jpg",
                    mobile: "./assets/banners/bags-mobile.jpg",
                    badge: "NEW",
                    title: "BAGS",
                    buttons: [
                        { label: "Shop Woman", href: "#bags-woman" }
                    ]
                },
                products: productsData.filter(p => p.row === "bags")
            }
        ];

        // Render each category row
        catalogContainer.innerHTML = "";
        rowsConfig.forEach(cfg => {
            const rowElement = renderRow(cfg);
            catalogContainer.appendChild(rowElement);
        });

        // IntersectionObserver for smooth fade-in
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        obs.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: "0px 0px -50px 0px",
                threshold: 0.1
            });

            document.querySelectorAll(".catalog-row-section").forEach(sec => {
                observer.observe(sec);
            });
        } else {
            document.querySelectorAll(".catalog-row-section").forEach(sec => {
                sec.classList.add("is-visible");
            });
        }
    });

})(window);
