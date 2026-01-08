 /* ===== PRODUCTS DATA ===== */



   function renderProducts(list) {
      // clear all product grids
      document.querySelectorAll(".product-grid").forEach(grid => grid.innerHTML = "");

      list.forEach(p => {
        const grid = document.querySelector(`.product-grid[data-category="${p.category}"]`);
        if (!grid) return;

        grid.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}" onclick="window.location='product-detail.html?id=${p.id}'">

        <div class="product-info">
          <p>${p.name}</p>
          <span class="price">$${p.price}</span>
          <button class="add-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    `;
      });
    }

    renderProducts(products);

    /* ===== SEARCH ===== */
    document.getElementById("searchInput").addEventListener("input", e => {
      const value = e.target.value.toLowerCase();
      renderProducts(products.filter(p => p.name.toLowerCase().includes(value)));
    });

    /* ===== CART ===== */
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(p => p.id && p.price); // only valid products
    updateCartCount();
    /* ===== OPEN/CLOSE CART ===== */
    const cartModal = document.getElementById("cartModal");
    const cartBtn = document.querySelector(".cart");
    const closeCart = document.getElementById("closeCart");

    cartBtn.addEventListener("click", () => {
      cartModal.style.display = "flex";
      renderCart();
    });

    closeCart.addEventListener("click", () => {
      cartModal.style.display = "none";
    });

    window.addEventListener("click", e => {
      if (e.target === cartModal) cartModal.style.display = "none";
    });

    /* ===== ADD TO CART ===== */
    document.addEventListener("click", e => {
      if (e.target.classList.contains("add-cart")) {
        const id = parseInt(e.target.dataset.id);
        const product = products.find(p => p.id === id);
        if (!product) return;

        const existing = cart.find(p => p.id === id);
        if (existing) {
          existing.quantity++;
        } else {
          // make sure all fields exist
          cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        renderCart(); // optional: update cart modal immediately
      }

      // REMOVE ITEM FROM CART
      if (e.target.classList.contains("remove-cart")) {
        const id = parseInt(e.target.dataset.id);
        cart = cart.filter(p => p.id !== id);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        renderCart();
      }
    });

    /* ===== UPDATE CART COUNT ===== */
    function updateCartCount() {
      const count = cart.reduce((sum, p) => sum + p.quantity, 0);
      document.getElementById("cartCount").innerText = count;
    }

    /* ===== RENDER CART ===== */
    function renderCart() {
      const cartItems = document.getElementById("cartItems");
      const cartTotal = document.getElementById("cartTotal");
      cartItems.innerHTML = "";

      let total = 0;
      cart.forEach(p => {
        if (!p.name || !p.price) return; // safety check
        total += p.price * p.quantity;

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
      <span>${p.name} x ${p.quantity}</span>
      <span>$${(p.price * p.quantity).toFixed(2)}</span>
      <button class="remove-cart" data-id="${p.id}">❌</button>
    `;
        cartItems.appendChild(div);
      });

      cartTotal.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    }
    function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}
function updateNavbarUser() {
  const user = getCurrentUser();
  const loginBtn = document.querySelector(".login-btn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!loginBtn) return;

  if (user) {
    loginBtn.innerText = user.username;
    loginBtn.href = "#";

    if (logoutBtn) {
      logoutBtn.style.display = "inline";
      logoutBtn.onclick = logout;
    }
  }
}
function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("cart"); // optional
  window.location.href = "Login.html";
}
function requireLogin() {
  if (!getCurrentUser()) {
    window.location.href = "Login.html";
  }
}
updateNavbarUser();


