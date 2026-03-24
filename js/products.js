const API_BASE_URL = 'http://localhost:8080/api';

// Load all products when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

// Fetch all products from backend
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

// Display products in the grid
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

// Search products by name
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

// Add to cart (will implement fully in Session 9)
function addToCart(productId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add items to cart!');
        return;
    }
    alert(`Product ${productId} added to cart!`);
}