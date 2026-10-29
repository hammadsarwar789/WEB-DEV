# Viva Guide – Lama Retail Replica (Assignment 2)

This guide explains **every part of the project** – HTML, CSS (including Bootstrap) and JavaScript – with the real code from the files and the exact line numbers, so you can open the file and show it during the viva.

> Click any link like [cart.js:55](js/cart.js#L55) to jump to that line.
> Read section 1 first (the big picture), then go file by file. Section 6 has likely viva questions with short answers.

---

## Contents

1. [The big picture](#1-the-big-picture)
2. [How the pages load](#2-how-the-pages-load)
3. [HTML – index.html and product.html](#3-html--indexhtml-and-producthtml)
4. [CSS – Bootstrap + our 9 stylesheets](#4-css--bootstrap--our-9-stylesheets)
5. [JavaScript – the 9 scripts](#5-javascript--the-9-scripts)
6. [Likely viva questions (with answers)](#6-likely-viva-questions-with-answers)

---

## 1. The big picture

**What it is:** a front-end copy of the Pakistani fashion store [pk.lamaretail.com](https://pk.lamaretail.com/), with two pages:
- **`index.html`** – the homepage (header, hero video, 5 product rows, footer)
- **`product.html`** – a product detail page (large photo, size, quantity, Add to Cart)

It is built with **HTML, CSS, Bootstrap 5 (CSS only) and plain JavaScript** – no React, no jQuery, no npm, no server. You open `index.html` by double-clicking it.

**The languages, and the job of each:**

| Language | Job | In this project |
|---|---|---|
| **HTML** | *Structure* – what is on the page | [index.html](index.html), [product.html](product.html) |
| **CSS** | *Look* – colours, fonts, layout, animation, phone vs desktop | 9 files in [css/](css/) |
| **Bootstrap 5** | A ready-made CSS framework: grid, navbar, buttons, forms | loaded from a CDN, used through class names in the HTML/JS |
| **JavaScript** | *Behaviour* – everything that reacts to clicks, hovers, typing, and content built from data | 9 files in [js/](js/) |

**Folder structure:**

```text
assignment 2/
├── index.html            ← homepage
├── product.html          ← product detail page
├── css/                  ← 9 stylesheets (one per part of the site)
├── js/                   ← 9 scripts (one per feature)
├── screenshots/          ← reference site + both pages at 375 / 768 / 1440px
└── assets/
    ├── banners/          ← category banners: <name>-desktop.jpg + <name>-mobile.jpg
    ├── icons/            ← BaadMay SVG icons
    ├── logo/             ← logo.webp, logo.png, og-image.jpg
    ├── products/         ← 68 real product photos
    └── videos/hero.mp4   ← hero video
```

**Key idea to say in the viva:** *"The HTML is a skeleton. The menu and all the product cards are not typed in HTML – JavaScript builds them from data in `data.js`. The product page also reads `?id=` from the URL and fills itself in from the same data, so one `product.html` works for every product."*

---

## 2. How the pages load

1. The browser reads the HTML from top to bottom.
2. In `<head>` it loads Google Fonts, then **Bootstrap** ([index.html:26](index.html#L26)), then **our CSS files** in order ([index.html:30-37](index.html#L30)).
   - **Bootstrap first, ours after:** when two rules are equally specific, the later one wins – so our files can restyle Bootstrap.
   - `responsive.css` is last so it can override everything else.
   - `product.html` loads one extra file, `css/product.css` ([product.html:34](product.html#L34)).
3. At the **end of `<body>`** it loads the scripts in order ([index.html:414-421](index.html#L414)):

```html
<script src="js/data.js"></script>
<script src="js/menu.js"></script>
<script src="js/slider.js"></script>
<script src="js/products.js"></script>
<script src="js/quick-add.js"></script>
<script src="js/cart.js"></script>
<script src="js/footer.js"></script>
<script src="js/main.js"></script>          <!-- product.html uses js/product-page.js here instead -->
```

- Scripts are at the **bottom** so the HTML exists before the scripts run.
- `data.js` is **first** because every other file uses its data and helpers.
- `main.js` / `product-page.js` are **last** because they use `renderRow()` / `renderProductCard()` from `products.js`.
- These are **classic scripts, not ES modules** (`type="module"` is blocked when you open a file directly from disk with `file://`).
4. Each script waits for **`DOMContentLoaded`** (fired when the HTML is fully parsed), then finds its elements and attaches event listeners.

---

## 3. HTML – index.html and product.html

Both pages share the **same** announcement bar, header, phone menu, search, size picker, cart drawer and footer markup – only `<main>` is different. (A static site has no "include" feature, so the shared parts are copied into both files.)

### 3.1 The `<head>` ([index.html:3](index.html#L3))

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#111111">
<title>LAMA RETAIL – Lama Retail</title>
<meta name="description" content="LAMA is a high-street, multi-fashion brand ...">
```

| Tag | Why |
|---|---|
| `charset="UTF-8"` | Supports all characters (–, €, £) |
| `viewport` | Without it, phones would show a tiny zoomed-out desktop page. **Required for responsive design.** |
| `theme-color` | Colours the browser bar on Android |
| `description` | Text Google shows in search results (SEO) |
| `og:title`, `og:image` … ([index.html:11](index.html#L11)) | **Open Graph** – the preview card when the link is shared on WhatsApp/Facebook |
| `<link rel="icon">` ([index.html:18](index.html#L18)) | The favicon (tab icon) |
| `preconnect` ([index.html:21](index.html#L21)) | Opens the connection to Google Fonts early → fonts load faster |
| Fonts ([index.html:23](index.html#L23)) | **Outfit** (body) and **Tenor Sans** (headings) – same fonts as the real site. `display=swap` shows text immediately in a fallback font while the font downloads. |
| Bootstrap ([index.html:26](index.html#L26)) | Bootstrap 5.3.3 from the jsDelivr CDN. `integrity` is a hash: the browser refuses the file if it was changed. |

### 3.2 Semantic structure

The page uses **semantic tags** (tags whose name says what they are), which helps screen readers and SEO:

```text
<a class="skip-to-content">        ← hidden link for keyboard users      (line 42)
<aside class="announcement-bar">                                          (line 47)
<header class="site-header">       ← Bootstrap .navbar inside             (line 63)
   <nav class="desktop-nav">                                              (line 94)
<aside id="mobileDrawer">          ← phone menu                           (line 153)
<main id="MainContent">                                                   (line 166)
   <section class="hero-section">                                         (line 169)
   <div id="homepageCatalogRows">  ← JS fills this with 5 <section>s      (line 183)
<div id="quickAddPanel">           ← size picker                          (line 191)
<aside id="cartDrawer">                                                   (line 217)
<footer class="site-footer">                                              (line 285)
```

**Skip link** ([index.html:42](index.html#L42)): hidden off-screen; when a keyboard user presses Tab it slides into view and jumps past the menu to the main content.

### 3.3 Announcement bar ([index.html:47](index.html#L47))

```html
<aside class="announcement-bar" aria-label="Store Announcements">
    <div class="container">
        <div class="announcement-slider">
            <div class="announcement-slide active">
                <a href="#shipping-policy">FREE SHIPPING ON ORDERS ABOVE RS. 2500</a>
            </div>
            <div class="announcement-slide">
                <a href="#winter-collection">NEW IN: FALL WINTER '26 COLLECTION NOW LIVE</a>
            </div>
        </div>
    </div>
</aside>
```

Two messages; only the one with class `active` is shown. `slider.js` moves the `active` class every 4 seconds.

### 3.4 Header – a Bootstrap navbar ([index.html:63](index.html#L63))

```html
<header class="site-header" role="banner">
    <div class="container">
        <!-- Bootstrap .navbar lays out the row: logo | menu | icons -->
        <div class="navbar navbar-expand-lg flex-nowrap header-inner">
            <div class="header-left"> ...hamburger button (phones)... </div>
            <div class="header-logo">
                <a href="index.html" class="navbar-brand"> <picture>...logo...</picture> </a>
            </div>
            <nav class="desktop-nav">
                <ul class="navbar-nav nav-list" id="desktopNavList"></ul>
            </nav>
            <div class="header-right d-flex align-items-center gap-1"> search / account / cart </div>
        </div>
    </div>
</header>
```

**What each Bootstrap class does here:**

| Class | Line | Job |
|---|---|---|
| `navbar` | [index.html:66](index.html#L66) | Makes the row a flexbox: items in one line, vertically centred, spread to the edges |
| `navbar-expand-lg` | same | From 992px (Bootstrap's "lg") the `navbar-nav` list becomes a horizontal row |
| `flex-nowrap` | same | Bootstrap utility – never wrap the logo / menu / icons onto two lines |
| `navbar-brand` | [index.html:79](index.html#L79) | Marks the logo link as the brand |
| `navbar-nav` | [index.html:95](index.html#L95) | Removes list bullets and padding, lays the menu items out as a flex row |
| `d-flex align-items-center gap-1` | [index.html:99](index.html#L99) | Bootstrap utilities: flex row, centred, small gap between the icons |
| `badge rounded-pill text-bg-dark` | [index.html:123](index.html#L123) | The black pill with the cart count |

- The `<ul>` is empty – **`menu.js` builds the menu items from data** (each `<li class="nav-item">` with an `<a class="nav-link">`, both Bootstrap classes).
- **`<picture>`** for the logo: the browser uses the smaller **WEBP** file if it supports it, otherwise the **PNG**.
- Icon buttons have `aria-label` (they have no text) and the hamburger has `aria-expanded="false"`, which JS sets to `"true"` when the menu is open.
- Icons are **inline SVG**: vector drawings inside the HTML, sharp at any size, coloured from CSS via `stroke="currentColor"`.
- The cart badge has `data-count="0"` – a **custom data attribute**; CSS hides the badge when it is `"0"`.

**Search overlay** ([index.html:131](index.html#L131)) – a `<form>` with `<input type="search">`, a submit button and a close button. Hidden until the search icon is clicked.

### 3.5 Phone menu drawer ([index.html:152](index.html#L152))

```html
<div id="mobileDrawerBackdrop" class="mobile-drawer-backdrop" aria-hidden="true"></div>
<aside id="mobileDrawer" class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation Menu">
    ...
    <div id="mobileDrawerNav"></div>   ← menu.js fills this
</aside>
```

- **Backdrop** = the dark see-through layer behind the drawer; clicking it closes the drawer.
- `role="dialog"` + `aria-modal="true"` tell screen readers this is a pop-up that blocks the page behind it.

### 3.6 Homepage `<main>`: hero video + product rows ([index.html:169](index.html#L169))

```html
<section class="hero-section" aria-label="A Theory of Company">
    <video class="hero-video" autoplay muted loop playsinline preload="auto"
           width="720" height="990" aria-hidden="true">
        <source src="./assets/videos/hero.mp4" type="video/mp4">
    </video>
    <div class="hero-overlay">
        <h1 class="hero-title">A THEORY OF COMPANY</h1>
        <div class="hero-btn-group">
            <a href="#section-new" class="btn btn-light">Shop Woman</a>
            <a href="#section-new" class="btn btn-light">Shop Man</a>
        </div>
    </div>
</section>

<div id="homepageCatalogRows"></div>   ← main.js + products.js create the 5 product rows here
```

| Attribute | Why |
|---|---|
| `autoplay` | Starts by itself |
| `muted` | **Browsers only allow autoplay if the video is muted** |
| `loop` | Repeats forever |
| `playsinline` | On iPhone, plays inside the page instead of going full-screen |
| `aria-hidden="true"` | The video is decoration; screen readers skip it and read the `<h1>` instead |

`btn btn-light` are **Bootstrap button classes** (recoloured in `base.css`).

### 3.7 Product page `<main>` ([product.html:167](product.html#L167))

```html
<nav aria-label="Breadcrumb">
    <ol class="breadcrumb product-breadcrumb"> Home / New In / TIPPED EDGE SWEATER </ol>
</nav>

<!-- Bootstrap grid: photos and details stack on phones, sit side by side from 768px -->
<div class="row g-4 g-xl-5">
    <div class="col-12 col-md-6">  photos  </div>
    <div class="col-12 col-md-6">  details </div>
</div>

<section class="related-products">
    <h2>You may also like</h2>
    <div id="relatedProducts" class="row row-cols-2 row-cols-md-4 g-3"></div>
</section>
```

- **Breadcrumb** ([product.html:172](product.html#L172)) – Bootstrap component; shows where you are (Home / category / product).
- **Bootstrap grid** ([product.html:180](product.html#L180)):
  - `row` = a flex row.
  - `col-12` = full width on phones.
  - `col-md-6` = half width from 768px.
  - `g-4` = gap between the columns.
- **Photos** ([product.html:186](product.html#L186)): one big `<img>` + an empty `#productThumbs` box that JS fills with thumbnail buttons.
- **The form** ([product.html:204](product.html#L204)):
  - **Size buttons** ([product.html:210](product.html#L210)): Bootstrap **`btn-check`** – a hidden radio button followed by a `<label class="btn btn-outline-dark">`. Clicking the label selects the radio, and Bootstrap colours the selected label. JS rebuilds them from the product's sizes.
  - **Quantity selector** ([product.html:228](product.html#L228)): a Bootstrap **`input-group`** joining `[ − ] [ 1 ] [ + ]` into one control. The middle is `<input type="number" min="1" max="10">`.
  - **Add to Cart** = `<button type="submit">`, so pressing Enter also works.
- **Accordions** ([product.html:240](product.html#L240)): native **`<details>` / `<summary>`** – they open and close **without any JavaScript**. `open` makes "Description" start open.
- **"You may also like"** ([product.html:260](product.html#L260)): a Bootstrap grid. `row-cols-2` = 2 cards per row on phones, `row-cols-md-4` = 4 per row from 768px. JS puts 4 product cards in it.
- The HTML already contains the default product (Tipped Edge Sweater); `product-page.js` replaces the text with whichever product is in the URL (`product.html?id=prod-shoes-2`).

### 3.8 Size picker panel ([index.html:191-207](index.html#L191))

```html
<div id="quickAddPanel" class="quick-add-panel" role="dialog" aria-modal="true" aria-labelledby="quickAddName">
    <h3 id="quickAddName">Product Name</h3>
    <div id="quickAddPrice">Rs.0.00</div>
    <div id="quickAddSizes" role="group" aria-labelledby="quickAddSizesLabel"></div>
    <div id="quickAddError" class="quick-add-error-msg" role="alert" hidden>Please select a size</div>
    <button type="button" id="quickAddSubmit" class="btn-quick-submit" aria-disabled="true">Add to Cart</button>
</div>
```

- One panel is **reused** for every product – JS fills in name, price and size buttons.
- `hidden` – the error is hidden until needed; `role="alert"` makes screen readers read it out when it appears.
- **`aria-disabled` instead of `disabled`**: a truly `disabled` button can't be clicked, so we could not show "Please select a size". With `aria-disabled` it *looks and announces* disabled but still receives the click.
- **Toast** ([index.html:211](index.html#L211)): `aria-live="polite"` makes screen readers announce "Added to cart".

### 3.9 Cart drawer ([index.html:216-276](index.html#L216))

- **Header:** `<h2>Cart</h2>` + close button.
- **Empty state:** "Your cart is currently empty." + a Bootstrap `btn btn-dark` "Continue shopping" button ([index.html:227](index.html#L227)).
- **Item list:** `<ul id="cartItemsList">` – JS adds one `<li>` per item ([index.html:235](index.html#L235)).
- **Subtotal** + shipping note.
- **BaadMay block** ([index.html:250](index.html#L250)): "Pay in 3 Installments of …" + an expandable button with `aria-expanded` and `aria-controls` (tells screen readers which element it opens). Step icons have `alt=""` because the text next to them already says the step.
- **Check out** starts `disabled` ([index.html:276](index.html#L276)); JS enables it when the cart has items.

### 3.10 Footer – Bootstrap grid ([index.html:285-409](index.html#L285))

```html
<div class="row g-4 g-lg-5 footer-top-grid">
    <div class="footer-newsletter col-12 col-md-6 col-lg-5"> newsletter </div>
    <nav class="footer-links col-6 col-md-3 col-lg-3" aria-label="Footer"> links </nav>
    <div class="footer-currency col-6 col-md-3 col-lg-4"> currency </div>
</div>
```

**Bootstrap grid = 12 columns.** The newsletter column, for example:
- `col-12` takes all 12 columns (full width) on phones.
- `col-md-6` takes 6 of 12 (half) from 768px.
- `col-lg-5` takes 5 of 12 from 992px.

So the footer is 1 column on phones, then 2–3 columns on bigger screens ([index.html:289](index.html#L289)).

- **Newsletter form** ([index.html:292-305](index.html#L292)):
  ```html
  <form id="newsletterForm" class="newsletter-form input-group" novalidate>
      <label for="newsletterInput" class="visually-hidden">Email</label>
      <input type="email" id="newsletterInput" class="newsletter-input form-control" ... required>
      <button type="submit" class="newsletter-btn btn btn-dark">Subscribe</button>
  </form>
  ```
  - `input-group` joins the box and the button.
  - `form-control` styles the input.
  - `novalidate` turns off the browser's own popup so **our JavaScript** shows our own message.
  - `visually-hidden` (Bootstrap) hides the label visually but keeps it for screen readers.
- **Currency `<select class="form-select">`** ([index.html:321](index.html#L321)) – Bootstrap draws the box and arrow.
- **Social links** with `target="_blank" rel="noopener noreferrer"` – new tab, safely.
- **Customer Service / Store Location** ([index.html:348](index.html#L348)): `col-12 col-md-4` / `col-12 col-md-8`. The 3 cities use `row row-cols-1 row-cols-md-3` ([index.html:372](index.html#L372)) → 1 per row on phones, 3 side by side from 768px.
- Accordion headings contain a **`<button>`** (works with the keyboard) with `aria-expanded` + `aria-controls`.
- **Phone number** is a `tel:` link → tapping it on a phone starts a call.

---

## 4. CSS – Bootstrap + our 9 stylesheets

### 4.0 How Bootstrap and our CSS work together

- **Bootstrap** gives ready-made classes: the grid (`row`, `col-*`, `row-cols-*`), the navbar, buttons (`btn btn-dark`), forms (`form-control`, `input-group`, `form-select`), `breadcrumb`, `badge`, and utilities (`d-flex`, `gap-1`, `flex-nowrap`, `visually-hidden`).
- **Our CSS** is loaded after Bootstrap. When a Bootstrap rule and ours have the same specificity, **ours wins because it comes later**.
- Bootstrap's look is controlled by **CSS variables** (like `--bs-btn-bg`). We change those variables instead of rewriting Bootstrap – that is how buttons became black with square corners.

### 4.1 base.css – variables, reset, Bootstrap overrides

**CSS custom properties (variables)** – [base.css:7](css/base.css#L7):

```css
:root {
    --color-primary: #111111;
    --font-heading: 'Tenor Sans', 'Segoe UI', Roboto, sans-serif;
    --font-body: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --space-1: 4px;  --space-2: 8px; ...   (4px spacing scale)
    --z-dropdown: 100; --z-sticky: 500; --z-drawer: 900; --z-modal: 1000; --z-toast: 1100;

    /* Point Bootstrap's own variables at our tokens, so its components match the brand */
    --bs-body-font-family: var(--font-body);
    --bs-body-color: var(--color-text-main);
    --bs-border-color: var(--color-border);
    --bs-border-radius: 0;        /* square corners on buttons, inputs and selects */
}
```

- Variables are defined once on `:root` and used everywhere as `var(--color-primary)`. Change the colour in one place and the whole site updates.
- The **`--bs-…` lines** ([base.css:81](css/base.css#L81)) re-point **Bootstrap's own variables**, so every Bootstrap component uses our font, colours and square corners.

**Reset** ([base.css:89](css/base.css#L89)) – `* { margin: 0; padding: 0; box-sizing: border-box; }`
- Removes the browser's default spacing.
- `box-sizing: border-box` means `width` includes padding and border.

**Fixing Bootstrap's "reboot"** ([base.css:145](css/base.css#L145)):

```css
/* Bootstrap's reboot gives these tags margins (a tag selector beats "*" above), so clear them again */
h1, h2, h3, h4, h5, h6, p, ul, ol, dl, figure {
    margin: 0;
}
ul, ol { list-style: none; padding: 0; }
```

**Specificity lesson:**
- Bootstrap's `p { margin-bottom: 1rem }` beats our `* { margin: 0 }`, because a **tag selector is more specific than `*`**, whatever the order.
- So we repeat the reset with tag selectors. Same specificity as Bootstrap's rule, but loaded later, so ours wins.

**Other global rules:**

```css
body.scroll-locked { overflow: hidden; }                 /* stops the page scrolling behind drawers  (line 118) */
[hidden] { display: none !important; }                   /* the hidden attribute always wins          (line 122) */
:focus-visible { outline: 2px solid var(--color-primary); } /* focus ring only for keyboard users    (line 166) */
```

**`.container`** ([base.css:172](css/base.css#L172)):
- Bootstrap also has a `.container`. Ours comes later, so it replaces Bootstrap's widths with a 1440px max width and our side padding.

**Buttons** ([base.css:213](css/base.css#L213) and [base.css:224](css/base.css#L224)):

```css
.btn { padding: 12px 28px; font-weight: 500; text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); }

.btn-dark {
    --bs-btn-bg: var(--color-primary);           /* normal  */
    --bs-btn-hover-bg: #333333;                  /* hover   */
    --bs-btn-active-bg: #333333;                 /* pressed */
    ...
}
```

Bootstrap's `.btn` reads these variables for each state, so we only set the colours and Bootstrap does the rest. The same goes for `.btn-light` (white buttons on the hero and banners) and `.btn-outline-dark` (the "View all" buttons and the size buttons).

**Reduced motion** ([base.css:255](css/base.css#L255)): if the user turned on "reduce motion" in their operating system, all animations become instant.

### 4.2 header.css – announcement bar, navbar, menus, drawer, search

**Sticky header** ([header.css:69](css/header.css#L69)): `position: sticky; top: 0;` keeps the header at the top while scrolling. JS adds `.scrolled` after 20px to show a shadow ([header.css:80](css/header.css#L80)).

**Navbar row** ([header.css:84](css/header.css#L84)): `display:flex`, centring and spreading come from Bootstrap's `.navbar`; we only set the height.

**Undoing Bootstrap's defaults** ([header.css:213](css/header.css#L213)):

```css
/* Bootstrap gives .navbar-nav .nav-link side padding and a grey colour - undo both */
.site-header .navbar-nav .nav-link {
    padding: var(--space-2) 0;
    color: var(--color-text-main);
}
```

Bootstrap's rule is `.navbar-nav .nav-link` (2 classes). Ours adds `.site-header` (3 classes), so **ours is more specific and wins**.

**Menu link size** – 15px, weight 300, `letter-spacing: 3px`, measured from the live site. `.nav-list` has `flex-wrap: wrap`, so links go onto a second row on small laptops, like the real site ([header.css:187](css/header.css#L187)).

**Animated underline** ([header.css:218](css/header.css#L218)): a `::after` pseudo-element with `width: 0` that grows to `100%` on hover.

**Mega dropdown** ([header.css:236](css/header.css#L236)):
- **Hidden state:** `opacity: 0; visibility: hidden; transform: translateY(8px)`.
- **When JS adds `.open`** ([header.css:261](css/header.css#L261)): it fades in and slides up.
- **Shoes / Accessories** use **CSS Grid** (`grid-template-columns: repeat(2, 1fr)`) for the Woman | Man columns ([header.css:253](css/header.css#L253)).

**Cart badge** ([header.css:334](css/header.css#L334)): Bootstrap's `.badge` draws the pill; we only position it. **Attribute selector** hides it at 0: `.cart-count-badge[data-count="0"] { display: none; }` ([header.css:342](css/header.css#L342)).

**Phone drawer slide-in** ([header.css:446](css/header.css#L446)):

```css
.mobile-drawer {
    position: fixed; top: 0; left: 0; bottom: 0; width: 320px; max-width: 85vw;
    transform: translateX(-100%);      /* pushed off-screen to the left */
    visibility: hidden;                /* keeps links out of the Tab order while closed */
}
.mobile-drawer.open {
    transform: translateX(0);          /* slides in */
    visibility: visible;
    transition: transform var(--transition-smooth), visibility 0s;
}
```

- `transform` animates smoothly.
- **The `visibility` trick:** while closed the drawer is hidden from the keyboard. When it opens, visibility switches instantly (`0s`) so `focus()` works. When it closes, it waits until the slide finishes.

### 4.3 hero.css – hero video ([hero.css:6](css/hero.css#L6))

```css
.hero-section { position: relative; height: 420px; overflow: hidden; }       /* 650px from 768px */
.hero-video   { width: 100%; height: 100%; object-fit: cover; }               /* fill the box, crop extra */
.hero-overlay {
    position: absolute; inset: 0;                                            /* sits on top of the video */
    background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
}
```

- `object-fit: cover` = no stretching.
- The dark **gradient** keeps the white text readable.
- The title is 30px on phones and 50px on desktop, measured from the live site ([hero.css:48](css/hero.css#L48)).

### 4.4 product-card.css – cards, hover swap, size picker, toast

- **Fixed image shape** ([product-card.css:14](css/product-card.css#L14)): `aspect-ratio: 4 / 5;` reserves the height before the photo loads, so there's no layout shift.
- **Hover swap** ([product-card.css:38](css/product-card.css#L38)):
  - Photos 2–3 are stacked on top with `opacity: 0`.
  - Inside `@media (hover: hover) and (pointer: fine)` (a real mouse), hovering shows photo 2.
  - `+` is the **adjacent sibling selector**.
- **Touch carousel** ([product-card.css:56](css/product-card.css#L56)): on phones the photos become a swipeable `scroll-snap` strip.
- **Size picker** ([product-card.css:180](css/product-card.css#L180)): a bottom sheet on phones, a small panel over the card from 768px.
- **Disabled look via ARIA** ([product-card.css:322](css/product-card.css#L322)): `.btn-quick-submit[aria-disabled="true"] { opacity: 0.6; }`
- **Toast** ([product-card.css:337](css/product-card.css#L337)): fades in when JS adds `.show`.

### 4.5 sections.css – banners and sideways-scrolling product rows

**Fade-in on scroll** ([sections.css:5](css/sections.css#L5)): rows start at `opacity: 0; transform: translateY(20px)`; JS adds `.is-visible` when they scroll into view. Users with reduced motion see the rows immediately ([sections.css:20](css/sections.css#L20)).

**Product rows = Bootstrap rows that scroll** ([sections.css:163](css/sections.css#L163)):

```css
/* The track is a Bootstrap .row.flex-nowrap: its row-cols-* classes (set in js/products.js)
   decide the card width - 2 / 3 / 4 / 5 per screen. This file only adds the sideways scrolling. */
.carousel-track {
    overflow-x: auto;                 /* scroll sideways */
    scroll-snap-type: x mandatory;    /* always stop exactly on a card */
    scrollbar-width: none;            /* hide the scrollbar */
}
.carousel-track > .col { scroll-snap-align: start; }
```

The track gets these Bootstrap classes from JS: `row flex-nowrap row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3`.
- **`row`** – flex row.
- **`flex-nowrap`** – never wrap, so extra cards go off to the right and you scroll to them.
- **`row-cols-2`** – each column is 50% wide on phones; **`row-cols-md-3`** 33% from 768px; **`row-cols-lg-4`** 25% from 992px; **`row-cols-xl-5`** 20% from 1200px.
- **`g-3`** – gap (gutter) between cards.

**Arrows only for mouse users** ([sections.css:203](css/sections.css#L203)): touch users swipe instead. Disabled arrows fade out ([sections.css:215](css/sections.css#L215)).

**Banner overlay** ([sections.css:55](css/sections.css#L55)) – same overlay + gradient technique as the hero.

### 4.6 product.css – product page ([product.css:24](css/product.css#L24))

**Gallery layout with CSS Grid and `grid-template-areas`:**

```css
.product-gallery {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
        "main"
        "thumbs";                       /* phones: big photo, thumbnails underneath */
}
@media (min-width: 992px) {
    .product-gallery {
        grid-template-columns: 90px minmax(0, 540px);
        grid-template-areas: "thumbs main";   /* desktop: thumbnails in a column on the left */
    }
}
```

`grid-template-areas` lets you draw the layout with names. Changing the names inside a media query moves the thumbnails without touching the HTML ([product.css:36](css/product.css#L36)).

- **Active thumbnail** ([product.css:76](css/product.css#L76)): styled with the **attribute selector** `[aria-current="true"]` – JS sets that attribute, CSS draws the border.
- **Sticky details** ([product.css:94](css/product.css#L94)): from 768px the details column stays in view while you scroll past the photos.
- **Size buttons** ([product.css:149](css/product.css#L149)) and **quantity** ([product.css:162](css/product.css#L162)): Bootstrap does the work; we only set the sizes. The browser's own number arrows are hidden with `appearance: textfield`.
- **`<details>` accordions** ([product.css:194](css/product.css#L194)): the default triangle is hidden and replaced with `+` / `−` using `::after`; `details[open]` switches the sign.

### 4.7 cart.css – cart drawer

- **Slide in from the right** ([cart.css:23](css/cart.css#L23)): `transform: translateX(100%)` → `translateX(0)`, with the same `visibility` trick as the phone menu.
- **Each item** ([cart.css:104](css/cart.css#L104)): **CSS Grid** `grid-template-columns: 75px 1fr;` → a photo column + a details column.
- **BaadMay details** open with a `max-height` animation ([cart.css:257](css/cart.css#L257)).
- **Check out button:** `.btn-checkout:disabled` greys it out when the cart is empty ([cart.css:308](css/cart.css#L308)).

### 4.8 footer.css – footer

- Light theme (white), like the live site ([footer.css:6](css/footer.css#L6)).
- **Columns come from Bootstrap** (`row` / `col-*` in the HTML); this file only adds spacing and colours ([footer.css:17](css/footer.css#L17)).
- **Accordions only on phones** ([footer.css:171](css/footer.css#L171)): content collapsed with `max-height: 0`; from 768px it is always shown and the `+` icon is hidden.

### 4.9 responsive.css – final adjustments + print

Loaded **last** so it can override everything. Breakpoints used: **480px, 768px, 1024px, 1280px** (ours) plus Bootstrap's **768px (md), 992px (lg), 1200px (xl)**.
- `@media (max-width: 480px)` ([responsive.css:6](css/responsive.css#L6)):
  - Smaller header.
  - Full-width hero buttons.
  - Product cards 65% wide, so you can see the row scrolls ([responsive.css:17](css/responsive.css#L17)).
- `@media print` ([responsive.css:45](css/responsive.css#L45)): hides menus, drawers and buttons when printing.

---

## 5. JavaScript – the 9 scripts

### 5.0 Patterns used in every file (say these in the viva)

**1. IIFE (Immediately Invoked Function Expression)** – every file is wrapped like this ([data.js:4](js/data.js#L4)):

```js
(function (root) {
    "use strict";
    // ... all the code ...
})(window);
```

- Variables inside are **private** – they don't leak into the global scope and can't clash with other files.
- `root` is `window`; a file shares something on purpose by attaching it, e.g. `root.LAMA_DATA = {...}`.
- `"use strict"` makes JavaScript stricter (e.g. an undeclared variable throws an error instead of silently creating a global).

**2. Wait for the HTML** – `document.addEventListener("DOMContentLoaded", function () { ... })`.

**3. Find elements** – `document.getElementById("cartDrawer")`, `document.querySelector(".hero-video")`.

**4. Show/hide with classes, not inline styles** – JS adds/removes classes like `open`, `active`, `is-visible`; **CSS decides how it looks**.

**5. Build elements** – `document.createElement("li")`, set `textContent` (safe – never runs HTML), then `appendChild()`.

**6. Custom events** – files talk to each other without calling each other directly:

```js
window.dispatchEvent(new CustomEvent("cart:add", { detail: {...} }));   // sender
window.addEventListener("cart:add", (e) => { addToCart(e.detail); });   // receiver
```

**7. Modern syntax** – `const`/`let`, arrow functions, template literals `` `Rs.${price}` ``, array methods `forEach`, `find`, `filter`, `reduce`, `some`, `slice`.

### 5.1 data.js – data and shared helpers

**Menu data** ([data.js:8](js/data.js#L8)) – an array of objects; items with `columns` get a dropdown. SHOES and ACCESSORIES have two columns (Woman / Man).

**Photo path helper** ([data.js:164](js/data.js#L164)):

```js
function productImages(slug, count) {
    const images = [];
    for (let n = 1; n <= (count || 3); n++) {
        images.push(`./assets/products/${slug}-${n}.jpg`);
    }
    return images;
}
```

**Products** ([data.js:173](js/data.js#L173)) – 25 objects:

```js
{
    id: "prod-new-1",                 // used in product.html?id=prod-new-1
    name: "TIPPED EDGE SWEATER",
    price: 9950,                      // a number, so we can do maths
    color: "Beige",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: productImages("tipped-edge-sweater-beige"),
    row: "new"                        // which homepage row it belongs to
}
```

**Price formatter** ([data.js:415](js/data.js#L415)): `formatPrice(9950)` → `"Rs.9,950.00"` using `toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })`.

**Scroll-lock counter** ([data.js:423](js/data.js#L423)): every open overlay adds 1, every close subtracts 1. Scrolling is unlocked only at 0, so closing the size picker doesn't unlock the page while the cart is still open.

**Focus trap** ([data.js:448](js/data.js#L448)): when a drawer is open, Tab on the last button jumps to the first, and Shift+Tab on the first jumps to the last. (An accessibility requirement for pop-ups.)

**Sharing** ([data.js:468](js/data.js#L468)): `root.LAMA_DATA = { NAV, PRODUCTS, formatPrice }` and `root.LAMA_UI = { lockScroll, unlockScroll, trapFocus }`.

### 5.2 menu.js – desktop menu, phone drawer, search

**Building the menu from data** ([menu.js:41](js/menu.js#L41)): for each item it creates `<li class="nav-item">` + `<a class="nav-link">` (Bootstrap class names). If the item has `columns`, it also builds the dropdown.

**Open/close with delays** ([menu.js:92](js/menu.js#L92)) – so the menu doesn't flicker when the mouse passes over:

```js
const OPEN_DELAY = 80;    // ms
const CLOSE_DELAY = 150;
li.addEventListener("mouseenter", function () { clearTimeout(closeTimer); openTimer = setTimeout(mega.open, OPEN_DELAY); });
li.addEventListener("mouseleave", function () { clearTimeout(openTimer);  closeTimer = setTimeout(mega.close, CLOSE_DELAY); });
```

`setTimeout` runs a function later; `clearTimeout` cancels it.

**Keyboard support** ([menu.js:127](js/menu.js#L127)): Enter or Space toggles a dropdown; `e.preventDefault()` stops the link from navigating.

**Click outside closes** ([menu.js:150](js/menu.js#L150)): `if (!desktopNavContainer.contains(e.target)) closeAllMega();`

**Phone accordion – one open at a time** ([menu.js:210](js/menu.js#L210)).

**Open/close the phone drawer** ([menu.js:247](js/menu.js#L247)):
- Adds `.open`.
- Locks scroll.
- Sets `aria-expanded="true"`.
- Moves keyboard focus into the drawer.

Closing reverses all of that and puts focus back on the hamburger button. It closes three ways: the X, a click on the backdrop, or Esc.

**Search** ([menu.js:284](js/menu.js#L284)): opens the overlay and focuses the input. On submit, `e.preventDefault()` (no page reload) and the query is printed with `console.log`.

**Esc closes everything** ([menu.js:326](js/menu.js#L326)) and **header shadow on scroll** ([menu.js:344](js/menu.js#L344)) – `{ passive: true }` tells the browser the listener never blocks scrolling.

### 5.3 slider.js – reusable Slider class + hero video

**A JavaScript class** ([slider.js:7](js/slider.js#L7)) – a reusable blueprint; `new Slider({...})` makes a slider for any set of slides:
- `goTo(index)` ([slider.js:55](js/slider.js#L55)) shows one slide and wraps from the last back to the first.
- `restartTimer()` ([slider.js:90](js/slider.js#L90)) uses `setInterval` for autoplay. Autoplay is off when reduced motion is on.
- Pause on hover ([slider.js:155](js/slider.js#L155)).
- Touch swipe ([slider.js:163](js/slider.js#L163)): a finger moving more than 40px counts as a swipe.
- Arrow keys ([slider.js:181](js/slider.js#L181)).

**Used for the announcement bar** ([slider.js:203](js/slider.js#L203)) with `interval: 4000`.

**Hero video + reduced motion** ([slider.js:213](js/slider.js#L213)): the video autoplays from HTML; JS pauses it if the user prefers reduced motion.

### 5.4 products.js – product cards and rows

**`renderProductCard(product)`** ([products.js:14](js/products.js#L14)) returns one `<article class="product-card">`:
1. **Photos** ([products.js:31](js/products.js#L31)):
   - `loading="lazy"`: a photo only downloads when it's near the screen.
   - `width` / `height` are set to stop layout shift.
   - `onerror` swaps in a placeholder if a photo fails.
2. **Swipe dots** ([products.js:60](js/products.js#L60)): the photo showing is `Math.round(scrollLeft / clientWidth)`.
3. **"+" button** ([products.js:69](js/products.js#L69)): sends `quickadd:open` with the product id.
4. **Name link to the product page** ([products.js:93](js/products.js#L93)):
   ```js
   link.href = `product.html?id=${encodeURIComponent(product.id)}`;   // product.html reads ?id= (js/product-page.js)
   ```

**`renderRow(config)`** ([products.js:116](js/products.js#L116)) builds a whole row: banner (`<picture>` with mobile + desktop image, Bootstrap `btn btn-light` buttons), title bar, sideways row of cards, and a "View all N products" `btn btn-outline-dark`.

**The row is a Bootstrap row** ([products.js:236](js/products.js#L236)):

```js
// Bootstrap row that does not wrap (flex-nowrap) + row-cols-* = how many cards fit on screen:
// 2 on phones, 3 from 768px, 4 from 992px, 5 from 1200px. The rest scroll sideways.
track.className = "carousel-track row flex-nowrap row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3";

config.products.forEach(p => {
    const col = document.createElement("div");
    col.className = "col";                     // each card sits in a Bootstrap column
    col.appendChild(renderProductCard(p));
    track.appendChild(col);
});
```

**Arrows** ([products.js:247](js/products.js#L247)):
- **Disabled at the start and end:** `prevBtn.disabled = track.scrollLeft <= 5`.
- **Scroll distance:** each click scrolls by one column width ([products.js:254](js/products.js#L254)) with `track.scrollBy({ left: step, behavior: "smooth" })`.

### 5.5 quick-add.js – the size picker

- **Opening** ([quick-add.js:70](js/quick-add.js#L70)):
  - Finds the product with `products.find(p => p.id === productId)`.
  - Fills in the name and price.
  - Creates one button per size (`aria-pressed` tells screen readers which one is selected).
- **Position** ([quick-add.js:43](js/quick-add.js#L43)): uses `getBoundingClientRect()` to place the panel over the card on desktop.
- **Add to Cart** ([quick-add.js:137](js/quick-add.js#L137)):
  ```js
  if (!selectedSize) { errorMsgEl.hidden = false; return; }   // "Please select a size"
  closeQuickAdd();
  window.dispatchEvent(new CustomEvent("cart:add", { detail: { id, name, price, color, size, image } }));
  showToast("Added to cart");
  ```

### 5.6 cart.js – the cart

**Saving with localStorage** ([cart.js:45](js/cart.js#L45)):

```js
localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
```

- `localStorage` is small storage in the browser that **survives a page refresh**. The key is `"lama_cart"`.
- It stores **only text**, so `JSON.stringify` turns the array into text, and `JSON.parse` turns it back.
- `try/catch` means blocked storage doesn't crash the site.

**Loading safely** ([cart.js:22](js/cart.js#L22)):
- **Broken JSON** → the `catch` resets the cart.
- **Items with wrong data** are dropped by `isValidItem` ([cart.js:13](js/cart.js#L13)).

**Adding – with optional quantity** ([cart.js:55](js/cart.js#L55)):

```js
const qty = Number.isInteger(newItem.quantity) && newItem.quantity > 0 ? newItem.quantity : 1;
const existing = cartItems.find(item => item.id === newItem.id && item.size === newItem.size);
if (existing) {
    existing.quantity = (existing.quantity || 1) + qty;   // same product + same size: add to the quantity
} else {
    cartItems.push({ ...fields..., quantity: qty });
}
```

The size picker sends no quantity (= 1). The product page sends 1–10.

**+ / − / Remove** ([cart.js:76](js/cart.js#L76)): if the quantity reaches 0 the item is removed with `filter`.

**Totals with `reduce`** ([cart.js:97](js/cart.js#L97)):

```js
return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
```

**`renderCartUI()`** ([cart.js:111](js/cart.js#L111)) redraws the cart every time it changes:
- **Badge:** sets the number and `data-count`.
- **Empty state:** shown or hidden.
- **Item list:** rebuilt.
- **BaadMay:** `formatPrice(subtotal / 3)` ([cart.js:223](js/cart.js#L223)).

**Opens automatically after `cart:add`** ([cart.js:298](js/cart.js#L298)) – from the size picker **and** from the product page.

### 5.7 footer.js – newsletter, currency, accordions

- **Email check with a regular expression** ([footer.js:8](js/footer.js#L8)):
  - The pattern is `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`: text with no spaces, then `@`, then text, then `.`, then text.
  - `ali@gmail.com` passes; `ali@` and `ali gmail.com` fail.
- **Submit** ([footer.js:54](js/footer.js#L54)): `e.preventDefault()` stops the page reloading, then it shows "Please enter a valid email address." or "Thanks for subscribing!". No data is sent anywhere.
- **Currency** ([footer.js:28](js/footer.js#L28)): the choice is saved in `localStorage`.
- **Accordions only on phones** ([footer.js:74](js/footer.js#L74)): `window.matchMedia("(max-width: 767px)")` tells JS whether we're on a phone, and re-checks when the window resizes.

### 5.8 main.js – starts the homepage

- **Row settings** ([main.js:15](js/main.js#L15)): one object per row, with its products picked by `productsData.filter(p => p.row === "shoes")`.
- **Render** ([main.js:105](js/main.js#L105)): `catalogContainer.appendChild(renderRow(cfg))`.
- **Fade-in – IntersectionObserver** ([main.js:112](js/main.js#L112)): the browser reports when 10% of a row is on screen, and JS adds `.is-visible` once. This is much more efficient than checking positions on every scroll.

### 5.9 product-page.js – the product page

**1. Which product?** ([product-page.js:35](js/product-page.js#L35))

```js
const params = new URLSearchParams(window.location.search);          // "?id=prod-shoes-2"
const product = products.find(p => p.id === params.get("id")) || products[0];
```

`URLSearchParams` reads the query string; if the id is missing or wrong, the first product is shown.

**2. Fill in the text** – a helper `setText(id, text)`:
- Sets the name, price, `formatPrice(product.price / 3)` for BaadMay, the colour and the description.
- Sets the breadcrumb category from the row name ([product-page.js:8](js/product-page.js#L8)).
- Also sets `document.title`.

**3. Photo gallery** ([product-page.js:70](js/product-page.js#L70)):

```js
function showPhoto(index) {
    mainImage.src = product.images[index];
    thumbs.querySelectorAll(".gallery-thumb").forEach((btn, i) => {
        btn.setAttribute("aria-current", i === index ? "true" : "false");   // CSS draws the border
    });
}
```

One `<button>` per photo is created; clicking it calls `showPhoto(i)`.

**4. Size buttons** ([product-page.js:98](js/product-page.js#L98)):
- For each size it creates `<input type="radio" class="btn-check">` + `<label class="btn btn-outline-dark">`.
- One-size products (bags) are selected automatically.

**5. Quantity** ([product-page.js:130](js/product-page.js#L130)):

```js
function setQty(n) {
    const value = Number.isFinite(n) ? n : QTY_MIN;
    qtyInput.value = Math.min(QTY_MAX, Math.max(QTY_MIN, value));   // keep between 1 and 10
}
```

The − / + buttons call `setQty(current - 1)` / `setQty(current + 1)`; typing 99 becomes 10.

**6. Add to Cart** ([product-page.js:141](js/product-page.js#L141)):

```js
const chosen = form.querySelector('input[name="size"]:checked');
if (!chosen) { sizeError.hidden = false; return; }                // "Please select a size"
window.dispatchEvent(new CustomEvent("cart:add", {
    detail: { id, name, price, color, size: chosen.value, image, quantity: parseInt(qtyInput.value, 10) }
}));
```

It sends the **same `cart:add` event** as the size picker, so `cart.js` handles both – the files never call each other directly.

**7. "You may also like"** ([product-page.js:165](js/product-page.js#L165)):
- Picks up to 4 other products from the same row (`filter` + `slice(0, 4)`).
- Puts `renderProductCard(p)` inside Bootstrap `col` divs in the `row row-cols-2 row-cols-md-4` grid.

### 5.10 Full example: what happens when you add a product to the cart

```text
From the homepage:
1. Click "+" on a card     -> products.js sends "quickadd:open" { id }
2. quick-add.js            -> opens the size picker for that product
3. Pick "M", Add to Cart   -> quick-add.js sends "cart:add" { id, name, price, color, size }

From the product page:
1. Open product.html?id=prod-new-1  -> product-page.js fills the page from data.js
2. Pick a size, set quantity 3, Add to Cart -> product-page.js sends "cart:add" { ..., quantity: 3 }

Both then:
4. cart.js hears "cart:add" -> addToCart(): same id + size ? quantity + n : new item
                            -> saveCart(): localStorage.setItem("lama_cart", JSON.stringify(cartItems))
                            -> renderCartUI(): badge, list, subtotal, BaadMay (subtotal / 3)
                            -> openCart(): slide in the drawer, lock scroll, move focus inside
5. Refresh or open the other page -> loadCart() reads localStorage -> the cart is still there
```

---

## 6. Likely viva questions (with answers)

**Q: Which framework did you use and where?**
Bootstrap 5.3.3, loaded as CSS from a CDN. It does:
- **Header:** the navbar (`navbar`, `navbar-nav`, `nav-link`, `navbar-brand`, `badge`).
- **Grids:**
  - Homepage product rows: `row flex-nowrap row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5`.
  - Product page layout: `row` / `col-12 col-md-6`.
  - "You may also like": `row-cols-2 row-cols-md-4`.
  - Footer: `col-12 col-md-6 col-lg-5` …
- **Components:** buttons, `btn-check` size buttons, `input-group` quantity selector, `form-control`, `form-select` and `breadcrumb`.

**Q: How does the Bootstrap grid work?**
- The screen is split into **12 columns**. `col-6` = 6 of 12 = half width.
- A breakpoint prefix means "from this width up": `col-12 col-md-6` = full width on phones, half from 768px.
- `row-cols-3` instead sets "3 columns per row" for every child.
- Breakpoints: sm 576, **md 768**, **lg 992**, **xl 1200**, xxl 1400.

**Q: How did you change Bootstrap's look without editing Bootstrap?**
- Our CSS is loaded after Bootstrap, so equal rules are overridden.
- We change **Bootstrap's CSS variables**, like `--bs-btn-bg` and `--bs-border-radius: 0`.
- Where Bootstrap is more specific, we write a more specific selector (e.g. `.site-header .navbar-nav .nav-link`).

**Q: Did you use Bootstrap's JavaScript?**
No, only its CSS. Our own JavaScript does the menus, drawers and cart.

**Q: How does one product.html show every product?**
- Product links are `product.html?id=prod-shoes-2`.
- `product-page.js` reads the id with `URLSearchParams`, finds the product in `data.js` with `find`, and fills in the page.

**Q: Where are the menu items and products in the HTML?**
- They aren't there. The HTML has empty containers (`#desktopNavList`, `#homepageCatalogRows`, `#relatedProducts`).
- JavaScript builds them from the arrays in `data.js`, so the data lives in one place.

**Q: What is the DOM?**
The Document Object Model – the browser's tree of objects made from the HTML. JavaScript changes the page through it (`getElementById`, `createElement`, `appendChild`, `classList`).

**Q: What is `DOMContentLoaded`?**
The event fired when the HTML has been fully read. We wait for it so `getElementById` doesn't return `null`.

**Q: What is an IIFE and why use it?**
A function that runs immediately: `(function () { ... })();`. It keeps each file's variables private.

**Q: How do the JS files communicate?**
- Through shared objects on `window` (`LAMA_DATA`, `LAMA_UI`, `LAMA_Products`).
- Through **custom events** (`quickadd:open`, `cart:add`) sent with `dispatchEvent` and received with `addEventListener`.

**Q: How does the cart survive a refresh / moving to the other page?**
- `localStorage`: the cart array is saved as text with `JSON.stringify` under `lama_cart`.
- It's read back with `JSON.parse` when either page loads.

**Q: How is the subtotal calculated?**
- With `reduce`: `sum + price × quantity` for every item, starting at 0.
- BaadMay = subtotal ÷ 3.

**Q: How did you make the quantity selector?**
- A Bootstrap `input-group` with − and + buttons around `<input type="number" min="1" max="10">`.
- JS `setQty()` keeps the value between 1 and 10 with `Math.min` / `Math.max`.

**Q: What is responsive design? How did you do it?**
The page adapts to the screen size:
- **Viewport meta tag.**
- **Mobile-first CSS:** default styles are for phones, then `@media (min-width: …)` adds styles for bigger screens.
- **Bootstrap's responsive classes** (`col-md-6`, `row-cols-lg-4`).
- **Flexbox and Grid.**
- **`<picture>`** for the banners.

Screenshots at 375 / 768 / 1440px are in `screenshots/` and in the completion PDF.

**Q: Flexbox vs Grid?**
- **Flexbox** is one direction (a row or a column): the header, product rows (Bootstrap's grid is built on flexbox) and buttons.
- **CSS Grid** is two dimensions: the product photo gallery (`grid-template-areas`), cart items and the mega menu columns.

**Q: What does `scroll-snap` do?**
- It makes a scroll container stop exactly on an item.
- `scroll-snap-type: x mandatory` on the row + `scroll-snap-align: start` on each column.

**Q: How do the drawers slide in?**
- `transform: translateX(-100%)` / `translateX(100%)` moves them off-screen.
- Adding `.open` sets `translateX(0)`, and `transition` animates it.
- `visibility: hidden` while closed stops keyboard users tabbing into them.

**Q: What are CSS variables?**
- Custom properties like `--color-primary: #111111` on `:root`, used with `var(--color-primary)`.
- Bootstrap uses the same idea (`--bs-…`), which is how we restyled it.

**Q: What is specificity?**
- How the browser decides which rule wins: inline > id > class/attribute/pseudo-class > tag > `*`.
- With equal specificity, the later rule wins.
- Example: Bootstrap's `p { margin-bottom }` beats `* { margin: 0 }`, so we reset `p` again.

**Q: What accessibility features did you add?**
- Semantic tags and correct headings.
- `alt` text and `aria-label` on icon buttons.
- `aria-expanded`, `role="dialog"`, `aria-modal`, `aria-current` (gallery) and `aria-pressed` (sizes).
- A focus trap in pop-ups, with focus returned when they close; Esc closes every overlay.
- `:focus-visible` outlines, a skip link, and `aria-live` messages.
- Labels on every input; `prefers-reduced-motion` support.

**Q: Why `aria-disabled` on the size picker's Add to Cart instead of `disabled`?**
- A `disabled` button ignores clicks, so we couldn't show "Please select a size".
- `aria-disabled="true"` looks and announces disabled but still lets us handle the click.

**Q: Why is the video `muted`?**
- Browsers block autoplay with sound; muted video is allowed to autoplay.
- `playsinline` stops iPhones opening it full-screen.

**Q: What is lazy loading?**
- `loading="lazy"` downloads a photo only when it is about to scroll into view.
- The page loads faster and uses less data.

**Q: What is IntersectionObserver?**
- A browser API that tells you when an element enters the screen.
- I use it to fade in each product row the first time it becomes visible.

**Q: What does `e.preventDefault()` do?**
It stops the browser's default action: a form reloading the page, or a link jumping to `#`.

**Q: What is `textContent` vs `innerHTML`?**
- `textContent` inserts plain text and never runs HTML, so it is safe.
- `innerHTML` parses HTML. I use `textContent` for product data.

**Q: Why are the scripts at the end of `<body>`?**
- So the HTML elements already exist when the scripts run.
- The page also shows faster, because scripts don't block the HTML from loading.

**Q: What would you add next?**
- A collection page with filters and real search results.
- Login.
- A backend (database + payments) for a real checkout.

---

*Educational replica – brand assets belong to Lama Retail.*
