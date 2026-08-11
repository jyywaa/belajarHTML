/* ------------------------------------------
   1. INITIAL STATE & LOCAL STORAGE
   ------------------------------------------ */
// Link video diperbarui ke sampel video tech/nature bukan hewan
const defaultProducts = [
    {
        id: 101,
        name: "Smartphone Premium Ultra 5G",
        price: 12000000,
        desc: "Layar 120Hz AMOLED, RAM 12GB, Storage 512GB, Kamera 108MP.",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        rating: 4.9,
        sold: 142,
        bestseller: true,
        colors: ["Phantom Black", "Emerald Green"],
        specs: ["256GB", "512GB"]
    },
    {
        id: 102,
        name: "Laptop Pro Book Studio 16",
        price: 24500000,
        desc: "Processor Chip M-Pro, RAM 32GB, SSD 1TB, Retina Display.",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        rating: 4.8,
        sold: 89,
        bestseller: true,
        colors: ["Space Gray", "Silver"],
        specs: ["16GB RAM", "32GB RAM"]
    },
    {
        id: 103,
        name: "Smartwatch Active Pro",
        price: 3200000,
        desc: "Sensor Detak Jantung, GPS, Tahan Air 50m, Baterai 7 Hari.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        rating: 4.7,
        sold: 210,
        bestseller: false,
        colors: ["Black", "Gold"],
        specs: ["40mm", "44mm"]
    }
];

let state = {
    user: JSON.parse(localStorage.getItem('app_user')) || null,
    products: JSON.parse(localStorage.getItem('app_products')) || defaultProducts,
    cart: JSON.parse(localStorage.getItem('app_cart')) || [],
    orders: JSON.parse(localStorage.getItem('app_orders')) || [],
    wizardStep: 1,
    selectedVariations: {}
};

function saveState() {
    localStorage.setItem('app_user', JSON.stringify(state.user));
    localStorage.setItem('app_products', JSON.stringify(state.products));
    localStorage.setItem('app_cart', JSON.stringify(state.cart));
    localStorage.setItem('app_orders', JSON.stringify(state.orders));
    updateUI();
}

/* ------------------------------------------
   2. UI TOAST & NAVIGATION & MODALS
   ------------------------------------------ */
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function switchTab(tabName, el) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    
    document.getElementById(`view-${tabName}`).classList.add('active');
    if(el) el.classList.add('active');
}

function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

/* ------------------------------------------
   3. ONBOARDING WIZARD & LOGOUT
   ------------------------------------------ */
function checkOnboarding() {
    if (!state.user) {
        document.getElementById('modal-onboarding').classList.add('active');
    } else {
        document.getElementById('modal-onboarding').classList.remove('active');
        document.getElementById('user-header-name').innerText = state.user.username;
    }
}

function handleWizardStep(e) {
    e.preventDefault();
    if (state.wizardStep === 1) {
        state.wizardStep = 2;
        document.getElementById('wizard-step-1').style.display = 'none';
        document.getElementById('wizard-step-2').style.display = 'block';
        document.getElementById('wizard-subtitle').innerText = "Langkah 2 dari 3: Buat Akun Anda";
        document.getElementById('wiz-username').required = true;
        document.getElementById('wiz-password').required = true;
    } else if (state.wizardStep === 2) {
        state.wizardStep = 3;
        document.getElementById('wizard-step-2').style.display = 'none';
        document.getElementById('wizard-step-3').style.display = 'block';
        document.getElementById('wizard-subtitle').innerText = "Langkah 3 dari 3: Nomor Kontak";
        document.getElementById('wiz-phone').required = true;
        document.getElementById('wiz-btn-next').innerText = "Selesai & Belanja";
    } else if (state.wizardStep === 3) {
        state.user = {
            email: document.getElementById('wiz-email').value,
            username: document.getElementById('wiz-username').value,
            phone: document.getElementById('wiz-phone').value
        };
        saveState();
        showToast(`Selamat datang, ${state.user.username}!`);
        checkOnboarding();
    }
}

function confirmLogout() {
    state.user = null;
    state.wizardStep = 1;
    localStorage.removeItem('app_user');
    localStorage.removeItem('app_products'); // Reset produk ke default saat logout
    location.reload();
}

/* ------------------------------------------
   4. ADMIN FORM HANDLING
   ------------------------------------------ */
function handleAdminSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('admin-name').value;
    const desc = document.getElementById('admin-desc').value;
    const image = document.getElementById('admin-image').value;
    const video = document.getElementById('admin-video').value;

    const priceMatch = desc.match(/Rp\s?([\d.]+)/i);
    const price = priceMatch ? parseInt(priceMatch[1].replace(/\./g, '')) : 10000000;

    const newProd = {
        id: Date.now(),
        name: name,
        price: price,
        desc: desc,
        image: image,
        video: video,
        rating: 5.0,
        sold: 0,
        bestseller: false,
        colors: ["Default Color"],
        specs: ["Standard Spec"]
    };

    state.products.unshift(newProd);
    saveState();
    document.getElementById('admin-form').reset();
    showToast("Produk berhasil disimpan ke Database!");
}

/* ------------------------------------------
   5. RENDER PRODUCTS & VARIATIONS
   ------------------------------------------ */
function formatRupiah(num) {
    return "Rp " + num.toLocaleString('id-ID');
}

function selectChip(btn, productId, type, value) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
    btn.classList.add('selected');

    if (!state.selectedVariations[productId]) {
        state.selectedVariations[productId] = {};
    }
    state.selectedVariations[productId][type] = value;
}

function renderProducts() {
    const bestsellerContainer = document.getElementById('bestseller-list');
    const gridContainer = document.getElementById('product-grid');
    
    bestsellerContainer.innerHTML = '';
    gridContainer.innerHTML = '';

    state.products.forEach(p => {
        if(!state.selectedVariations[p.id]) {
            state.selectedVariations[p.id] = {
                color: p.colors[0],
                spec: p.specs[0]
            };
        }

        const productHtml = `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <div class="product-info">
                    <div class="product-title">${p.name}</div>
                    <div class="product-price">${formatRupiah(p.price)}</div>
                    <div class="product-desc">${p.desc}</div>
                    
                    <video class="product-video" controls muted poster="${p.image}">
                        <source src="${p.video}" type="video/mp4">
                        Browser tidak mendukung video.
                    </video>

                    <div class="product-meta">
                        <span>⭐ ${p.rating}</span>
                        <span>Terjual ${p.sold}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-outline" onclick="addToCart(${p.id})">+ Keranjang</button>
                        <a href="#" class="btn btn-accent" onclick="directBuy(${p.id})">Beli Now</a>
                    </div>
                    <button class="btn btn-outline" style="margin-top: 4px; font-size:10px; padding:4px;" onclick="openDetail(${p.id})">Detail & Variasi</button>
                </div>
            </div>
        `;

        gridContainer.innerHTML += productHtml;

        if (p.bestseller) {
            bestsellerContainer.innerHTML += `
                <div class="scroll-item">
                    <img src="${p.image}" style="width:100%; height:90px; object-fit:cover; border-radius:6px;">
                    <div style="font-size:12px; font-weight:bold; margin-top:4px;" class="product-title">${p.name}</div>
                    <div style="font-size:11px; color:var(--primary); font-weight:bold;">${formatRupiah(p.price)}</div>
                    <button class="btn btn-accent" style="font-size:10px; padding:4px; margin-top:4px;" onclick="openDetail(${p.id})">Lihat</button>
                </div>
            `;
        }
    });
}

function openDetail(id) {
    const p = state.products.find(item => item.id === id);
    if (!p) return;

    const selected = state.selectedVariations[p.id];

    const html = `
        <img src="${p.image}" style="width:100%; height:180px; object-fit:cover; border-radius:8px; margin-bottom:10px;">
        <h3>${p.name}</h3>
        <h4 style="color:var(--primary); font-size:16px; margin-bottom:8px;">${formatRupiah(p.price)}</h4>
        <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">${p.desc}</p>
        
        <div class="variation-group">
            <div class="variation-title">Pilih Warna:</div>
            <div class="variation-options">
                ${p.colors.map(c => `<div class="chip ${c === selected.color ? 'selected':''}" onclick="selectChip(this, ${p.id}, 'color', '${c}')">${c}</div>`).join('')}
            </div>
        </div>

        <div class="variation-group">
            <div class="variation-title">Pilih Spesifikasi/Ukuran:</div>
            <div class="variation-options">
                ${p.specs.map(s => `<div class="chip ${s === selected.spec ? 'selected':''}" onclick="selectChip(this, ${p.id}, 'spec', '${s}')">${s}</div>`).join('')}
            </div>
        </div>

        <div style="margin-top:16px; border-top:1px solid var(--border); padding-top:10px;">
            <h4 style="font-size:12px; margin-bottom:6px;">Ulasan Pembeli:</h4>
            <div style="display:flex; gap:8px; align-items:center; font-size:11px;">
                <div style="width:24px; height:24px; background:#DDD; border-radius:50%; display:flex; align-items:center; justify-content:center;">👤</div>
                <div><strong>User_Pro:</strong> Barang sesuai deskripsi, pengiriman COD cepat! ⭐⭐⭐⭐⭐</div>
            </div>
        </div>

        <div style="display:flex; gap:8px; margin-top:16px;">
            <button class="btn btn-outline" onclick="addToCart(${p.id}); closeModal('modal-detail');">+ Keranjang</button>
            <button class="btn btn-accent" onclick="directBuy(${p.id})">Beli Sekarang</button>
        </div>
    `;

    document.getElementById('detail-content').innerHTML = html;
    openModal('modal-detail');
}

/* ------------------------------------------
   6. CART & CHECKOUT MANAGEMENT
   ------------------------------------------ */
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    const variation = state.selectedVariations[productId] || { color: product.colors[0], spec: product.specs[0] };

    const cartIndex = state.cart.findIndex(item => item.id === productId && item.color === variation.color && item.spec === variation.spec);

    if (cartIndex > -1) {
        state.cart[cartIndex].qty += 1;
    } else {
        state.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            color: variation.color,
            spec: variation.spec,
            qty: 1,
            checked: true
        });
    }

    saveState();
    showToast("Produk ditambahkan ke keranjang!");
}

function directBuy(productId) {
    addToCart(productId);
    closeModal('modal-detail');
    switchTab('cart', document.querySelectorAll('.nav-item')[1]);
}

function toggleCartCheck(index) {
    state.cart[index].checked = !state.cart[index].checked;
    saveState();
}

function removeCartItem(index) {
    state.cart.splice(index, 1);
    saveState();
    showToast("Produk dihapus dari keranjang.");
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    document.getElementById('cart-badge').innerText = state.cart.reduce((acc, i) => acc + i.qty, 0);

    if (state.cart.length === 0) {
        container.innerHTML = `<p style="font-size:12px; color:var(--text-muted); text-align:center; padding:20px 0;">Keranjang Anda kosong.</p>`;
        document.getElementById('cart-subtotal').innerText = "Rp 0";
        document.getElementById('cart-total').innerText = "Rp 0";
        return;
    }

    container.innerHTML = '';
    let subtotal = 0;

    state.cart.forEach((item, idx) => {
        if(item.checked) subtotal += item.price * item.qty;

        container.innerHTML += `
            <div class="cart-item">
                <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleCartCheck(${idx})">
                <img src="${item.image}">
                <div class="cart-details">
                    <h4>${item.name}</h4>
                    <p>Variasi: ${item.color} | ${item.spec}</p>
                    <p><strong>${formatRupiah(item.price)}</strong> x ${item.qty}</p>
                </div>
                <button onclick="removeCartItem(${idx})" style="border:none; background:none; color:red; font-size:16px; cursor:pointer;">🗑️</button>
            </div>
        `;
    });

    const shipping = subtotal > 0 ? 20000 : 0;
    document.getElementById('cart-subtotal').innerText = formatRupiah(subtotal);
    document.getElementById('cart-shipping').innerText = formatRupiah(shipping);
    document.getElementById('cart-total').innerText = formatRupiah(subtotal + shipping);
}

function processCheckout() {
    const checkedItems = state.cart.filter(i => i.checked);
    if (checkedItems.length === 0) {
        showToast("Pilih minimal satu produk untuk checkout.");
        return;
    }

    const subtotal = checkedItems.reduce((acc, i) => acc + (i.price * i.qty), 0);
    const total = subtotal + 20000;
    const orderId = "#VCZ-" + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
        id: orderId,
        date: new Date().toLocaleDateString('id-ID'),
        items: checkedItems,
        total: total,
        status: "Pesanan Belum Dibayar",
        paymentMethod: "COD (Bayar di Tempat)"
    };

    state.orders.unshift(newOrder);
    state.cart = state.cart.filter(i => !i.checked);
    saveState();

    simulateOrderStatus(orderId);

    showToast("Checkout Berhasil! Pesanan diproses.");
    switchTab('profile', document.querySelectorAll('.nav-item')[2]);
}

/* ------------------------------------------
   7. ORDER STATUS & PROFILE MANAGEMENT
   ------------------------------------------ */
function simulateOrderStatus(orderId) {
    setTimeout(() => {
        updateOrderStatus(orderId, "Pesanan Diproses (Dikemas)");
    }, 3000);

    setTimeout(() => {
        updateOrderStatus(orderId, "Pesanan Dikirim");
    }, 8000);

    setTimeout(() => {
        updateOrderStatus(orderId, "Pesanan Selesai");
    }, 15000);
}

function updateOrderStatus(orderId, newStatus) {
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        saveState();
    }
}

function renderProfileAndOrders() {
    if (state.user) {
        document.getElementById('profile-username').innerText = state.user.username;
        document.getElementById('profile-email').innerText = state.user.email;
        document.getElementById('profile-phone').innerText = state.user.phone;
    }

    const container = document.getElementById('orders-container');
    if (state.orders.length === 0) {
        container.innerHTML = `<p style="font-size:12px; color:var(--text-muted);">Belum ada histori pesanan.</p>`;
        return;
    }

    container.innerHTML = '';
    state.orders.forEach(o => {
        let statusClass = "status-pending";
        if (o.status.includes("Diproses")) statusClass = "status-process";
        if (o.status.includes("Dikirim")) statusClass = "status-shipped";
        if (o.status.includes("Selesai")) statusClass = "status-completed";

        const itemsSummary = o.items.map(i => `${i.name} (${i.color}, ${i.spec}) x${i.qty}`).join('<br>');

        container.innerHTML += `
            <div class="card" style="margin-bottom:12px; padding:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <strong style="font-size:12px; color:var(--primary);">${o.id}</strong>
                    <span class="status-badge ${statusClass}">${o.status}</span>
                </div>
                <div style="font-size:11px; color:var(--text-dark); margin-bottom:8px;">
                    ${itemsSummary}
                </div>
                <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:bold; border-top:1px solid var(--border); padding-top:6px;">
                    <span>Metode: ${o.paymentMethod}</span>
                    <span>Total: ${formatRupiah(o.total)}</span>
                </div>
            </div>
        `;
    });
}

/* ------------------------------------------
   8. MASTER UI UPDATE
   ------------------------------------------ */
function updateUI() {
    renderProducts();
    renderCart();
    renderProfileAndOrders();
}

window.addEventListener('DOMContentLoaded', () => {
    checkOnboarding();
    updateUI();
});