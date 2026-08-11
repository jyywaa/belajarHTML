/* ------------------------------------------
   1. INITIAL STATE & LOCAL STORAGE
   ------------------------------------------ */
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

function updateUI() {
    renderProducts();
    checkOnboarding();
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
   3. ONBOARDING WIZARD & LOGOUT (ROLE ADMIN vs PEMBELI)
   ------------------------------------------ */
function checkOnboarding() {
    const adminPanel = document.getElementById('admin-panel');
    const adminDivider = document.getElementById('admin-divider');

    if (!state.user) {
        document.getElementById('modal-onboarding').classList.add('active');
        if (adminPanel) adminPanel.style.display = 'none';
        if (adminDivider) adminDivider.style.display = 'none';
    } else {
        document.getElementById('modal-onboarding').classList.remove('active');
        document.getElementById('user-header-name').innerText = state.user.username;

        // Cek Role Admin: kholi / 123
        if (state.user.role === 'admin') {
            if (adminPanel) adminPanel.style.display = 'block';
            if (adminDivider) adminDivider.style.display = 'block';
        } else {
            if (adminPanel) adminPanel.style.display = 'none';
            if (adminDivider) adminDivider.style.display = 'none';
        }

        // Update tampilan Profil
        const pName = document.getElementById('profile-username');
        const pEmail = document.getElementById('profile-email');
        const pPhone = document.getElementById('profile-phone');
        const pBadge = document.getElementById('profile-role-badge');
        const pStatus = document.getElementById('profile-status');

        if (pName) pName.innerText = state.user.username;
        if (pEmail) pEmail.innerText = state.user.email;
        if (pPhone) pPhone.innerText = state.user.phone;
        if (pBadge) pBadge.innerText = state.user.role === 'admin' ? 'ADM' : 'VIP';
        if (pStatus) pStatus.innerText = state.user.role === 'admin' ? 'Administrator' : 'VIP Member';
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
        const u = document.getElementById('wiz-username').value;
        const p = document.getElementById('wiz-password').value;

        if (u.toLowerCase() === 'kholi' && p !== '123') {
            alert('Password Admin kholi adalah 123!');
            return;
        }

        state.wizardStep = 3;
        document.getElementById('wizard-step-2').style.display = 'none';
        document.getElementById('wizard-step-3').style.display = 'block';
        document.getElementById('wizard-subtitle').innerText = "Langkah 3 dari 3: Nomor Kontak";
        document.getElementById('wiz-phone').required = true;
        document.getElementById('wiz-btn-next').innerText = "Selesai & Belanja";
    } else if (state.wizardStep === 3) {
        const u = document.getElementById('wiz-username').value;
        const p = document.getElementById('wiz-password').value;
        const isAdmin = (u.toLowerCase() === 'kholi' && p === '123');

        state.user = {
            email: document.getElementById('wiz-email').value,
            username: u,
            phone: document.getElementById('wiz-phone').value,
            role: isAdmin ? 'admin' : 'pembeli'
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
    location.reload();
}

/* ------------------------------------------
   4. ADMIN FORM HANDLING (MEMBACA UPLOAD FILE)
   ------------------------------------------ */
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = err => reject(err);
        reader.readAsDataURL(file);
    });
}

async function handleAdminSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('admin-name').value;
    const desc = document.getElementById('admin-desc').value;
    const imageFile = document.getElementById('admin-image').files[0];
    const videoFile = document.getElementById('admin-video').files[0];

    if (!imageFile || !videoFile) {
        showToast("Pilih file Gambar dan Video terlebih dahulu!");
        return;
    }

    try {
        const imageSrc = await readFile(imageFile);
        const videoSrc = await readFile(videoFile);

        const priceMatch = desc.match(/Rp\s?([\d.]+)/i);
        const price = priceMatch ? parseInt(priceMatch[1].replace(/\./g, '')) : 10000000;

        const newProd = {
            id: Date.now(),
            name: name,
            price: price,
            desc: desc,
            image: imageSrc,
            video: videoSrc,
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
    } catch (err) {
        showToast("Gagal membaca file upload!");
    }
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
    
    if(!bestsellerContainer || !gridContainer) return;

    bestsellerContainer.innerHTML = '';
    gridContainer.innerHTML = '';

    state.products.forEach(p => {
        if(!state.selectedVariations[p.id]) {
            state.selectedVariations[p.id] = {
                color: p.colors ? p.colors[0] : "Default",
                spec: p.specs ? p.specs[0] : "Default"
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
                        <source src="${p.video}">
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

    const html = `
        <img src="${p.image}" style="width:100%; height:180px; object-fit:cover; border-radius:6px;">
        <h3 style="font-size:15px; margin-top:8px;">${p.name}</h3>
        <h4 style="color:var(--primary); font-size:14px;">${formatRupiah(p.price)}</h4>
        <p style="font-size:12px; color:var(--text-muted); margin-top:4px;">${p.desc}</p>
        <video controls style="width:100%; border-radius:6px; margin-top:8px;">
            <source src="${p.video}">
        </video>
        <button class="btn btn-accent" style="margin-top:12px;" onclick="addToCart(${p.id}); closeModal('modal-detail');">Tambah Ke Keranjang</button>
    `;
    
    document.getElementById('detail-content').innerHTML = html;
    openModal('modal-detail');
}

function addToCart(id) {
    const p = state.products.find(item => item.id === id);
    if(p) {
        state.cart.push(p);
        saveState();
        showToast("Berhasil masuk keranjang!");
    }
}

function directBuy(id) {
    addToCart(id);
    switchTab('cart');
}

document.addEventListener('DOMContentLoaded', updateUI);
