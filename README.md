# 🏺 GriffinPedia

Welcome to GriffinPedia, a simple, interactive, multi-page website dedicated to the characters of the *Family Guy* animated series. This project was built to showcase a clean, modern design with a responsive 50/50 layout and multi-input navigation.

## ✨ Features

* **7-Page Design:** A unique, dedicated page for each main family member (Peter, Lois, Meg, Chris, Stewie, Brian) and a central "Griffin Family" home page.
* **Multi-Input Navigation:** The website is fully controllable via:
    * 🖱️ **Mouse Clicks** (on the "Home" and blue arrow buttons)
    * ⌨️ **Keyboard** (Left and Right arrow keys for "previous" and "next")
    * 👆 **Touch Swipes** (Swipe left or right on mobile devices)
* **Modern Layout:** Uses CSS Flexbox to create a clean, 50/50 split between character details and their images.
* **Custom Typography:** Uses the "Inter" font family (Regular, Semi-Bold, and Bold) for all text, sourced from Google Fonts.

---

## 🛠️ How This Website Was Created

This website was built from scratch using three core web technologies to separate structure, style, and logic.

### 1. HTML5
The structure of all 7 pages is built in a single `index.html` file.
* Each "page" is a `<div>` with a unique ID (e.g., `id="peter-griffin"`).
* Semantic HTML (`<header>`, `<main>`, `<strong>`) is used for accessibility and organization.
* The 50/50 layout is structured using `.text-half` and `.image-half` container divs.

### 2. CSS3
All styling is located in the `styles.css` file.
* **Layout:** CSS Flexbox is the primary tool used to create the page structure and the 50/50 `content-wrapper`.
* **Typography:** The "Inter" font is imported from Google Fonts.
    * Descriptions (`<p>`, `<li>`) are set to **Inter Regular** at `#6D6D6D`.
    * Character names (`<h1>`) are set to **Inter Semi-Bold**.
    * The main family title (`<h1>`) is set to **Inter Bold**.
* **Logic:** The `.active` class is the key to the site's function. This class, when added to a page `<div>`, sets its `display` to `flex`, making it visible. All other pages have `display: none`.

### 3. JavaScript (ES6+)
All interactivity is handled by the `script.js` file.
* **Core Logic:** A `showPage(targetId)` function removes the `.active` class from all pages and then adds it to the one matching the `targetId`.
* **Page Flow:** A `pageFlow` array defines the exact order of pages for keyboard and swipe navigation (e.g., `['griffin-family', 'peter-griffin', ...]`).
* **Event Listeners:** The script uses three different types of event listeners to manage navigation:
    1.  **Mouse Click:** Listens for clicks on `.nav-arrow` and `.nav-button.home` buttons.
    2.  **Keyboard:** A `window.addEventListener('keydown', ...)` listens for `ArrowRight` and `ArrowLeft` keys to navigate.
    3.  **Touch Swipe:** `touchstart` and `touchend` listeners on the main container calculate the swipe distance (`deltaX`) to determine if the user swiped left or right.

---

## 🎨 Character Gallery

This preview uses the same image paths specified in your `index.html` file.

| Character | Image Preview |
| :--- | :--- |
| **Griffin Family** | ![Griffin Family](img/family%20guy.png) |
| **Peter Griffin** | ![Peter Griffin](img/peter.png) |
| **Lois Griffin** | ![Lois Griffin](img/lois.png) |
| **Stewie Griffin** | ![Stewie Griffin](img/stewie.png) |
| **Meg Griffin** | ![Meg Griffin](img/meg%20griffin.png) |
| **Chris Griffin** | ![Chris Griffin](img/chrisgriffin.png) |
| **Brian Griffin** | ![Brian Griffin](img/brain.png) |
