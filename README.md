<div align="center">

  # 🍳 Gourmet Hub — Recipe Finder & Food Ordering App

  **A sleek, modern web application for discovering world recipes and ordering gourmet dishes online.**

  [ Live Demo ](https://imaduuu.github.io/Recipe-Ordering-App/) · [ Source Code ](https://github.com/ImAduuu/Recipe-Ordering-App)

  <br />

  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![API](https://img.shields.io/badge/REST_API-TheMealDB-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://www.themealdb.com/api.php)
  [![License](https://img.shields.io/badge/License-MIT-4BC51D?style=for-the-badge)](LICENSE)

</div>

---

## ⚡ Overview

**Gourmet Hub** bridges culinary discovery and e-commerce into a single interactive platform. Users can search for thousands of recipes using live REST API data, view complete cooking instructions, save favorite dishes, or add meals directly to an interactive shopping basket with real-time price calculations.

---

## 🔥 Key Features

* **🔍 Live Recipe Search & Categories** — Instant search by meal name or one-click filtering (Seafood, Chicken, Pasta, Desserts, etc.).
* **📖 Interactive Recipe Modal** — Popups featuring detailed ingredient measurements, dynamic pricing, and step-by-step instructions.
* **🛒 Shopping Basket & Cart Drawer** — Interactive cart drawer with item quantity controls (`+` / `-`), auto-calculated total pricing, and a quick checkout flow.
* **📌 Saved Favorites** — Bookmark dishes to view later; saved items persist across sessions using browser `localStorage`.
* **✨ Modern Dark Theme** — Responsive layout styled with glassmorphism effects, smooth animations, and fluid CSS Grid cards.

---

## 🛠️ Tech Stack

| Technology | Usage |
| :--- | :--- |
| **JavaScript (ES6+)** | Asynchronous data fetching (`async/await`, Fetch API), DOM Manipulation, and `localStorage` state handling. |
| **HTML5** | Semantic, accessible layout structure. |
| **CSS3** | Modern styling using Flexbox, CSS Grid, CSS Variables, and custom animations. |
| **TheMealDB REST API** | External data source for meals, ingredients, and categories. |
| **FontAwesome & Google Fonts** | Visual iconography and modern typography (`Plus Jakarta Sans`). |

---

## 📁 Project Structure

```text
Recipe-Ordering-App/
├── index.html       # Main HTML Structure
├── style.css        # Modern Dark Theme & Component Styles
├── script.js        # API Fetching, Cart Logic & Event Handlers
└── README.md        # Documentation
