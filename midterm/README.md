# Lab Midterm – Upgrade Your E-commerce Navigation, Checkout and Cart

| | |
|---|---|
| **Name** | Muhammad Hammad Sarwar |
| **Roll number** | FA24-BCS-068 |
| **N** | 68 (last two digits of the roll number) |
| **BP** | 600 + N = **668px** |
| **H** | (N × 7) mod 360 = 476 mod 360 = **116** → accent colour `hsl(116, 70%, 45%)` |
| **K** | (N mod 3) + 3 = 2 + 3 = **5** (mega-menu columns / accordion groups) |
| Cart limit per product | (N mod 4) + 2 = 0 + 2 = **2** |
| Delivery date range | exam date 29 Oct 2026 → +N days = **2026-10-29 to 2027-01-05** |

Project: Lama Retail replica (Assignment 2), copied unchanged into `midterm/` in the baseline commit `midterm: baseline copy`, then changed below. Bootstrap 5.3.3 is still used everywhere. Tested at **375px, 668px and 1280px**.

**PDF:** `FA24-BCS-068-midterm.pdf`. **Screenshots:** `screenshots/midterm/`.

---

## Files changed

| File | Task | Change |
|---|---|---|
| `index.html` | 1, 2, 3, Extra | Shop by Category menu + panel; phone-menu accordion; hamburger uses Bootstrap offcanvas; cart icon is a link to `checkout.html`; mini-cart panel; header heart + "Saved for later" panel; loads `css/mega-menu.css`, `css/mini-cart.css`, `css/wishlist.css`, Bootstrap JS bundle and `script.js`; old size picker and cart drawer removed |
| `product.html` | 1, 2, 3 | The same header changes as `index.html` (the header is shared) |
| `checkout.html` | 2 | **New** – the checkout form (same header / footer as the other pages) |
| `css/mega-menu.css` | 1 | **New** – mega-menu panel, `<details>` accordion, BP / K / H rules |
| `css/checkout.css` | 2 | **New** – form layout (CSS Grid) and `:user-invalid` validation styles |
| `css/mini-cart.css` | 3 | **New** – Add to Cart button and mini-cart panel styles |
| `script.js` | 3, Extra | **New** – cart array, badge, mini cart, `reduce()` total, limit of 2; plus the save-for-later list |
| `js/menu.js` | 1 | Removed our own hamburger open/close code (Bootstrap's offcanvas script does it now) |
| `js/products.js` | 3, Extra | Every product card gets an **Add to Cart** button instead of the "+" quick-add button, and a heart (save for later) |
| `css/wishlist.css` | Extra | **New** – hearts on cards, header heart and "Saved for later" panel styles |
| `README.md` | – | This file |
| `FA24-BCS-068-midterm.pdf` | – | **New** – submission PDF (screenshots + code for each task) |
| `screenshots/midterm/` (11 files) | – | **New** – each task at 375px, 668px and 1280px + the saved-for-later panel, used in the PDF |
| `FA24-BCS-068_Assignment2_Completion.pdf` | – | **Removed** from `midterm/` (copied from Assignment 2) so this folder has only one PDF; the original is still in `assignments/assignment 2/` |

---

## Task 1 – Mega menu (HTML + CSS only)

- **What:** "Shop by Category" is added in the HTML inside the existing `<nav>`. It opens a full-width panel with **K = 5 columns** (Woman, Man, Shoes, Accessories, Collections). Each column is a `<ul>` with an `<h2>` heading and 4–5 links.
- **How it opens:** `.shop-menu:hover > .shop-panel, .shop-menu:focus-within > .shop-panel` switches the panel from `visibility: hidden` to `visible`, so Tab alone opens it.
  - When closing, `visibility` waits 0.25s, so the pointer can cross the gap into the panel.
  - It's `position: absolute; top: 100%; left: 0; right: 0` relative to the sticky header (z-index 500), so it covers the product grid and doesn't push content down.
  - It shows from **668px**. Below that, the same 5 groups are `<details>/<summary>` inside the phone menu: closed by default, and each opens independently.
- **Why `menu.js` changed:** the rules allow only the framework's own hamburger script. So the hamburger now uses **Bootstrap's offcanvas** (`data-bs-toggle="offcanvas"`), and our own drawer code was deleted. No JavaScript was written for Task 1.

## Task 2 – Checkout form (HTML5 validation + CSS only)

- **What:** `checkout.html` (opened from the cart icon) has two `<fieldset>`s with `<legend>`s:
  - **Contact:** name, email, phone.
  - **Delivery:** address, a city `<select>`, a delivery date.

  Every input has a `<label for>` matching its `id`.
- **Validation:**
  - `required`, `type="email"`, `minlength`.
  - Phone: `pattern="03[0-9]{2}-[0-9]{7}"`.
  - Date: `min="2026-10-29" max="2027-01-05"`.
  - `:user-invalid` gives a red border and shows the message only **after the user has interacted** with a field; `:not(:placeholder-shown):invalid` is the fallback.
  - After a valid submit the form goes to `#order-confirmed` and CSS `:target` shows a thank-you box. No JavaScript.
- **Layout:**
  - From 668px, `.checkout-form` is a 2-column grid (the fieldsets sit side by side) and each fieldset is a `6.5rem | 1fr` grid (labels on the left).
  - Below 668px both are 1 column, with labels above inputs.
  - The submit button spans the grid (`grid-column: 1 / -1; width: 100%`).

## Task 3 – Cart badge and mini cart (`script.js`, plain JavaScript)

- **What:** every card has an Add to Cart button.
  - One `click` listener on `document` (event delegation) reads the **name, colour and price from the card** (`.product-title`, `.product-color-label`, `.product-price`) and pushes `{ key, name, colour, price }` into the `cart` array.
  - The badge shows `cart.length`.
- **Mini cart:**
  - Clicking the cart icon calls `preventDefault()` (the icon is still a link to checkout for Task 2) and toggles the panel under it. Clicking again closes it.
  - It lists every item with its price and a Remove button (`cart.splice`).
  - The total is `cart.reduce((sum, item) => sum + item.price, 0)`.
  - `render()` redraws the list, total, badge and buttons after every change.
- **Limit:** `MAX_PER_PRODUCT = (68 % 4) + 2 = 2`. When a product (same name and colour) is in the cart twice, its button shows **"Limit reached"** and is `disabled`, until one is removed.
- **Why the old cart was removed:** the earlier drawer (`cart.js`) and "+" size picker (`quick-add.js`) would have been a second cart writing to the same badge. These pages now load `script.js` instead. The product page's own Add to Cart form also feeds `script.js`, through its `cart:add` event.

## Extra (not required by the brief) – Save for later

- **What:**
  - A **heart** on every product card saves the product for later. A filled red heart means it's saved.
  - A **heart icon with a count** in the header opens a "Saved for later" panel with **Move to cart** and **Remove**.
  - Every mini-cart row also has **Save for later**, which takes the item out of the cart and keeps it in the saved list.
- **How:**
  - Same `script.js`, with a second array `saved` (each product at most once).
  - It's kept in `localStorage` under `lama_saved`, so it survives a refresh, read inside `try/catch` in case of bad data.
  - "Move to cart" uses the same `addItem()`, so the limit of 2 still applies. At the limit the button shows "Limit reached".
  - Only one panel (cart or saved) is open at a time.
  - The heart's look comes from `aria-pressed="true"` in CSS (`css/wishlist.css`).

---

## Live check – where things are

| Question | Answer |
|---|---|
| Which rule opens the mega menu? | `css/mega-menu.css` → `.shop-menu:hover > .shop-panel, .shop-menu:focus-within > .shop-panel` |
| Change BP | Search `/* BP */` in `css/mega-menu.css` and `css/checkout.css` and change every `668px` (and `667.98px`). CSS variables can't be used inside `@media`. |
| Change the number of columns (K) | `css/mega-menu.css` → `.shop-panel__grid { grid-template-columns: repeat(5, 1fr); }` |
| Panel above everything / not pushing content | `.shop-panel { position: absolute; top: 100%; left: 0; right: 0; z-index: 10; }` inside the sticky header (z-index 500) |
| Errors only after interaction | `css/checkout.css` → `:user-invalid` rules |
| Phone format / date range | `checkout.html` → `pattern="03[0-9]{2}-[0-9]{7}"`, `min="2026-10-29" max="2027-01-05"` |
| Cart limit | `script.js` → `const MAX_PER_PRODUCT = (68 % 4) + 2;` |
| Total | `script.js` → `cart.reduce((sum, item) => sum + item.price, 0)` |
| Save for later | `script.js` → `toggleSaved()`, `saveForLater()`, `moveToCart()`; filled heart = `.btn-wishlist[aria-pressed="true"]` in `css/wishlist.css` |

## AI tools used

- **Claude (Anthropic) – Claude Code**: used to plan, write and test the changes, take the screenshots and build the PDF. I reviewed every change and can explain all of it.
