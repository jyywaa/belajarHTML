// Initial Initial Data
const defaultProducts = [
    {
        id: 1,
        name: "Smartphone Pro Max 15",
        price: 15000000,
        old: 17500000,
        diskon: "14%",
        category: "Smartphone",
        img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
        desc: "Layar 120Hz Super AMOLED, RAM 12GB, Internal 256GB. Kamera 108MP."
    },
    {
        id: 2,
        name: "Laptop Ultra Slim Z",
        price: 12500000,
        old: 14000000,
        diskon: "10%",
        category: "Laptop",
        img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80",
        desc: "Processor Intel i7, RAM 16GB SSD 512GB, Layar IPS Full HD."
    }
];

// App States
let products = JSON.parse(localStorage.getItem('barang')) || defaultProducts;
let cart = JSON.parse(localStorage.getItem('mochiCart')) || [];
let currentUser = JSON.parse(localStorage.getItem('mochiUser')) || null;
let activeTab = 'all';

if (!localStorage.getItem('barang')) {
    localStorage.setItem('barang', JSON.stringify(products));
}

// Toast
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// Onboarding & Login
function nextStep(step) {
    const email = document.getElementById('onboard-email').value;
    if (step === 2 && !email) {
        showToast("⚠️ Mohon isi email terlebih dahulu!");
        return;
    }
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
}

function handleLogin() {
    const userIn = document.getElementById('onboard-user').value.trim();
    const passIn = document.getElementById('onboard-pass').value.trim();

    if ((userIn === "customer" || userIn === "kholi") && passIn === "123") {
        currentUser = { username: userIn, role: "customer" };
    } else if (userIn === "meila" && passIn === "meila123") {
        currentUser = { username: "meila", role: "admin" };
    } else {
        showToast("❌ Username / password salah!");
        return;
    }

    localStorage.setItem('mochiUser', JSON.stringify(currentUser));
    document.getElementById('onboarding-overlay').style.display = 'none';
    showToast("Selamat Datang, " + currentUser.username + "!");
    initApp();
}

// Logout Modal (Custom Modal Without Browser Confirm)
function openLogoutModal() {
    document.getElementById('logout-modal').classList.add('active');
}

function closeLogoutModal() {
    document.getElementById('logout-modal').classList.remove('active');
}

function confirmLogout() {
    closeLogoutModal();
    localStorage.removeItem('mochiUser');
    currentUser = null;

    // Reset overlay view back to login step 1
    document.getElementById('onboarding-overlay').style.display = 'flex';
    document.getElementById('step-1').style.display = 'block';
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('onboard-email').value = '';
    document.getElementById('onboard-user').value = '';
    document.getElementById('onboard-pass').value = '';
    
    showToast("Anda telah keluar.");
}

// Views Navigation
function showView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    if (viewName === 'home') {
        document.getElementById('view-home').classList.add('active');
        document.getElementById('nav-home').classList.add('active');
    } else if (viewName === 'cart') {
        document.getElementById('view-cart').classList.add('active');
        document.getElementById('nav-cart').classList.add('active');
        renderCart();
    } else if (viewName === 'profile') {
        document.getElementById('view-profile').classList.add('active');
        document.getElementById('nav-profile').classList.add('active');
    } else if (viewName === 'admin') {
        document.getElementById('view-admin').classList.add('active');
        renderAdminTable();
    }
}

// Product Filter & Rendering
function filterTab(category, btnElem) {
    activeTab = category;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btnElem.classList.add('active');
    renderProducts();
}

function renderProducts() {
    const listContainer = document.getElementById('product-list');
    const searchKeyword = document.getElementById('search-input').value.toLowerCase();
    listContainer.innerHTML = '';

    let filtered = products.filter(p => {
        let matchCat = (activeTab === 'all') ? true : p.category === activeTab;
        let matchSearch = p.name.toLowerCase().includes(searchKeyword);
        return matchCat && matchSearch;
    });

    filtered.forEach(p => {
        listContainer.innerHTML += `
            <div class="product-card" onclick="openDetail(${p.id})">
                <span class="badge-discount">${p.diskon || 'PROMO'}</span>
                <img src="${p.img}" class="product-img" alt="${p.name}">
                <div class="product-title">${p.name}</div>
                <div class="product-price-old">Rp ${p.old ? p.old.toLocaleString('id-ID') : '-'}</div>
                <div class="product-price">Rp ${p.price.toLocaleString('id-ID')}</div>
                <button class="btn" style="padding: 6px; font-size: 11px; margin-top: 8px;" onclick="event.stopPropagation(); addToCart(${p.id})">🛒 Beli Sekarang</button>
            </div>
        `;
    });
}

// Product Detail
function openDetail(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const detailContainer = document.getElementById('detail-content');
    
    // Video player element if uploaded
    let videoHTML = product.video ? `<div style="margin-top:10px;"><b>Demo Video:</b><video src="${product.video}" controls style="width:100%; border-radius:8px; margin-top:5px;"></video></div>` : '';

    detailContainer.innerHTML = `
        <img src="${product.img}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px;">
        ${videoHTML}
        <h2 style="font-size: 16px; margin-top: 10px; color: #1e392a;">${product.name}</h2>
        <div style="color: #1e392a; font-size: 18px; font-weight: bold; margin: 5px 0;">
            Rp ${product.price.toLocaleString('id-ID')}
        </div>
        <p style="font-size: 12px; color: #555; margin-bottom: 15px; white-space: pre-line;">${product.desc}</p>
        
        <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline" onclick="addToCart(${product.id})">+ Keranjang</button>
            <button class="btn" onclick="addToCart(${product.id}); showView('cart');">🛒 Beli Sekarang</button>
        </div>
    `;
    showView('detail');
}

// Cart Logic
function addToCart(id) {
    const prod = products.find(p => p.id === id);
    cart.push(prod);
    localStorage.setItem('mochiCart', JSON.stringify(cart));
    updateCartBadge();
    showToast("🛒 " + prod.name + " ditambahkan!");
}

function updateCartBadge() {
    document.getElementById('cart-badge-count').innerText = cart.length;
}

function renderCart() {
    const cartContainer = document.getElementById('cart-list');
    cartContainer.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #888;">Keranjang belanja kosong</div>`;
    } else {
        cart.forEach((item, index) => {
            subtotal += item.price;
            cartContainer.innerHTML += `
                <div class="cart-item">
                    <input type="checkbox" checked>
                    <img src="${item.img}" alt="Thumb">
                    <div style="flex:1;">
                        <div style="font-weight: bold; font-size: 12px;">${item.name}</div>
                        <div style="color: #1e392a; font-size: 12px; font-weight: bold;">Rp ${item.price.toLocaleString('id-ID')}</div>
                    </div>
                    <button style="background: none; border: none; color: red; cursor: pointer;" onclick="removeFromCart(${index})">🗑️</button>
                </div>
            `;
        });
    }

    const total = cart.length > 0 ? subtotal + 20000 : 0;
    document.getElementById('cart-subtotal').innerText = 'Rp ' + subtotal.toLocaleString('id-ID');
    document.getElementById('cart-total').innerText = 'Rp ' + total.toLocaleString('id-ID');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('mochiCart', JSON.stringify(cart));
    renderCart();
    updateCartBadge();
}

function checkout() {
    if (cart.length === 0) {
        showToast("⚠️ Keranjang Anda masih kosong!");
        return;
    }
    cart = [];
    localStorage.setItem('mochiCart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
    showToast("🎉 Checkout Berhasil! Pesanan sedang diproses.");
}

// Admin Save Product with File Reading (FileReader Base64)
function saveAdminProduct() {
    const name = document.getElementById('admin-name').value;
    const desc = document.getElementById('admin-desc').value;
    const price = parseInt(document.getElementById('admin-price').value);
    const category = document.getElementById('admin-category').value;
    
    const imgFileInput = document.getElementById('admin-img-file');
    const videoFileInput = document.getElementById('admin-video-file');

    if (!name || !price || imgFileInput.files.length === 0) {
        showToast("⚠️ Isi Nama, Harga, dan Pilih File Gambar!");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const imgBase64 = e.target.result;
        
        const saveProductData = (videoBase64 = null) => {
            const newProd = {
                id: Date.now(),
                name: name,
                desc: desc,
                price: price,
                old: price + 500000,
                diskon: "PROMO",
                category: category,
                img: imgBase64,
                video: videoBase64
            };

            products.push(newProd);
            localStorage.setItem('barang', JSON.stringify(products));
            showToast("✅ Produk Berhasil Disimpan ke Database!");

            // Reset inputs
            document.getElementById('admin-name').value = '';
            document.getElementById('admin-desc').value = '';
            document.getElementById('admin-price').value = '';
            imgFileInput.value = '';
            videoFileInput.value = '';

            renderAdminTable();
            renderProducts();
        };

        if (videoFileInput.files.length > 0) {
            const videoReader = new FileReader();
            videoReader.onload = function(vEvent) {
                saveProductData(vEvent.target.result);
            };
            videoReader.readAsDataURL(videoFileInput.files[0]);
        } else {
            saveProductData(null);
        }
    };

    reader.readAsDataURL(imgFileInput.files[0]);
}

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    localStorage.setItem('barang', JSON.stringify(products));
    renderAdminTable();
    renderProducts();
    showToast("Barang berhasil dihapus");
}

function renderAdminTable() {
    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = '';
    products.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td><b>${p.name}</b></td>
                <td>Rp ${p.price.toLocaleString('id-ID')}</td>
                <td>${p.category}</td>
                <td><button style="background:red; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="deleteProduct(${p.id})">Hapus</button></td>
            </tr>
        `;
    });
}

// App Initialization
function initApp() {
    if (!currentUser) {
        document.getElementById('onboarding-overlay').style.display = 'flex';
    } else {
        document.getElementById('onboarding-overlay').style.display = 'none';
        document.getElementById('header-user-display').innerText = currentUser.username;
        document.getElementById('profile-name').innerText = currentUser.username;

        if (currentUser.role === 'admin') {
            showView('admin');
        } else {
            showView('home');
        }
    }
    updateCartBadge();
    renderProducts();
}

window.onload = initApp;
