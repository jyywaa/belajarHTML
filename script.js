/* STATE Awal & LocalStorage */
const defaultProducts = [
    {
        id: 101,
        name: "Smartphone Premium Ultra 5G",
        price: 12000000,
        desc: "Layar 120Hz AMOLED, RAM 12GB. Harga: Rp 12.000.000",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        rating: 4.9,
        sold: 142
    }
];

let state = {
    user: JSON.parse(localStorage.getItem('app_user')) || null,
    products: JSON.parse(localStorage.getItem('app_products')) || defaultProducts,
    cart: JSON.parse(localStorage.getItem('app_cart')) || [],
    wizardStep: 1
};

function saveState() {
    localStorage.setItem('app_user', JSON.stringify(state.user));
    localStorage.setItem('app_products', JSON.stringify(state.products));
    localStorage.setItem('app_cart', JSON.stringify(state.cart));
    updateUI();
}

function updateUI() {
    renderProducts();
    checkRoleAndOnboarding();
}

/* CEK LOGIN & ROLE ADMIN/PEMBELI */
function checkRoleAndOnboarding() {
    const adminPanel = document.getElementById('admin-panel');
    const adminDivider = document.getElementById('admin-divider');

    if (!state.user) {
        document.getElementById('modal-onboarding').classList.add('active');
    } else {
        document.getElementById('modal-onboarding').classList.remove('active');
        document.getElementById('user-header-name').innerText = state.user.username;

        // Jika login sebagai Admin (kholi)
        if (state.user.role === 'admin') {
            if (adminPanel) adminPanel.style.display = 'block';
            if (adminDivider) adminDivider.style.display = 'block';
        } else { // Pembeli biasa
            if (adminPanel) adminPanel.style.display = 'none';
            if (adminDivider) adminDivider.style.display = 'none';
        }

        document.getElementById('profile-username').innerText = state.user.username;
        document.getElementById('profile-email').innerText = state.user.email;
        document.getElementById('profile-phone').innerText = state.user.phone;
        document.getElementById('profile-role-badge').innerText = state.user.role === 'admin' ? 'ADM' : 'VIP';
        document.getElementById('profile-status').innerText = state.user.role === 'admin' ? 'Administrator' : 'VIP Member';
    }
}

function handleWizardStep(e) {
    e.preventDefault();
    if (state.wizardStep === 1) {
        state.wizardStep = 2;
        document.getElementById('wizard-step-1').style.display = 'none';
        document.getElementById('wizard-step-2').style.display = 'block';
        document.getElementById('wiz-username').required = true;
        document.getElementById('wiz-password').required = true;
    } else if (state.wizardStep === 2) {
        const u = document.getElementById('wiz-username').value;
        const p = document.getElementById('wiz-password').value;

        // Validasi khusus admin
        if (u.toLowerCase() === 'kholi' && p !== '123') {
            alert("Password Admin 'kholi' adalah 123!");
            return;
        }

        state.wizardStep = 3;
        document.getElementById('wizard-step-2').style.display = 'none';
        document.getElementById('wizard-step-3').style.display = 'block';
        document.getElementById('wiz-btn-next').innerText = "Selesai";
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
    }
}

/* FUNGSI UPLOAD FILE KODE UNTUK BACA GAMBAR/VIDEO */
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

async function handleAdminSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('admin-name').value;
    const desc = document.getElementById('admin-desc').value;
    
    // Mengambil file yang dipilih dari input file
    const imageFile = document.getElementById('admin-image-file').files[0];
    const videoFile = document.getElementById('admin-video-file').files[0];

    if (!imageFile || !videoFile) {
        alert("Pilih file Gambar dan Video dulu!");
        return;
    }

    try {
        // Konversi file lokal menjadi tautan data yang bisa ditampilkan di web
        const imageBase64 = await convertFileToBase64(imageFile);
        const videoBase64 = await convertFileToBase64(videoFile);

        const priceMatch = desc.match(/Rp\s?([\d.]+)/i);
        const price = priceMatch ? parseInt(priceMatch[1].replace(/\./g, '')) : 10000000;

        const newProduct = {
            id: Date.now(),
            name: name,
            price: price,
            desc: desc,
            image: imageBase64, // Hasil upload gambar
            video: videoBase64, // Hasil upload video
            rating: 5.0,
            sold: 0
        };

        state.products.unshift(newProduct);
        saveState();
        document.getElementById('admin-form').reset();
        alert("Produk dan Berkas Media Berhasil Di-Upload!");
    } catch (err) {
        alert("Gagal Membaca File Upload.");
    }
}

/* RENDER TAMPILAN PRODUK */
function formatRupiah(num) {
    return "Rp " + num.toLocaleString('id-ID');
}

function renderProducts() {
    const gridContainer = document.getElementById('product-grid');
    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    state.products.forEach(p => {
        gridContainer.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}" class="product-img">
                <div class="product-info">
                    <div class="product-title">${p.name}</div>
                    <div class="product-price">${formatRupiah(p.price)}</div>
                    <p style="font-size:11px; color:#666;">${p.desc}</p>

                    <!-- Preview Video Hasil Upload -->
                    <video controls style="width:100%; margin-top:8px; border-radius:4px;">
                        <source src="${p.video}">
                    </video>

                    <button class="btn btn-accent" style="margin-top:8px;" onclick="addToCart(${p.id})">Beli Sekarang</button>
                </div>
            </div>
        `;
    });
}

function addToCart(id) {
    const p = state.products.find(item => item.id === id);
    if(p) {
        state.cart.push(p);
        saveState();
        alert("Masuk Keranjang!");
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`view-${tabName}`).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function confirmLogout() {
    localStorage.removeItem('app_user');
    location.reload();
}

document.addEventListener('DOMContentLoaded', updateUI);
