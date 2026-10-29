/**
 * js/slider.js - Reusable vanilla Slider class with autoplay, touch swipe, dots & reduced-motion support
 */
(function (root) {
    "use strict";

    class Slider {
        constructor(options) {
            this.container = typeof options.container === "string" 
                ? document.querySelector(options.container) 
                : options.container;

            if (!this.container) return;

            this.slides = this.container.querySelectorAll(options.slidesSelector || ".slide");
            if (this.slides.length === 0) return;

            this.currentIndex = 0;
            this.totalSlides = this.slides.length;
            this.intervalDuration = options.interval || 5000;
            this.loop = options.loop !== undefined ? options.loop : true;
            this.pauseOnHover = options.pauseOnHover !== undefined ? options.pauseOnHover : true;
            this.onSlideChange = options.onSlideChange || null;

            // Accessibility: Respect prefers-reduced-motion (no autoplay for those users)
            const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
            this.reducedMotion = mediaQuery.matches;

            // autoplay = the user's/config's wish; the timer is paused separately while hovered
            this.autoplay = !this.reducedMotion && Boolean(options.autoplay);
            this.timer = null;

            // Nav Controls
            this.prevBtn = options.prevBtn 
                ? (typeof options.prevBtn === "string" ? document.querySelector(options.prevBtn) : options.prevBtn)
                : null;
            this.nextBtn = options.nextBtn 
                ? (typeof options.nextBtn === "string" ? document.querySelector(options.nextBtn) : options.nextBtn)
                : null;
            this.dotsContainer = options.dotsContainer
                ? (typeof options.dotsContainer === "string" ? document.querySelector(options.dotsContainer) : options.dotsContainer)
                : null;

            this.init();
        }

        init() {
            this.renderDots();
            this.goTo(0);
            this.bindEvents();

            this.restartTimer();
        }

        goTo(index) {
            if (index < 0) {
                index = this.loop ? this.totalSlides - 1 : 0;
            } else if (index >= this.totalSlides) {
                index = this.loop ? 0 : this.totalSlides - 1;
            }

            this.currentIndex = index;

            this.slides.forEach((slide, i) => {
                if (i === this.currentIndex) {
                    slide.classList.add("active");
                    slide.setAttribute("aria-hidden", "false");
                } else {
                    slide.classList.remove("active");
                    slide.setAttribute("aria-hidden", "true");
                }
            });

            this.updateDots();

            if (typeof this.onSlideChange === "function") {
                this.onSlideChange(this.currentIndex);
            }
        }

        next() {
            this.goTo(this.currentIndex + 1);
        }

        prev() {
            this.goTo(this.currentIndex - 1);
        }

        // (Re)starts the interval if autoplay is on; used after manual navigation and on mouseleave
        restartTimer() {
            this.stopTimer();
            if (!this.autoplay) return;
            this.timer = setInterval(() => {
                this.next();
            }, this.intervalDuration);
        }

        stopTimer() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }

        // Returns true if the slider is now playing
        toggleAutoplay() {
            this.autoplay = !this.autoplay;
            this.restartTimer();
            return this.autoplay;
        }

        renderDots() {
            if (!this.dotsContainer || this.totalSlides <= 1) return;
            this.dotsContainer.innerHTML = "";

            for (let i = 0; i < this.totalSlides; i++) {
                const dot = document.createElement("button");
                dot.type = "button";
                dot.className = "slider-dot" + (i === 0 ? " active" : "");
                dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
                dot.addEventListener("click", () => {
                    this.goTo(i);
                    this.restartTimer();
                });
                this.dotsContainer.appendChild(dot);
            }
        }

        updateDots() {
            if (!this.dotsContainer) return;
            const dots = this.dotsContainer.querySelectorAll(".slider-dot");
            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === this.currentIndex);
                dot.setAttribute("aria-current", i === this.currentIndex ? "true" : "false");
            });
        }

        bindEvents() {
            if (this.prevBtn) {
                this.prevBtn.addEventListener("click", () => {
                    this.prev();
                    this.restartTimer();
                });
            }

            if (this.nextBtn) {
                this.nextBtn.addEventListener("click", () => {
                    this.next();
                    this.restartTimer();
                });
            }

            // Pause on hover
            if (this.pauseOnHover) {
                this.container.addEventListener("mouseenter", () => this.stopTimer());
                this.container.addEventListener("mouseleave", () => this.restartTimer());
            }

            // Touch Swipe Support
            let startX = 0;
            let endX = 0;

            this.container.addEventListener("touchstart", (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });

            this.container.addEventListener("touchend", (e) => {
                endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                if (Math.abs(diff) > 40) {
                    if (diff > 0) {
                        this.next();
                    } else {
                        this.prev();
                    }
                    this.restartTimer();
                }
            }, { passive: true });

            // Keyboard Arrow Support when focused
            this.container.addEventListener("keydown", (e) => {
                if (e.key === "ArrowLeft") {
                    this.prev();
                    this.restartTimer();
                } else if (e.key === "ArrowRight") {
                    this.next();
                    this.restartTimer();
                }
            });
        }
    }

    // Attach to root
    root.LAMA_Slider = Slider;

    // Initialize Page Sliders on DOMContentLoaded
    document.addEventListener("DOMContentLoaded", () => {
        // 1. Announcement Bar Slider
        const announcementContainer = document.querySelector(".announcement-slider");

        // Rotates on its own; pauses while hovered and stays still under prefers-reduced-motion
        if (announcementContainer) {
            new Slider({
                container: announcementContainer,
                slidesSelector: ".announcement-slide",
                autoplay: true,
                interval: 4000,
                loop: true
            });
        }

        // 2. Hero Video: autoplays via HTML; keep it still for users who prefer reduced motion
        const heroVideo = document.querySelector(".hero-video");
        if (heroVideo && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            heroVideo.removeAttribute("autoplay");
            heroVideo.pause();
        }
    });

})(window);
