// ============ PRODUCTS ============
const products = [
    { id: 1, name: "IKEA Office Chair", brand: "IKEA", category: "Furniture", price: 250, badge: "Best Seller", image :"images/office-chair.jfif" },
    { id: 2, name: "LG Split AC 1.5 Ton", brand: "LG", category: "Appliances", price: 1200, badge: "Premium" ,image :"images/ac.jfif" },
    { id: 3, name: "Samsung Refrigerator", brand: "Samsung", category: "Appliances", price: 1500, badge: "" , image :"images/refrigerator.jfif" },
    { id: 4, name: "Bosch Washing Machine", brand: "Bosch", category: "Appliances", price: 900, badge: "" , image:"images/washing-machine.jfif" },
    { id: 5, name: "Siemens Microwave", brand: "Siemens", category: "Appliances", price: 450, badge: "" ,image :"images/microwave.jfif" },
    { id: 6, name: "Miele Vacuum Cleaner", brand: "Miele", category: "Appliances", price: 600, badge: "Premium"  , image :"images/vacume-cleaner.jfif"},
    { id: 7, name: "Hitachi Window AC", brand: "Hitachi", category: "Appliances", price: 800, badge: "" , image :"images/hitachi-window-ac.jfif"},
    { id: 8, name: "IKEA Executive Desk", brand: "IKEA", category: "Furniture", price: 350, badge: "New" , image :"images/executive-desk.jfif" },
    { id: 9, name: "Antique Furniture Set", brand: "Antique", category: "Furniture", price: 0, badge: "Rare" , image :"images/antiunique-furniture-set.jfif" },
    { id: 10, name: "Garden Furniture Set", brand: "Outdoor", category: "Furniture", price: 700, badge: "" , image :"images/garden-furniture-set.jfif" },
    { id: 11, name: "Restaurant Equipment Set", brand: "Commercial", category: "Electronics", price: 0, badge: "", image :"images/resturant-equipment.jfif" },
    { id: 12, name: "Sound System Premium", brand: "Bang & Olufsen", category: "Electronics", price: 2500, badge: "Luxury" , image :"images/sound-system.jfif" }
];

const WHATSAPP_NUMBER = "971555555555"; // 👈 apna number daal

let cart = [];

// ============ RENDER PRODUCTS ============
function renderProducts(filter = "all") {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    const filtered = filter === "all"
        ? products
        : products.filter(p => p.category === filter);

    filtered.forEach((product, i) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.style.animationDelay = `${i * 0.06}s`;

        const imgUrl = product.image ? product.image : `https://via.placeholder.com/400x300/c9a961/ffffff?text=${encodeURIComponent(product.brand)}`;
        const priceText = product.price > 0 ? `AED ${product.price.toLocaleString()}` : "Call for Price";

        card.innerHTML = `
            <div class="img-wrap">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
                <img src="${imgUrl}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="brand">${product.brand}</p>
                <p class="price">${priceText}</p>
                <div class="product-actions">
                    <button class="add-cart-btn" data-id="${product.id}">Add to Cart</button>
                    <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi Al Riyada, I'm interested in: ${product.name} (${product.brand}). Please share details.`)}"
                       class="quick-wa-btn" target="_blank" title="Enquire on WhatsApp">💬</a>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });

    // Add to cart buttons
    document.querySelectorAll(".add-cart-btn").forEach(btn => {
        btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.id)));
    });
}

// ============ CART LOGIC ============
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (product.price === 0) {
        // Call for price — direct WhatsApp
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi Al Riyada, I'm interested in: ${product.name}. Please share price and details.`)}`, "_blank");
        return;
    }

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCart();
    showToast(`${product.name} added to cart`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const subtotalEl = document.getElementById("cartSubtotal");
    const totalEl = document.getElementById("cartTotal");
    const footer = document.getElementById("cartFooter");

    const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        footer.style.display = "none";
        return;
    }

    footer.style.display = "block";

    cartItems.innerHTML = cart.map(item => {
        const imgUrl = `https://via.placeholder.com/100x100/c9a961/ffffff?text=${encodeURIComponent(item.brand)}`;
        return `
            <div class="cart-item">
                <img src="${imgUrl}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="item-price">AED ${item.price.toLocaleString()}</p>
                    <div class="qty-controls">
                        <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
                        <span class="qty-num">${item.qty}</span>
                        <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
        `;
    }).join("");

    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    subtotalEl.textContent = `AED ${subtotal.toLocaleString()}`;
    totalEl.textContent = `AED ${subtotal.toLocaleString()}`;

    // Bind qty buttons
    cartItems.querySelectorAll(".qty-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);
            changeQty(id, btn.dataset.action === "inc" ? 1 : -1);
        });
    });

    cartItems.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => removeFromCart(parseInt(btn.dataset.id)));
    });
}

// ============ DRAWER ============
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function openCart() {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

// ============ CHECKOUT ============
function openCheckout() {
    if (cart.length === 0) {
        showToast("Your cart is empty");
        return;
    }
    document.getElementById("modalOverlay").classList.add("active");
    closeCart();
}

function submitCheckout(e) {
    e.preventDefault();

    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const address = document.getElementById("custAddress").value.trim();
    const emirate = document.getElementById("custEmirate").value;
    const notes = document.getElementById("custNotes").value.trim();

    let message = `*New Order — Al Riyada*\n\n`;
    message += `*Customer:* ${name}\n`;
    message += `*Phone:* ${phone}\n`;
    message += `*Address:* ${address}, ${emirate}\n`;
    if (notes) message += `*Notes:* ${notes}\n`;

    message += `\n*Order Items:*\n`;
    cart.forEach((item, i) => {
        message += `${i + 1}. ${item.name} (${item.brand}) × ${item.qty} — AED ${(item.price * item.qty).toLocaleString()}\n`;
    });

    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    message += `\n*Total: AED ${subtotal.toLocaleString()}*`;
    message += `\n\nPlease confirm my order. Thank you!`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    // Reset
    document.getElementById("modalOverlay").classList.remove("active");
    document.getElementById("checkoutForm").reset();
    cart = [];
    updateCart();
}

// ============ TOAST ============
let toastTimer;
function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

// ============ INIT ============
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();

    // Filter buttons
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderProducts(btn.dataset.filter);
        });
    });

    // Cart open/close
    document.getElementById("cartBtn").addEventListener("click", openCart);
    document.getElementById("cartClose").addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    // Checkout
    document.getElementById("checkoutBtn").addEventListener("click", openCheckout);
    document.getElementById("checkoutForm").addEventListener("submit", submitCheckout);
    document.getElementById("modalClose").addEventListener("click", () => {
        document.getElementById("modalOverlay").classList.remove("active");
    });

    // Header scroll
    const header = document.getElementById("header");
    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 50);
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute("href"));
            if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    updateCart();
});