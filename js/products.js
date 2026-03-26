const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    loadProducts();
});

function updateNavbar() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const authLinks = document.getElementById('authLinks');

    if (token) {
        authLinks.innerHTML = `
            <span style="color:white; margin-left:20px;">Hi, ${username}!</span>
            <a href="#" onclick="logout()" style="margin-left:20px;">Logout</a>
        `;
    } else {
        authLinks.innerHTML = `
            <a href="login.html" style="margin-left:20px;">Login</a>
            <a href="register.html" style="margin-left:20px;">Register</a>
        `;
    }
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsGrid').innerHTML = 
            '<p class="message">Failed to load products. Make sure the backend is running.</p>';
    }
}

function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = '<p class="message">No products found.</p>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.imageUrl || 'https://via.placeholder.com/250x200'}" 
                 alt="${product.name}"
                 onerror="this.src='https://via.placeholder.com/250x200'">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">₹${product.price.toFixed(2)}</div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

async function searchProducts() {
    const query = document.getElementById('searchInput').value.trim();
    
    if (query === '') {
        loadProducts();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products/search?name=${query}`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error searching products:', error);
    }
}

function addToCart(productId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add items to cart!');
        window.location.href = 'login.html';
        return;
    }
    alert(`Product ${productId} added to cart!`);
}