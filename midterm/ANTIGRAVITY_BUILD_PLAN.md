# Lama Retail Replica — Antigravity Build Plan

Build a front-end replica of https://pk.lamaretail.com/ using **plain HTML, CSS and JavaScript only** (no frameworks, no build tools), in 10 small phases.

---

## 0. How to use this plan

1. Open your project folder (the one containing the `assets/` folder you downloaded) in Antigravity.
2. Paste the **MASTER PROMPT** (section 1) into the agent chat first. Wait for it to confirm.
3. Then paste **one phase prompt at a time**, in order. Do not skip ahead.
4. After each phase: open `index.html` in the browser, run through that phase's **Acceptance checklist**, and only then move on.
5. If a phase goes wrong, paste: `Fix only the issues below, do not touch other files: <describe the issue>`.
6. Commit after every phase (`git init` once, then `git add . && git commit -m "phase N"`), so you can roll back.

Tip: ask the agent to open the live site in its browser whenever it needs to compare against the original.

---

## 1. MASTER PROMPT (paste first)

```text
You are building a pixel-close front-end replica of https://pk.lamaretail.com/ (a fashion e-commerce homepage) for a learning/portfolio project.

TECH RULES
- Plain HTML5, CSS3 and vanilla JavaScript (ES6+). NO frameworks, NO npm, NO build step, NO jQuery.
- Must work by double-clicking index.html (no server needed). Use classic <script src> tags, not ES modules.
- Mobile-first responsive. Breakpoints: 480px, 768px, 1024px, 1280px.
- Semantic HTML, accessible (alt text, aria-labels, aria-expanded on toggles, keyboard focus styles, Esc closes overlays).
- Use CSS custom properties for all colors, fonts, spacing in css/base.css.
- No inline styles, no inline event handlers. Keep JS in separate files, each wrapped in an IIFE.
- Comment each file's top with a one-line purpose.

PROJECT STRUCTURE (create exactly this)
lama-replica/
  index.html
  css/ base.css, header.css, hero.css, product-card.css, sections.css, cart.css, footer.css, responsive.css
  js/  data.js, menu.js, slider.js, products.js, quick-add.js, cart.js, footer.js, main.js
  assets/ logo/, banners/, icons/, scanned/ (already exist - use the files in them)

ASSETS
- Real logo, banner and icon files are already in /assets. Use them. List the folder first and map each file to where it will be used.
- Product images are DUMMY: use https://picsum.photos/540/720?random=N (N unique per image) with an onerror fallback to https://placehold.co/540x720?text=Product.

DESIGN TOKENS
- Before writing CSS, open https://pk.lamaretail.com/ in your browser and read the computed font-family, font sizes, letter-spacing, colors and spacing for: announcement bar, header/menu links, section titles, product name/price, buttons, footer. Put them in :root variables in css/base.css. Theme color is #111111. If the font is a custom/Shopify font, pick the closest Google Font and note it.

WORKING STYLE
- Work in the phases I give you, ONE phase per message. Only touch the files named in the phase.
- At the end of each phase reply with: files changed, what to test, and any assumptions.
- Never leave TODO placeholders for the current phase. Code must run.
- Do not add features I did not ask for.

Confirm you understand, list the files currently in /assets, and wait for Phase 1.
```

---

## 2. Shared reference data (the agent will need this)

### 2.1 Navigation tree (for `js/data.js` → `NAV`)

```text
WOMAN: New In, Fall Winter '26, Tops & Blouses, T-Shirts, Dresses & Skirts, Sweaters & Cardigans, Jackets & Coats, Blazers, Bottoms, Jeans, Bodysuits, Camisoles & Bandeaus, Bras, Briefs
MAN: New In, Fall Winter '26, Shirts, T-Shirts, Polo, Sweaters & Cardigans, Jackets & Coats, Hoodies & Sweatshirts, Blazers, Tank Tops, Bottoms, Shorts, Boxers
SHOES:
  Woman: New In, Pumps, Mules, Sneakers, Loafers, Heels, Lama Mama, Sandals, Slides
  Man: New In, Boots, Loafers, Sneakers, Lace-Ups, Slides
ACCESSORIES:
  Woman: New In, Handbags, Belts, Eyewear, Socks, Shoes Accessories
  Man: New In, Belts, Handbags, Headwear, Eyewear, Socks, Shoes Accessories
FRAGRANCE & LIVING: Perfumes, Candles, Self-Care
BANANA ROAD (single link)
E-GIFT CARD (single link)
CLEARANCE: Woman, Man
```
Links can be `#` (this is a front-end replica).

### 2.2 Page sections, top to bottom

1. Announcement bar: "FREE SHIPPING ON ORDERS ABOVE RS. 2500" with pause/play control
2. Header: logo, menu, Search / Log in / Cart (with count badge)
3. Hero slideshow: title "A THEORY OF COMPANY", buttons "Shop Woman" / "Shop Man"
4. "New" product row (7 products) + "View all 259 products"
5. Banner row **SHOES** ("NEW", subtitle "WEARING NOW", buttons shop woman / shop man) + 6 products + "View all 83 products"
6. Banner row **JACKETS & COATS** + 6 products + "View all 28 products"
7. Banner row **SWEATERS & CARDIGANS** + 6 products + "View all 12 products"
8. Banner row **BAGS** + 6 products + "View all 42 products"
9. Footer

### 2.3 Dummy product data (for `js/data.js` → `PRODUCTS`)

Each product object:
```text
{ id, name, price (number), color, sizes: [..], images: [img1, img2, img3], row: "new|shoes|jackets|sweaters|bags" }
```
Use these names, prices (Rs.) and sizes:

```text
NEW ROW
Tipped Edge Sweater 9950 Beige  XS-XL
Daily Bomber 12950 Green  S-XXL
Como Pleated Pants 10950 Brown  XS-XL
Everyday Gilet 11950 Black  S-XXL
Silky Trench Style Coat 14950 Brown  XS-XL

SHOES ROW
Tango Long Strap Heels 8950 Bronze  36-41
Suede Chukka Boots 11950 Taupe  40-46
Classic Leather Heels 10950 Wine  36-41
Retro Leather Sneakers 12950 Black  40-46
Joelle Leather Pumps 7450 Camel  36-41

JACKETS & COATS ROW
Bomber Jacket 13950 Grey  S-XXL
Wind Breaker 13950 Beige  S-XXL
Basic Puffer Gilet 9950 Khaki  S-XXL
Daily Bomber 12950 Green  S-XXL
Everyday Gilet 11950 Black  S-XXL

SWEATERS & CARDIGANS ROW
Tapestry Jumper 11950 Navy Camel  XS-XL
Short Knit Polo 8450 Green  XS-XL
Short Knit Polo 8450 Light Blue  XS-XL
Ribbed Bodycon Sweater 6450 Red  XS-XL
Ribbed Bodycon Sweater 6450 Dark Brown  XS-XL

BAGS ROW
Concert Crossbody Bag 11950 Coffee  UNIVERSAL
Suede Leather Tote 22950 Brown  UNIVERSAL
Leather Travel Kit 7450 Dark Brown  UNI
Leather Travel Kit 8950 Black  UNIVERSAL
Brunch Shoulder Bag 11950 Black  UNIVERSAL
```
Price format: `Rs.9,950.00`.

### 2.4 Footer content

```text
Currency selector: Pakistani Rupee, US Dollar, Euro, British Pound Sterling, Canadian Dollar
Links: About Us, Careers, FAQs, Returns / Exchanges, Contact Us, Privacy Policy
Newsletter: "Sign up and save" + email input + Subscribe
Social: Instagram, Facebook, YouTube, TikTok
Customer service: Email | WhatsApp, Contact us at 0311-1115262, 09:00 AM to 09:00 PM (PST), Monday - Saturday
Store locations:
  Lahore - Flagship Store (22-A, Block K Gulberg-II), Emporium Mall (T01, Level 3), Packages Mall (Level 1), Dolmen Mall (Shop # s-25, 2nd Floor)
  Islamabad - Sumbal Rd, F-10 Markaz F10/4; Zeta Mall (UG/07)
  Karachi - Dolmen Mall Clifton (Shop No - D1, Ground Floor); LuckyOne Mall (Shop # 14, Lower Ground Floor)
Copyright line: © 2026 Lama Retail
```

---

## 3. PHASE PROMPTS

### Phase 1 — Foundation and design tokens

```text
PHASE 1 - Foundation. Files: index.html, css/base.css, js/main.js (and empty stubs for all other css/js files listed in the structure).

1. Create the full folder structure with empty stub files for everything not in this phase.
2. index.html: HTML5 boilerplate, viewport meta, theme-color #111111, title "LAMA RETAIL – Lama Retail", meta description "LAMA is a high-street, multi-fashion brand based in Lahore, Pakistan, with a focus on combining functional design with popular fashion." Link ALL css files in order (base, header, hero, product-card, sections, cart, footer, responsive) and ALL js files at the end of body in order (data, menu, slider, products, quick-add, cart, footer, main). Add a "Skip to content" link and a <main id="MainContent"> with empty placeholder comments for each section from the plan (announcement, header, hero, rows, cart drawer, footer).
3. css/base.css: modern CSS reset, :root tokens for colors (use the real ones you read from the live site), font stacks, font-size scale, spacing scale (4px base), max-width container, z-index scale, transitions. Utility classes: .container, .visually-hidden, .btn (primary dark, outline), :focus-visible outline.
4. Load the chosen Google Font(s) in index.html with preconnect.

Do not build any visible UI yet. Report the tokens you extracted from the live site.
```
**Acceptance:** page opens blank with no console errors; `:root` variables exist; all files linked.

### Phase 2 — Announcement bar and desktop header with mega menu

```text
PHASE 2 - Announcement bar + header. Files: index.html, css/header.css, js/data.js (NAV only), js/menu.js.

1. Announcement bar: dark background, centered text "FREE SHIPPING ON ORDERS ABOVE RS. 2500" as a link, plus a pause/play icon button (aria-label toggles "Pause slideshow"/"Play slideshow"). Make it a one-slide slider ready to support more slides; wire the button to a stub for now.
2. Header: sticky, white, logo (use the PNG/WEBP from /assets/logo; show the better-looking one, keep the other as a hidden alternate) centered or left like the original - compare with the live site. Right side: Search, Log in, Cart (with a count badge showing 0). Use icons from /assets/icons if suitable, otherwise inline SVG.
3. Put the NAV tree from the plan (section 2.1) into js/data.js as a JS object. js/menu.js must RENDER the desktop menu from this data (do not hand-write the links in HTML).
4. Desktop mega menu: top-level items WOMAN, MAN, SHOES, ACCESSORIES, FRAGRANCE & LIVING, BANANA ROAD, E-GIFT CARD, CLEARANCE. Hover/focus opens a dropdown panel with the sub-links; SHOES and ACCESSORIES have two columns (Woman / Man) with their sub-links. Small open delay and close delay so it does not flicker. Esc and click-outside close it. aria-expanded kept in sync. Works with keyboard (Tab / Enter / Esc).
5. Header shrinks/gets a subtle shadow on scroll.

Only desktop (>=1024px) behaviour now; mobile comes next phase. Do not touch other files.
```
**Acceptance:** menu is generated from data; hover, keyboard and Esc all work; sticky header shadow on scroll.

### Phase 3 — Mobile menu drawer and search overlay

```text
PHASE 3 - Mobile navigation + search. Files: index.html, css/header.css, css/responsive.css, js/menu.js.

1. Below 1024px hide the desktop menu and show a hamburger button. Clicking opens a left slide-in drawer with a dark backdrop. Body scroll is locked while open; Esc, backdrop click and a close (X) button close it; focus moves into the drawer and returns to the hamburger on close (basic focus trap).
2. Inside the drawer, render the SAME NAV data as an accordion: top-level items expand to show children; SHOES and ACCESSORIES have nested Woman/Man groups. Only one top-level section open at a time. Animate with max-height or grid-template-rows.
3. Search: clicking the Search icon opens a full-width overlay under the header with an input, a close button, and "Search" submit. Autofocus the input; Esc closes. On submit just console.log the query (no results page).
4. Make header layout work at 360px, 768px and 1024px.

Do not break the desktop mega menu.
```
**Acceptance:** drawer opens/closes with all three methods; accordion works; search overlay works; desktop menu still fine.

### Phase 4 — Hero slideshow and announcement slider logic

```text
PHASE 4 - Sliders. Files: index.html, css/hero.css, js/slider.js.

1. Write ONE reusable Slider class in js/slider.js (vanilla): options for autoplay, interval, loop, pause on hover, and prev/next/dots. Support touch swipe and arrow keys. Respect prefers-reduced-motion (disable autoplay).
2. Hero: full-width slideshow using the best banner(s) from /assets/banners or /assets/scanned (inspect those folders and choose the hero images; use the desktop image for >=768px and the mobile image below via <picture> with source media queries). Overlay the title "A THEORY OF COMPANY" and two buttons: "Shop Woman" and "Shop Man". Include dots and prev/next arrows. If only one hero image exists, still build the slider with 2-3 slides using the available banners so it can be demonstrated.
3. Announcement bar: use the same Slider class (fade or vertical) and connect the pause/play button so it toggles autoplay and updates aria-label + icon. Include 2 sample messages: the free-shipping line and one more of your choice.

Do not change the header.
```
**Acceptance:** hero slides auto/swipe/arrow; dots work; announcement pause/play works; responsive images swap.

### Phase 5 — Data layer and product cards

```text
PHASE 5 - Product data and card component. Files: js/data.js (PRODUCTS only), js/products.js, css/product-card.css, index.html.

1. In js/data.js add PRODUCTS using the exact list from section 2.3 of the plan. Generate each product's 3 image URLs with picsum.photos/540/720?random=N (unique N per image). Add helper formatPrice(n) -> "Rs.9,950.00".
2. js/products.js: export a function renderProductCard(product) (global function is fine) that returns the card element:
   - 4:5 image area showing image 1, which swaps to image 2 on hover (desktop) with a fade; on touch devices show a small image dots/scroll-snap carousel of the 3 images.
   - lazy-loading images (loading="lazy", width/height set to avoid layout shift) with an onerror fallback to placehold.co.
   - a "+" quick-add button in the bottom-right corner of the image (functionality comes next phase; just dispatch a custom event "quickadd:open" with the product id).
   - below: product name (uppercase) and price, then the color name as a swatch/label.
3. Render a temporary grid of all products below the header just to test the card.

Cards must look good at 2 columns on mobile, 3-4 on tablet, 4-5 on desktop.
```
**Acceptance:** cards render from data; hover swap works; no layout shift; fallback image works if you go offline.

### Phase 6 — Quick-add panel (size picker + Add to Cart)

```text
PHASE 6 - Quick add. Files: js/quick-add.js, css/product-card.css, index.html.

1. Listen for "quickadd:open". Show a panel anchored over the card (desktop) or a bottom sheet (mobile) containing: close "X", product name, price, "Size" label with size buttons (single-select, one visible selected state), an "Add to Cart" button, and a "View full product" link.
2. Add to Cart is disabled until a size is chosen; if user clicks it while disabled show an inline message "Please select a size".
3. On success dispatch a custom event "cart:add" with {id, name, price, color, size, image} and close the panel. Show a small toast "Added to cart".
4. Only one panel open at a time; Esc and click-outside close it; focus management and aria-labels.
5. Replace the temporary grid test with nothing - keep the test grid for now so I can verify, we remove it in Phase 7.

Do not implement the cart yet.
```
**Acceptance:** panel opens on "+", size selection works, event fires (check console), toast shows.

### Phase 7 — Homepage rows (banner + product carousel)

```text
PHASE 7 - Category rows. Files: index.html, css/sections.css, js/products.js, js/main.js.

1. Remove the temporary test grid.
2. Build these rows in order using a reusable renderRow(config) function (rows are generated from data, not hand-written):
   a. "New" - heading "New", link "View all", 5-7 product cards, button "View all 259 products". Preceded by nothing (it sits right under the hero).
   b. SHOES - full-width banner (desktop + mobile <picture> from the shoes banners), badge "NEW", title "SHOES", buttons "shop woman" / "shop man", then sub-heading "WEARING NOW" + "View all", cards, "View all 83 products".
   c. JACKETS & COATS - banner (jackets), badge "new", title, "View all", cards, "View all 28 products".
   d. SWEATERS & CARDIGANS - banner (sweaters), "NEW", cards, "View all 12 products".
   e. BAGS - banner (bags), "NEW", cards, "View all 42 products".
3. Product list in each row is a horizontal scroll-snap carousel with prev/next arrow buttons on desktop (hidden on touch), drag/swipe on mobile, and arrows auto-disable at the ends.
4. Banner text overlays must stay readable (add a gradient if needed) at all widths.
5. Use IntersectionObserver for a subtle fade-in on rows.
```
**Acceptance:** 5 rows render from data; carousels scroll; banners swap desktop/mobile; no console errors.

### Phase 8 — Cart drawer

```text
PHASE 8 - Cart. Files: index.html, css/cart.css, js/cart.js.

1. Right-side slide-in drawer with backdrop. Opens when the header Cart icon is clicked AND automatically after "cart:add". Closes with X, backdrop, Esc. Locks body scroll; focus trap.
2. Drawer header: "Cart" + close. Body: list of items (image, name, color / size, price, quantity stepper - and +, remove). Empty state text: "Your cart is currently empty." with a "Continue shopping" button.
3. Footer area: "Subtotal  Rs.0.00" (live formatted), small text "Shipping, taxes, and discount codes calculated at checkout.", a dark "Check out" button (disabled when empty; on click just alert("Demo checkout")).
4. BaadMay block (below subtotal, above checkout): small logo icon from /assets/icons, text "Pay in 3 Installments of Rs. <subtotal/3 formatted>" and an expandable/collapsible info section titled "Pay for your purchase, thora abhi, baqi?" with 3 steps: "Select BaadMay at Checkout", "Verify your account details", "Pay only your first installment now", using the icons in /assets/icons. Hide the whole block when cart is empty.
5. Persist cart in localStorage (key "lama_cart"), same item+size merges quantity. Header badge shows total quantity and hides at 0. Listen for "cart:add".
6. Handle corrupted localStorage safely (try/catch, reset).
```
**Acceptance:** add items from quick-add, quantities/remove/subtotal update, refresh keeps cart, installment amount updates.

### Phase 9 — Footer

```text
PHASE 9 - Footer. Files: index.html, css/footer.css, js/footer.js.

Build the footer from the content in section 2.4 of the plan (use that exact copy):
1. Top: currency <select> (visual only; store choice in localStorage), links list, newsletter form with email validation (regex + inline error/success message "Thanks for subscribing!", no network call).
2. Social icons row (inline SVG, aria-labels).
3. Customer service block and store locations grouped by city (Lahore / Islamabad / Karachi). On mobile make "CUSTOMER SERVICE" and "STORE LOCATION" collapsible accordions; on desktop show them as columns.
4. Bottom bar: "© 2026 Lama Retail".
5. Dark or light styling must match the live site - compare in the browser.
```
**Acceptance:** newsletter validation works, accordions on mobile, columns on desktop.

### Phase 10 — Responsive polish, accessibility, performance, QA

```text
PHASE 10 - Polish and QA. You may touch any file, but only to fix issues.

1. Visually compare my page against https://pk.lamaretail.com/ at 360, 768, 1024 and 1440 px. List every visible difference you find (spacing, font size, colors, alignment), then fix them. Prioritise header, hero, product card and footer.
2. Accessibility: run through keyboard-only navigation of the whole page (menu, drawer, search, quick-add, cart). Fix focus traps, missing labels, contrast < 4.5:1 for text.
3. Performance: ensure below-fold images use loading="lazy", set explicit width/height, add decoding="async", avoid layout shift, remove unused CSS/JS, no console errors or warnings.
4. Add a favicon (use the logo), Open Graph tags, and print-safe basics.
5. Create README.md with: project description, folder structure, how to run (open index.html), features list, and a note: "Educational replica - brand assets belong to Lama Retail."
6. Final output: a checklist of what was tested and anything known to be different from the original.
```

---

## 4. Final QA checklist (you do this yourself)

- [ ] No red errors in the browser console (F12)
- [ ] Menu: hover, keyboard, Esc, mobile drawer, accordion
- [ ] Search overlay opens/closes
- [ ] Hero and announcement sliders: autoplay, pause, swipe
- [ ] Product card hover swap, "+" opens quick-add, size required
- [ ] Add to cart: badge, drawer, qty +/-, remove, subtotal, persists after refresh
- [ ] BaadMay amount = subtotal / 3
- [ ] Footer: newsletter validation, currency select, mobile accordions
- [ ] Looks right at 360 / 768 / 1024 / 1440 px
- [ ] Lighthouse (Chrome DevTools) Accessibility and Best Practices ≥ 90

---

## 5. Troubleshooting prompts

```text
Only fix this bug, change the minimum number of lines, and tell me which files you touched: <describe bug and what you expected>
```

```text
Compare section <name> to the live site at https://pk.lamaretail.com/ at <width>px and list every visual difference before changing anything. Then fix them.
```

```text
Refactor nothing. Add <feature> in js/<file>.js only, and explain how to test it.
```

---

## 6. Notes

- Logo, banners and icons belong to Lama Retail. Use them for learning/portfolio only. If you publish this publicly, replace them with your own brand assets or mark it clearly as a non-commercial demo.
- Product images are dummy placeholders by design.
- Later upgrades (optional, as new phases): product detail page, collection page with filters, login/signup, real backend hookup.
