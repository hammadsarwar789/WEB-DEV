/**
 * js/menu.js - Desktop mega menu rendering, mobile accordion drawer & search overlay
 */
(function (root) {
    "use strict";

    const OPEN_DELAY = 80;
    const CLOSE_DELAY = 150;

    document.addEventListener("DOMContentLoaded", function () {
        const navData = (root.LAMA_DATA && root.LAMA_DATA.NAV) || [];
        const ui = root.LAMA_UI;

        // DOM Targets
        const desktopNavContainer = document.getElementById("desktopNavList");
        const mobileDrawerNav = document.getElementById("mobileDrawerNav");
        const hamburgerBtn = document.getElementById("mobileMenuBtn");
        const drawerCloseBtn = document.getElementById("mobileDrawerClose");
        const drawerBackdrop = document.getElementById("mobileDrawerBackdrop");
        const mobileDrawer = document.getElementById("mobileDrawer");

        const searchTriggerBtn = document.getElementById("searchTriggerBtn");
        const searchOverlay = document.getElementById("searchOverlay");
        const searchCloseBtn = document.getElementById("searchCloseBtn");
        const searchInput = document.getElementById("searchInput");
        const searchForm = document.getElementById("searchForm");
        const siteHeader = document.querySelector(".site-header");

        // 1. Render Desktop Mega Menu
        const megaItems = [];

        function closeAllMega(except) {
            megaItems.forEach(function (m) {
                if (m !== except) m.close();
            });
        }

        if (desktopNavContainer && navData.length > 0) {
            desktopNavContainer.innerHTML = "";

            navData.forEach(function (item) {
                const li = document.createElement("li");
                li.className = "nav-item";

                const a = document.createElement("a");
                a.className = "nav-link";
                a.href = item.href || "#";
                a.textContent = item.label;

                if (item.columns && item.columns.length > 0) {
                    const dropdownId = "mega-" + item.id;
                    a.setAttribute("aria-haspopup", "true");
                    a.setAttribute("aria-expanded", "false");
                    a.setAttribute("aria-controls", dropdownId);

                    const dropdown = document.createElement("div");
                    dropdown.id = dropdownId;
                    dropdown.className = "mega-dropdown" + (item.columns.length > 1 ? " multi-col" : "");

                    item.columns.forEach(function (col) {
                        const colDiv = document.createElement("div");
                        colDiv.className = "mega-col";

                        const heading = document.createElement("div");
                        heading.className = "mega-col-heading";
                        heading.textContent = col.heading;
                        colDiv.appendChild(heading);

                        const ul = document.createElement("ul");
                        ul.className = "mega-sublist";

                        col.items.forEach(function (sub) {
                            const subLi = document.createElement("li");
                            const subA = document.createElement("a");
                            subA.href = sub.href || "#";
                            subA.textContent = sub.label;
                            subLi.appendChild(subA);
                            ul.appendChild(subLi);
                        });

                        colDiv.appendChild(ul);
                        dropdown.appendChild(colDiv);
                    });

                    li.appendChild(a);
                    li.appendChild(dropdown);

                    // Open / close with small delays so moving the mouse across items does not flicker
                    let openTimer = null;
                    let closeTimer = null;

                    const mega = {
                        link: a,
                        isOpen: function () {
                            return dropdown.classList.contains("open");
                        },
                        open: function () {
                            clearTimeout(closeTimer);
                            closeAllMega(mega);
                            a.setAttribute("aria-expanded", "true");
                            dropdown.classList.add("open");
                        },
                        close: function () {
                            clearTimeout(openTimer);
                            clearTimeout(closeTimer);
                            a.setAttribute("aria-expanded", "false");
                            dropdown.classList.remove("open");
                        }
                    };
                    megaItems.push(mega);

                    li.addEventListener("mouseenter", function () {
                        clearTimeout(closeTimer);
                        openTimer = setTimeout(mega.open, OPEN_DELAY);
                    });

                    li.addEventListener("mouseleave", function () {
                        clearTimeout(openTimer);
                        closeTimer = setTimeout(mega.close, CLOSE_DELAY);
                    });

                    // Keyboard: Tab onto a sub-link opens the panel; Enter / Space on the top link toggles it
                    li.addEventListener("focusin", function (e) {
                        if (e.target !== a) mega.open();
                    });

                    a.addEventListener("keydown", function (e) {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            if (mega.isOpen()) {
                                mega.close();
                            } else {
                                mega.open();
                            }
                        }
                    });

                    li.addEventListener("focusout", function (e) {
                        if (!li.contains(e.relatedTarget)) mega.close();
                    });

                } else {
                    li.appendChild(a);
                }

                desktopNavContainer.appendChild(li);
            });

            // Click outside closes any open panel
            document.addEventListener("click", function (e) {
                if (!desktopNavContainer.contains(e.target)) closeAllMega();
            });
        }

        // 2. Render Mobile Accordion Drawer
        if (mobileDrawerNav && navData.length > 0) {
            mobileDrawerNav.innerHTML = "";

            navData.forEach(function (item) {
                const itemDiv = document.createElement("div");
                itemDiv.className = "mobile-accordion-item";

                if (item.columns && item.columns.length > 0) {
                    const panelId = "mobile-panel-" + item.id;

                    const trigger = document.createElement("button");
                    trigger.type = "button";
                    trigger.className = "mobile-accordion-trigger";
                    trigger.setAttribute("aria-expanded", "false");
                    trigger.setAttribute("aria-controls", panelId);

                    const labelSpan = document.createElement("span");
                    labelSpan.textContent = item.label;

                    const iconSpan = document.createElement("span");
                    iconSpan.className = "mobile-accordion-icon";
                    iconSpan.setAttribute("aria-hidden", "true");
                    iconSpan.textContent = "+";

                    trigger.append(labelSpan, iconSpan);

                    const panel = document.createElement("div");
                    panel.id = panelId;
                    panel.className = "mobile-accordion-panel";

                    item.columns.forEach(function (col) {
                        if (item.columns.length > 1) {
                            const groupHeader = document.createElement("div");
                            groupHeader.className = "mobile-group-heading";
                            groupHeader.textContent = col.heading;
                            panel.appendChild(groupHeader);
                        }

                        const ul = document.createElement("ul");
                        ul.className = "mobile-sublist";

                        col.items.forEach(function (sub) {
                            const subLi = document.createElement("li");
                            const subA = document.createElement("a");
                            subA.href = sub.href || "#";
                            subA.textContent = sub.label;
                            subLi.appendChild(subA);
                            ul.appendChild(subLi);
                        });

                        panel.appendChild(ul);
                    });

                    // Accordion click (one open at a time)
                    trigger.addEventListener("click", function () {
                        const isOpen = panel.classList.contains("open");

                        // Close all sibling accordion panels
                        const allPanels = mobileDrawerNav.querySelectorAll(".mobile-accordion-panel");
                        const allTriggers = mobileDrawerNav.querySelectorAll(".mobile-accordion-trigger");
                        const allItems = mobileDrawerNav.querySelectorAll(".mobile-accordion-item");

                        allPanels.forEach(p => p.classList.remove("open"));
                        allTriggers.forEach(t => t.setAttribute("aria-expanded", "false"));
                        allItems.forEach(i => i.classList.remove("open"));

                        if (!isOpen) {
                            panel.classList.add("open");
                            trigger.setAttribute("aria-expanded", "true");
                            itemDiv.classList.add("open");
                        }
                    });

                    itemDiv.append(trigger, panel);
                } else {
                    const singleA = document.createElement("a");
                    singleA.className = "mobile-accordion-trigger";
                    singleA.href = item.href || "#";
                    singleA.textContent = item.label;
                    itemDiv.appendChild(singleA);
                }

                mobileDrawerNav.appendChild(itemDiv);
            });
        }

        // 3. Mobile Drawer Open / Close Controls & Focus Trap
        function isDrawerOpen() {
            return Boolean(mobileDrawer && mobileDrawer.classList.contains("open"));
        }

        function openMobileDrawer() {
            if (!mobileDrawer || !drawerBackdrop || isDrawerOpen()) return;
            mobileDrawer.classList.add("open");
            drawerBackdrop.classList.add("active");
            ui.lockScroll();
            if (hamburgerBtn) hamburgerBtn.setAttribute("aria-expanded", "true");
            if (drawerCloseBtn) drawerCloseBtn.focus();
        }

        function closeMobileDrawer() {
            if (!isDrawerOpen()) return;
            mobileDrawer.classList.remove("open");
            drawerBackdrop.classList.remove("active");
            ui.unlockScroll();
            if (hamburgerBtn) {
                hamburgerBtn.setAttribute("aria-expanded", "false");
                hamburgerBtn.focus();
            }
        }

        if (hamburgerBtn) hamburgerBtn.addEventListener("click", openMobileDrawer);
        if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeMobileDrawer);
        if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeMobileDrawer);

        if (mobileDrawer) {
            mobileDrawer.addEventListener("keydown", function (e) {
                ui.trapFocus(e, mobileDrawer);
            });
        }

        // Drawer is mobile-only: close it if the window grows to desktop width while open
        const desktopQuery = window.matchMedia("(min-width: 1024px)");
        desktopQuery.addEventListener("change", function (e) {
            if (e.matches) closeMobileDrawer();
        });

        // 4. Search Overlay
        function openSearch() {
            if (searchOverlay) {
                searchOverlay.classList.add("open");
                if (searchTriggerBtn) searchTriggerBtn.setAttribute("aria-expanded", "true");
                setTimeout(function () {
                    if (searchInput) searchInput.focus();
                }, 100);
            }
        }

        function closeSearch() {
            if (searchOverlay) {
                searchOverlay.classList.remove("open");
                if (searchTriggerBtn) {
                    searchTriggerBtn.setAttribute("aria-expanded", "false");
                    searchTriggerBtn.focus();
                }
            }
        }

        if (searchTriggerBtn) {
            searchTriggerBtn.addEventListener("click", function () {
                if (searchOverlay && searchOverlay.classList.contains("open")) {
                    closeSearch();
                } else {
                    openSearch();
                }
            });
        }
        if (searchCloseBtn) searchCloseBtn.addEventListener("click", closeSearch);

        if (searchForm) {
            searchForm.addEventListener("submit", function (e) {
                e.preventDefault();
                const q = searchInput ? searchInput.value.trim() : "";
                console.log("[LAMA Search Query Submitted]:", q);
                closeSearch();
            });
        }

        // 5. Global Keyboard Handling (Esc closes open overlays)
        window.addEventListener("keydown", function (e) {
            if (e.key !== "Escape") return;

            if (isDrawerOpen()) {
                closeMobileDrawer();
            }
            if (searchOverlay && searchOverlay.classList.contains("open")) {
                closeSearch();
            }

            const openMega = megaItems.find(m => m.isOpen());
            if (openMega) {
                openMega.close();
                // Return focus to the top-level link if focus was inside the panel
                if (desktopNavContainer.contains(document.activeElement)) openMega.link.focus();
            }
        });

        // 6. Header Scroll Shadow
        window.addEventListener("scroll", function () {
            if (siteHeader) {
                siteHeader.classList.toggle("scrolled", window.scrollY > 20);
            }
        }, { passive: true });

    });

})(window);
