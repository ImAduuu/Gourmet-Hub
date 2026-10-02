
// App State
const API_BASE = 'https://www.themealdb.com/api/json/v1/1';
let bookmarks = JSON.parse(localStorage.getItem('gourmet_bookmarks')) || [];
let cart = JSON.parse(localStorage.getItem('gourmet_cart')) || [];
let currentRecipes = [];

// DOM Elements
const recipeGrid = document.getElementById('recipeGrid');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const categoriesContainer = document.getElementById('categoriesContainer');
const recipeModal = document.getElementById('recipeModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalContent = document.getElementById('modalContent');
const viewBookmarksBtn = document.getElementById('viewBookmarksBtn');
const bookmarkCount = document.getElementById('bookmarkCount');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

// Utility: Price calculation helper
function getPrice(idMeal) {
    const numeric = parseInt(idMeal) || 52772;
    return ((numeric % 15) + 9.99).toFixed(2);
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    fetchRecipesBySearch('');
    updateBookmarkBadge();
    updateCartUI();
});

// Fetch Methods using Fetch API
async function fetchRecipesBySearch(query) {
    renderLoading();
    try {
        const response = await fetch(`${API_BASE}/search.php?s=${query}`);
        const data = await response.json();
        currentRecipes = data.meals || [];
        renderRecipes(currentRecipes);
    } catch (error) {
        renderError('Failed to fetch recipes. Please check your network connection.');
    }
}

async function fetchRecipesByCategory(category) {
    if (category === 'All') return fetchRecipesBySearch('');
    renderLoading();
    try {
        const response = await fetch(`${API_BASE}/filter.php?c=${category}`);
        const data = await response.json();
        currentRecipes = data.meals || [];
        renderRecipes(currentRecipes);
    } catch (error) {
        renderError('Failed to load recipes for this category.');
    }
}

async function fetchRecipeDetails(id) {
    try {
        const response = await fetch(`${API_BASE}/lookup.php?i=${id}`);
        const data = await response.json();
        return data.meals[0];
    } catch (error) {
        return null;
    }
}

// Render Cards to DOM
function renderRecipes(recipes) {
    recipeGrid.innerHTML = '';

    if (!recipes || recipes.length === 0) {
        recipeGrid.innerHTML = `
          <div class="status-msg">
            <i class="fa-solid fa-utensils-slash"></i>
            <h3>No meals found</h3>
            <p>Try searching for another dish or category.</p>
          </div>
        `;
        return;
    }

    recipes.forEach(meal => {
        const isBookmarked = bookmarks.some(b => b.idMeal === meal.idMeal);
        const price = getPrice(meal.idMeal);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="card-img-wrapper">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="card-img" loading="lazy" />
            <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" onclick="toggleBookmark(event, '${meal.idMeal}')">
              <i class="fa-solid fa-bookmark"></i>
            </button>
          </div>
          <div class="card-content">
            <div class="card-header-meta">
              <span class="tag">${meal.strCategory || 'Gourmet'}</span>
              <span class="card-price">$${price}</span>
            </div>
            <h3 class="card-title">${meal.strMeal}</h3>
            <div class="card-actions">
              <button class="card-btn" onclick="openModal('${meal.idMeal}')">Recipe</button>
              <button class="card-btn add-cart-btn" onclick="addToCart('${meal.idMeal}', '${meal.strMeal.replace(/'/g, "\\'")}', '${meal.strMealThumb}', ${price})">
                <i class="fa-solid fa-cart-plus"></i> Order
              </button>
            </div>
          </div>
        `;
        recipeGrid.appendChild(card);
    });
}

// Recipe Details Modal View
async function openModal(id) {
    modalContent.innerHTML = `
        <div class="status-msg">
          <div class="spinner"></div>
          <p>Loading recipe details...</p>
        </div>
      `;
    recipeModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const meal = await fetchRecipeDetails(id);
    if (!meal) return;

    const price = getPrice(meal.idMeal);
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== '') {
            ingredients.push({
                name: meal[`strIngredient${i}`],
                measure: meal[`strMeasure${i}`] || ''
            });
        }
    }

    modalContent.innerHTML = `
        <div class="modal-hero">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="modal-body">
          <div class="modal-title-row">
            <h2 class="modal-title">${meal.strMeal}</h2>
            <span class="modal-price">$${price}</span>
          </div>
          
          <div class="modal-section">
            <h3>Ingredients</h3>
            <ul class="ingredients-list">
              ${ingredients.map(ing => `
                <li>
                  <span>${ing.name}</span>
                  <strong>${ing.measure}</strong>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="modal-section">
            <h3>Cooking Instructions</h3>
            <p style="white-space: pre-line; color: #cbd5e1;">${meal.strInstructions}</p>
          </div>
        </div>
      `;
}

function closeModal() {
    recipeModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Shopping Cart Operations
function addToCart(id, name, img, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, name, img, price: parseFloat(price), qty: 1 });
    }
    saveCart();
    updateCartUI();
    cartDrawer.classList.add('active');
}

function updateCartQty(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qty += change;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('gourmet_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    cartCount.textContent = totalCount;
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin-top: 2rem;">Your basket is empty.</p>`;
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
            <div class="quantity-controls">
              <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
              <span>${item.qty}</span>
              <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
            </div>
          </div>
        </div>
      `).join('');
}

function processCheckout() {
    if (cart.length === 0) {
        alert('Your basket is empty!');
        return;
    }
    alert('Thank you for your order! Your delicious meal is being prepared.');
    cart = [];
    saveCart();
    updateCartUI();
    cartDrawer.classList.remove('active');
}

// Bookmarking System
async function toggleBookmark(e, id) {
    e.stopPropagation();
    const index = bookmarks.findIndex(b => b.idMeal === id);

    if (index > -1) {
        bookmarks.splice(index, 1);
    } else {
        let meal = currentRecipes.find(m => m.idMeal === id);
        if (!meal) meal = await fetchRecipeDetails(id);
        if (meal) bookmarks.push(meal);
    }

    localStorage.setItem('gourmet_bookmarks', JSON.stringify(bookmarks));
    updateBookmarkBadge();
    e.currentTarget.classList.toggle('active');
}

function updateBookmarkBadge() {
    bookmarkCount.textContent = bookmarks.length;
}

// Loading & Error States
function renderLoading() {
    recipeGrid.innerHTML = `
        <div class="status-msg">
          <div class="spinner"></div>
          <p>Fetching culinary delights...</p>
        </div>
      `;
}

function renderError(msg) {
    recipeGrid.innerHTML = `
        <div class="status-msg">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <h3>Error</h3>
          <p>${msg}</p>
        </div>
      `;
}

// Global Event Handlers
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) fetchRecipesBySearch(query);
});

categoriesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('chip')) {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        searchInput.value = '';
        fetchRecipesByCategory(e.target.dataset.category);
    }
});

viewBookmarksBtn.addEventListener('click', () => renderRecipes(bookmarks));
openCartBtn.addEventListener('click', () => cartDrawer.classList.add('active'));
closeCartBtn.addEventListener('click', () => cartDrawer.classList.remove('active'));
closeModalBtn.addEventListener('click', closeModal);
recipeModal.addEventListener('click', (e) => { if (e.target === recipeModal) closeModal(); });
