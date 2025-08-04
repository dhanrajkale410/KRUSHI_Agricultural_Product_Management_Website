const productList = document.getElementById('productList');
const cartItems = document.getElementById('cartItems');
const totalPrice = document.getElementById('totalPrice');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');

let products = [];
let cart = [];

// Fetch products from API
fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
        products = data.products;
        displayProducts(products);
        populateCategories(products);
    });

// Display products
function displayProducts(productArray) {
    productList.innerHTML = '';

    productArray.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
        productList.appendChild(card);
    });
}

// Populate categories for filter
function populateCategories(products) {
    const categories = ['all', ...new Set(products.map(p => p.category))];
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        categoryFilter.appendChild(option);
    });
}

// Filter products
categoryFilter.addEventListener('change', filterProducts);
searchInput.addEventListener('input', filterProducts);

function filterProducts() {
    const category = categoryFilter.value;
    const searchText = searchInput.value.toLowerCase();

    const filtered = products.filter(product => {
        const matchesCategory = category === 'all' || product.category === category;
        const matchesSearch = product.title.toLowerCase().includes(searchText);
        return matchesCategory && matchesSearch;
    });

    displayProducts(filtered);
}

// Add to cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCart();
}

// Update cart display and total
function updateCart() {
    cartItems.innerHTML = '';

    cart.map(item => {
        const li = document.createElement('li');
        li.textContent = `${item.title} - $${item.price}`;
        cartItems.appendChild(li);
    });

    const total = cart.reduce((acc, item) => acc + item.price, 0);
    totalPrice.textContent = total.toFixed(2);
}
