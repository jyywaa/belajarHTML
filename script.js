// Initial Products Default Data (HANYA HP & LAPTOP)
const defaultProducts = [
    {
        id: 101,
        name: "Smartphone Premium Ultra 5G",
        price: 12000000,
        desc: "Layar 120Hz AMOLED, RAM 12GB, Storage 512GB, Kamera 108MP.",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
        video: "./video5.mp4",
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
        video: "./video6.mp4",
        rating: 4.8,
        sold: 89,
        bestseller: true,
        colors: ["Space Gray", "Silver"],
        specs: ["16GB RAM", "32GB RAM"]
    },
    {
        id: 103,
        name: "Foldable Pro Z Phone",
        price: 18500000,
        desc: "Layar Lipat Dynamic AMOLED 2X, Dual Battery, Engsel Flexion.",
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500",
        video: "./video7.mp4",
        rating: 5.0,
        sold: 64,
        bestseller: true,
        colors: ["Cream", "Phantom Black"],
        specs: ["256GB", "512GB"]
    },
    {
        id: 104,
        name: "Smartphone Compact 5G",
        price: 8500000,
        desc: "Desain Ringkas, Kamera AI Dual, Chipset Kencang & Hemat Daya.",
        image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500",
        video: "./video8.mp4",
        rating: 4.7,
        sold: 110,
        bestseller: false,
        colors: ["Lavender", "Black"],
        specs: ["128GB", "256GB"]
    }
];

// PAKSA HAPUS MEMORI LAMA: Hilangkan data 'Smartwatch' dari HP
localStorage.removeItem('app_products'); 

let state = {
    user: JSON.parse(localStorage.getItem('app_user')) || null,
    products: defaultProducts, // Gunakan defaultProducts murni
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

// Toast & Modals
function showToast(message) {
    const container = document.getElementById('toast-container');
    if(!container) return;
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

    const target = document.getElementById(`view-${tabName}`);
    if(target) target.classList.add('active');
    if(el) el.classList.add('active');
}

function openModal(id) { 
    const el = document.getElementById(id);
    if(el) el.classList.add('active'); 
}

function closeModal(id) { 
    const el = document.getElementById(id);
    if(el) el.classList.remove('active'); 
}

// Login & Onboarding
function checkOnboarding() {
    const modal = document.getElementById('modal-onboarding');
    const headerName = document.getElementById('user-header-name');
    const adminPanel = document.getElementById('admin-panel');
    const adminDivider = document.getElementById('admin-divider');

    if (!state.user) {
        if(modal) modal.classList.add('active');
    } else {
        if(modal) modal.classList.remove('active');
        if(headerName) headerName.innerText = state.user.username;

        if (state.user.role === 'admin') {
            if(adminPanel) adminPanel.style.display = 'block';
            if(adminDivider) adminDivider.style.display = 'block';
        } else {
            if(adminPanel) adminPanel.style.display = 'none';
            if(adminDivider) adminDivider.style.display = 'none';
        }
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
        const email = document.getElementById('wiz-email').value;
        const username = document.getElementById('wiz-username').value;
        const pass = document.getElementById('wiz-password').value;
        const phone = document.getElementById('wiz-phone').value;

        let role = "customer";
        if (username.toLowerCase() === "meila" && pass === "meila123") {
            role = "admin";
        }

        state.user = { email, username, phone, role };
        saveState();
        showToast(`Selamat datang, ${state.user.username}!`);
        checkOnboarding();
    }
}

function confirmLogout() {
    state.user = null;
    state.wizardStep = 1;
    localStorage.removeItem('app_user');
    location.reload();
}

// Form Admin
function handleAdminSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('admin-name').value;
    const desc = document.getElementById('admin-desc').value;
    const price = parseInt(document.getElementById('admin-price').value);

    const imgFile = document.getElementById('admin-image-file').files[0];
    const videoFile = document.getElementById('admin-video-file').files[0];

    if (!imgFile) {
        showToast("⚠️ Silakan upload gambar produk!");
        return;
    }

    const readerImg = new FileReader();
    readerImg.onload = function(eImg) {
        const imgBase64 = eImg.target.result;

        const processSave = (videoBase64 = "") => {
            const newProd = {
                id: Date.now(),
                name: name,
                price: price,
                desc: desc,
                image: imgBase64,
                video: videoBase64,
                rating: 5.0,
                sold: 0,
                bestseller: false,
                colors: ["Default Color"],
                specs: ["Standard Spec"]
            };

            state.products.unshift(newProd);
            saveState();
            document.getElementById('admin-form').reset();
            showToast("✅ Produk berhasil disimpan!");
        };

        if (videoFile) {
            const readerVideo = new FileReader();
            readerVideo.onload = function(eVideo) {
                processSave(eVideo.target.result);
            };
            readerVideo.readAsDataURL(videoFile);
        } else {
            processSave("");
        }
    };

    readerImg.readAsDataURL(imgFile);
}

function formatRupiah(num) {
    return "Rp " + (num || 0).toLocaleString('id-ID');
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

    if(!gridContainer) return;
    if(bestsellerContainer) bestsellerContainer.innerHTML = '';
    gridContainer.innerHTML = '';

    state.products.forEach(p => {
        if(!state.selectedVariations[p.id]) {
            state.selectedVariations[p.id] = {
                color: p.colors ? p.colors[0] : "Default",
                spec: p.specs ? p.specs[0] : "Standard"
            };
        }

        const videoHtml = p.video ? `
            <video class="product-video" controls muted playsinline preload="metadata" poster="${p.image}">
                <source src="${p.video}" type="video/mp4">
            </video>` : '';

        const productHtml = `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <div class="product-info">
                    <div class="product-title">${p.name}</div>
                    <div class="product-price">${formatRupiah(p.price)}</div>
                    <div class="product-desc">${p.desc}</div>
                    ${videoHtml}
                    <div class="product-meta">
                        <span>⭐ ${p.rating || 5.0}</span>
                        <span>Terjual ${p.sold || 0}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-outline" onclick="addToCart(${p.id})">+ Keranjang</button>
                        <button class="btn btn-accent" onclick="directBuy(${p.id})">Beli</button>
                    </div>
                    <button class="btn btn-outline" style="margin-top: 6px; font-size:10px; padding:4px;" onclick="openDetail(${p.id})">Detail & Variasi</button>
                </div>
            </div>
        `;

        gridContainer.innerHTML += productHtml;

        if (p.bestseller && bestsellerContainer) {
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

    const selected = state.selectedVariations[p.id] || { color: p.colors[0], spec: p.specs[0] };
    const videoHtml = p.video ? `<video src="${p.video}" controls playsinline style="width:100%; max-height:180px; border-radius:8px; margin-bottom:10px; background:#000;"></video>` : '';

    const html = `
        <img src="${p.image}" style="width:100%; height:180px; object-fit:cover; border-radius:8px; margin-bottom:10px;">
        ${videoHtml}
        <h3>${p.name}</h3>
        <h4 style="color:var(--primary); font-size:16px; margin-bottom:8px;">${formatRupiah(p.price)}</h4>
        <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">${p.desc}</p>
        
        <div class="variation-group">
            <div class="variation-title">Pilih Warna:</div>
            <div class="variation-options">
                ${(p.colors || ["Standard"]).map(c => `<div class="chip ${c === selected.color ? 'selected':''}" onclick="selectChip(this, ${p.id}, 'color', '${c}')">${c}</div>`).join('')}
            </div>
        </div>

        <div class="variation-group">
            <div class="variation-title">Pilih Spesifikasi/Ukuran:</div>
            <div class="variation-options">
                ${(p.specs || ["Standard"]).map(s => `<div class="chip ${s === selected.spec ? 'selected':''}" onclick="selectChip(this, ${p.id}, 'spec', '${s}')">${s}</div>`).join('')}
            </div>
        </div>

        <div style="display:flex; gap:8px; margin-top:16px;">
            <button class="btn btn-outline" onclick="addToCart(${p.id}); closeModal('modal-detail');">+ Keranjang</button>
            <button class="btn btn-accent" onclick="directBuy(${p.id})">Beli Sekarang</button>
        </div>
    `;

    const detailContent = document.getElementById('detail-content');
    if(detailContent) detailContent.innerHTML = html;
    openModal('modal-detail');
}

function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if(!product) return;

    const variation = state.selectedVariations[productId] || { 
        color: product.colors ? product.colors[0] : "Default", 
        spec: product.specs ? product.specs[0] : "Standard" 
    };

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
    if(state.cart[index]) {
        state.cart[index].checked = !state.cart[index].checked;
        saveState();
    }
}

function removeCartItem(index) {
    state.cart.splice(index, 1);
    saveState();
    showToast("Produk dihapus.");
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('cart-badge');
    if(badge) badge.innerText = state.cart.reduce((acc, i) => acc + i.qty, 0);

    if (!container) return;

    if (state.cart.length === 0) {
        container.innerHTML = `<p style="font-size:12px; color:var(--text-muted); text-align:center; padding:20px 0;">Keranjang Anda kosong.</p>`;
        if(document.getElementById('cart-subtotal')) document.getElementById('cart-subtotal').innerText = "Rp 0";
        if(document.getElementById('cart-total')) document.getElementById('cart-total').innerText = "Rp 0";
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
    if(document.getElementById('cart-subtotal')) document.getElementById('cart-subtotal').innerText = formatRupiah(subtotal);
    if(document.getElementById('cart-shipping')) document.getElementById('cart-shipping').innerText = formatRupiah(shipping);
    if(document.getElementById('cart-total')) document.getElementById('cart-total').innerText = formatRupiah(subtotal + shipping);
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
        items: checkedItems,
        total: total,
        status: "Pesanan Belum Dibayar",
        paymentMethod: "COD (Bayar di Tempat)"
    };

    state.orders.unshift(newOrder);
    state.cart = state.cart.filter(i => !i.checked);
    saveState();

    showToast("Checkout Berhasil! Pesanan diproses.");
    switchTab('profile', document.querySelectorAll('.nav-item')[2]);
}

function renderProfileAndOrders() {
    if (state.user) {
        if(document.getElementById('profile-username')) document.getElementById('profile-username').innerText = state.user.username;
        if(document.getElementById('profile-email')) document.getElementById('profile-email').innerText = state.user.email;
        if(document.getElementById('profile-phone')) document.getElementById('profile-phone').innerText = state.user.phone;
        if(document.getElementById('profile-role-tag')) document.getElementById('profile-role-tag').innerText = state.user.role === 'admin' ? 'Administrator' : 'VIP Member';
    }

    const container = document.getElementById('orders-container');
    if(!container) return;

    if (state.orders.length === 0) {
        container.innerHTML = `<p style="font-size:12px; color:var(--text-muted);">Belum ada histori pesanan.</p>`;
        return;
    }

    container.innerHTML = '';
    state.orders.forEach(o => {
        const itemsSummary = o.items.map(i => `${i.name} (${i.color}, ${i.spec}) x${i.qty}`).join('<br>');

        container.innerHTML += `
            <div class="card" style="margin-bottom:12px; padding:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <strong style="font-size:12px; color:var(--primary);">${o.id}</strong>
                    <span class="status-badge status-process">${o.status}</span>
                </div>
                <div style="font-size:11px; color:var(--text-dark); margin-bottom:8px;">${itemsSummary}</div>
                <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:bold; border-top:1px solid var(--border); padding-top:6px;">
                    <span>Metode: ${o.paymentMethod}</span>
                    <span>Total: ${formatRupiah(o.total)}</span>
                </div>
            </div>
        `;
    });
}

function updateUI() {
    renderProducts();
    renderCart();
    renderProfileAndOrders();
}

window.addEventListener('DOMContentLoaded', () => {
    checkOnboarding();
    updateUI();
});
