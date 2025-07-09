document.addEventListener('DOMContentLoaded', () => {
  // Dark Mode Toggle
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  }

  // Load Cart from LocalStorage
  const cartContainer = document.getElementById('cart-items');
  const cartSummary = document.getElementById('cart-summary');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function renderCart() {
    if (!cartContainer || !cartSummary) return;

    cartContainer.innerHTML = '';
    let subtotal = 0;
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="item-image"/>
        <div class="item-details">
          <h4>${item.name}</h4>
          <p>Price: ${formatCurrency(item.price)}</p>
          <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="item-quantity" />
          <button data-index="${index}" class="remove-item">Remove</button>
        </div>
      `;
      cartContainer.appendChild(div);
    });

    const discount = getDiscount(subtotal);
    const shipping = getShipping(subtotal);
    const total = subtotal - discount + shipping;

    cartSummary.innerHTML = `
      <p>Subtotal: ${formatCurrency(subtotal)}</p>
      <p>Discount: -${formatCurrency(discount)}</p>
      <p>Shipping: ${formatCurrency(shipping)}</p>
      <h3>Total: ${formatCurrency(total)}</h3>
    `;
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: getCurrency() }).format(amount);
  }

  function getCurrency() {
    return localStorage.getItem('currency') || 'USD';
  }

  function getDiscount(subtotal) {
    const code = document.getElementById('discount-code')?.value.trim().toUpperCase();
    if (code === 'BEAUTY10') {
      return subtotal * 0.1;
    }
    return 0;
  }

  function getShipping(subtotal) {
    return subtotal > 100 ? 0 : 10;
  }

  // Update Quantity
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('item-quantity')) {
      const index = parseInt(e.target.dataset.index);
      const value = parseInt(e.target.value);
      if (value > 0) {
        cart[index].quantity = value;
        saveCart();
        renderCart();
      }
    }
  });

  // Remove Item
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
      const index = parseInt(e.target.dataset.index);
      cart.splice(index, 1);
      saveCart();
      renderCart();
    }
  });

  // Apply Discount
  document.getElementById('apply-discount')?.addEventListener('click', () => {
    renderCart();
  });

  // Checkout Button Handler
  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (total === 0) return alert('Your cart is empty.');

    const currency = getCurrency();

    // Simulate Payment Gateway Redirect
    alert(`Redirecting to ${currency === 'KES' ? 'M-Pesa' : 'PayPal/Stripe'} checkout for ${formatCurrency(total)}...`);
    // TODO: Integrate real APIs (M-Pesa via Daraja, PayPal, Stripe)
  });

  // Currency Selector
  document.getElementById('currency-selector')?.addEventListener('change', (e) => {
    localStorage.setItem('currency', e.target.value);
    renderCart();
  });

  // Live badge update (optional)
  const cartBadge = document.getElementById('cart-badge');
  if (cartBadge) {
    cartBadge.textContent = cart.length;
  }

  renderCart();
});
