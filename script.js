const products = [
  {
    id: 1,
    name: 'Aero Headphones',
    category: 'electronics',
    price: 179,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    tag: 'Popular'
  },
  {
    id: 2,
    name: 'Trail Runner',
    category: 'fitness',
    price: 129,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    tag: 'Best Seller'
  },
  {
    id: 3,
    name: 'Luna Lamp',
    category: 'home',
    price: 89,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    tag: 'New'
  },
  {
    id: 4,
    name: 'Urban Jacket',
    category: 'fashion',
    price: 144,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    tag: 'Hot'
  },
  {
    id: 5,
    name: 'Smart Watch',
    category: 'electronics',
    price: 229,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80',
    tag: 'Limited'
  },
  {
    id: 6,
    name: 'Minimal Chair',
    category: 'home',
    price: 199,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    tag: 'Top Rated'
  },
  {
    id: 7,
    name: 'Core Bottle',
    category: 'fitness',
    price: 35,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
    tag: 'Eco'
  },
  {
    id: 8,
    name: 'Classic Hoodie',
    category: 'fashion',
    price: 74,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    tag: 'Trending'
  }
];

const productGrid = document.getElementById('productGrid');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');
const toast = document.getElementById('toast');

const cart = [];

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  const filtered = products.filter((product) => {
    const matchesText = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory = category === 'all' || product.category === category;
    return matchesText && matchesCategory;
  });

  if (!filtered.length) {
    productGrid.innerHTML = '<div class="empty-state">No products found matching your search.</div>';
    return;
  }

  productGrid.innerHTML = filtered.map((product) => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-body">
        <div class="product-header">
          <h3>${product.name}</h3>
          <span class="tag">${product.tag}</span>
        </div>
        <div class="product-meta">
          <span class="price">${formatPrice(product.price)}</span>
          <span class="rating">★ ${product.rating}</span>
        </div>
        <button data-id="${product.id}">Add to cart</button>
      </div>
    </article>
  `).join('');

  const buttons = productGrid.querySelectorAll('button[data-id]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.id)));
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  showToast(`${product.name} added to cart`);
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    cartTotal.textContent = formatPrice(0);
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <h4>${item.name}</h4>
        <p>Qty: ${item.quantity}</p>
        <button data-remove-id="${item.id}">Remove</button>
      </div>
      <div class="price-tag">${formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = formatPrice(total);

  document.querySelectorAll('[data-remove-id]').forEach((button) => {
    button.addEventListener('click', () => removeFromCart(Number(button.dataset.removeId)));
  });
}

function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index === -1) return;

  cart.splice(index, 1);
  updateCartUI();
  showToast('Item removed from cart');
}

searchInput.addEventListener('input', renderProducts);
categoryFilter.addEventListener('change', renderProducts);

document.querySelector('.cart-button').addEventListener('click', () => {
  cartDrawer.classList.add('open');
});

closeCart.addEventListener('click', () => {
  cartDrawer.classList.remove('open');
});

renderProducts();
updateCartUI();
