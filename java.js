/* =========================================================
   MINIMERCADO LOS ANDES — lógica de la interfaz
   - Catálogo de productos
   - Búsqueda por nombre
   - Filtro por categoría (pasillo)
   - Carrito de compras persistente (localStorage)
   ========================================================= */

// ----- 1. CATÁLOGO DE PRODUCTOS -----
const PRODUCTS = [
  { id: 1,  name: "Tomate riñón",        unit: "libra",   price: 0.75, emoji: "🍅", category: "frutas",    stock: 40 },
  { id: 2,  name: "Manzana roja",        unit: "libra",   price: 0.90, emoji: "🍎", category: "frutas",    stock: 35 },
  { id: 3,  name: "Banano",              unit: "libra",   price: 0.40, emoji: "🍌", category: "frutas",    stock: 60 },
  { id: 4,  name: "Papa chola",          unit: "libra",   price: 0.55, emoji: "🥔", category: "frutas",    stock: 50 },
  { id: 5,  name: "Cebolla paiteña",     unit: "libra",   price: 0.65, emoji: "🧅", category: "frutas",    stock: 30 },
  { id: 6,  name: "Aguacate",            unit: "unidad",  price: 0.60, emoji: "🥑", category: "frutas",    stock: 25 },

  { id: 7,  name: "Leche entera",        unit: "litro",   price: 1.10, emoji: "🥛", category: "lacteos",   stock: 45 },
  { id: 8,  name: "Queso fresco",        unit: "500 g",   price: 3.20, emoji: "🧀", category: "lacteos",   stock: 20 },
  { id: 9,  name: "Yogurt natural",      unit: "1 L",     price: 2.10, emoji: "🍦", category: "lacteos",   stock: 18 },
  { id: 10, name: "Mantequilla",         unit: "250 g",   price: 1.80, emoji: "🧈", category: "lacteos",   stock: 22 },

  { id: 11, name: "Pan de sal",          unit: "unidad",  price: 0.15, emoji: "🥖", category: "panaderia", stock: 100 },
  { id: 12, name: "Pan integral",        unit: "unidad",  price: 0.25, emoji: "🍞", category: "panaderia", stock: 40 },
  { id: 13, name: "Tortillas de maíz",   unit: "paquete", price: 1.30, emoji: "🫓", category: "panaderia", stock: 24 },

  { id: 14, name: "Agua sin gas",        unit: "600 ml",  price: 0.60, emoji: "💧", category: "bebidas",   stock: 80 },
  { id: 15, name: "Jugo de naranja",     unit: "1 L",     price: 1.90, emoji: "🧃", category: "bebidas",   stock: 30 },
  { id: 16, name: "Gaseosa cola",        unit: "1.5 L",   price: 1.75, emoji: "🥤", category: "bebidas",   stock: 36 },
  { id: 17, name: "Café molido",        unit: "250 g",   price: 3.50, emoji: "☕", category: "bebidas",   stock: 15 },

  { id: 18, name: "Papas fritas",        unit: "150 g",   price: 1.20, emoji: "🍟", category: "snacks",    stock: 42 },
  { id: 19, name: "Galletas dulces",     unit: "paquete", price: 0.85, emoji: "🍪", category: "snacks",    stock: 55 },
  { id: 20, name: "Chocolate barra",     unit: "unidad",  price: 0.95, emoji: "🍫", category: "snacks",    stock: 38 },
  { id: 21, name: "Maní salado",         unit: "100 g",   price: 0.70, emoji: "🥜", category: "snacks",    stock: 33 },

  { id: 22, name: "Detergente líquido",  unit: "1 L",     price: 2.80, emoji: "🧴", category: "aseo",      stock: 20 },
  { id: 23, name: "Jabón de tocador",    unit: "unidad",  price: 0.65, emoji: "🧼", category: "aseo",      stock: 50 },
  { id: 24, name: "Papel higiénico",     unit: "4 rollos",price: 2.20, emoji: "🧻", category: "aseo",      stock: 28 },
];

const CATEGORY_LABELS = {
  frutas: "Frutas y Verduras",
  lacteos: "Lácteos",
  panaderia: "Panadería",
  bebidas: "Bebidas",
  snacks: "Snacks",
  aseo: "Aseo del Hogar",
};

// ----- 2. ESTADO -----
let currentCategory = "todos";
let currentSearch = "";
let cart = loadCart();

// ----- 3. REFERENCIAS AL DOM -----
const productGrid   = document.getElementById("productGrid");
const emptyState     = document.getElementById("emptyState");
const resultCount    = document.getElementById("resultCount");
const searchInput    = document.getElementById("searchInput");
const categoryRow    = document.getElementById("categoryRow");
const cartCountEl    = document.getElementById("cartCount");
const cartItemsEl    = document.getElementById("cartItems");
const cartEmptyMsg   = document.getElementById("cartEmptyMsg");
const cartSummaryEl  = document.getElementById("cartSummary");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartTotalEl    = document.getElementById("cartTotal");
const clearCartBtn   = document.getElementById("clearCartBtn");
const checkoutBtn    = document.getElementById("checkoutBtn");
const toastBody      = document.getElementById("toastBody");
const addToastEl     = document.getElementById("addToast");
const addToast       = new bootstrap.Toast(addToastEl, { delay: 1600 });

// ----- 4. RENDER DE PRODUCTOS -----
function getFilteredProducts() {
  return PRODUCTS.filter((p) => {
    const matchesCategory = currentCategory === "todos" || p.category === currentCategory;
    const matchesSearch = p.name.toLowerCase().includes(currentSearch.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const filtered = getFilteredProducts();

  productGrid.innerHTML = "";
  resultCount.textContent = `${filtered.length} producto${filtered.length === 1 ? "" : "s"}`;

  if (filtered.length === 0) {
    emptyState.classList.remove("d-none");
  } else {
    emptyState.classList.add("d-none");
  }

  filtered.forEach((p) => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-4 col-lg-3";
    col.innerHTML = `
      <div class="product-card">
        <span class="stock-badge">${p.stock} disp.</span>
        <div class="product-emoji">${p.emoji}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-unit">Por ${p.unit}</div>
        <div class="price-tag">${p.price.toFixed(2)}</div>
        <button class="btn add-btn" data-id="${p.id}">
          <i class="bi bi-plus-lg"></i> Agregar
        </button>
      </div>
    `;
    productGrid.appendChild(col);
  });

  // Enlazar botones "Agregar" recién creados
  productGrid.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}

// ----- 5. BÚSQUEDA -----
searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderProducts();
});

// ----- 6. FILTRO POR CATEGORÍA -----
categoryRow.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;

  categoryRow.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  currentCategory = chip.dataset.category;
  renderProducts();
});

// ----- 7. CARRITO -----
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("minimercado_cart")) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem("minimercado_cart", JSON.stringify(cart));
}

function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  cart[productId] = (cart[productId] || 0) + 1;
  saveCart();
  renderCart();
  showToast(`${product.emoji} ${product.name} agregado al carrito`);
}

function changeQty(productId, delta) {
  if (!cart[productId]) return;
  cart[productId] += delta;
  if (cart[productId] <= 0) delete cart[productId];
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
  renderCart();
}

function renderCart() {
  const entries = Object.entries(cart);
  const totalItems = entries.reduce((sum, [, qty]) => sum + qty, 0);
  cartCountEl.textContent = totalItems;

  cartItemsEl.innerHTML = "";

  if (entries.length === 0) {
    cartEmptyMsg.classList.remove("d-none");
    cartSummaryEl.classList.add("d-none");
    return;
  }

  cartEmptyMsg.classList.add("d-none");
  cartSummaryEl.classList.remove("d-none");

  let subtotal = 0;

  entries.forEach(([id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === Number(id));
    if (!product) return;
    const lineTotal = product.price * qty;
    subtotal += lineTotal;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-emoji">${product.emoji}</div>
      <div class="flex-grow-1">
        <div class="cart-item-name">${product.name}</div>
        <div class="cart-item-price">$${lineTotal.toFixed(2)}</div>
        <div class="qty-controls mt-1">
          <button data-action="dec" data-id="${product.id}">−</button>
          <span>${qty}</span>
          <button data-action="inc" data-id="${product.id}">+</button>
        </div>
      </div>
      <button class="remove-item-btn" data-action="remove" data-id="${product.id}">
        <i class="bi bi-trash3"></i>
      </button>
    `;
    cartItemsEl.appendChild(row);
  });

  cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  cartTotalEl.textContent = `$${subtotal.toFixed(2)}`;
}

cartItemsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;

  if (action === "inc") changeQty(id, 1);
  if (action === "dec") changeQty(id, -1);
  if (action === "remove") removeFromCart(id);
});

clearCartBtn.addEventListener("click", () => {
  cart = {};
  saveCart();
  renderCart();
});

checkoutBtn.addEventListener("click", () => {
  if (Object.keys(cart).length === 0) return;
  showToast("¡Gracias por tu compra! 🧺");
  cart = {};
  saveCart();
  renderCart();
  bootstrap.Offcanvas.getInstance(document.getElementById("cartPanel"))?.hide();
});

function showToast(message) {
  toastBody.textContent = message;
  addToast.show();
}

// ----- 8. INICIALIZACIÓN -----
renderProducts();
renderCart();